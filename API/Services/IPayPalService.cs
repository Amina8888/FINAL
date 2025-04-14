// Назначение: Создание сессии оплаты, подтверждение платежа.

using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using Microsoft.Extensions.Configuration;

namespace API.Services;

public interface IPayPalService
{
    Task<string?> CreateCheckoutSessionAsync(Guid consultationId, double amount);
    Task<bool> CapturePaymentAsync(string orderId, Guid consultationId);
}


public class PayPalService : IPayPalService
{
    private readonly IConfiguration _config;
    private readonly HttpClient _httpClient;
    private readonly ApplicationDbContext _context;

    public PayPalService(IConfiguration config, IHttpClientFactory factory, ApplicationDbContext context)
    {
        _config = config;
        _httpClient = factory.CreateClient();
        _context = context;
    }

    private async Task<string> GetAccessTokenAsync()
    {
        var clientId = _config["PayPal:ClientId"];
        var secret = _config["PayPal:ClientSecret"];
        var auth = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{clientId}:{secret}"));

        var request = new HttpRequestMessage(HttpMethod.Post, $"{_config["PayPal:BaseUrl"]}/v1/oauth2/token");
        request.Headers.Authorization = new AuthenticationHeaderValue("Basic", auth);
        request.Content = new StringContent("grant_type=client_credentials", Encoding.UTF8, "application/x-www-form-urlencoded");

        var response = await _httpClient.SendAsync(request);
        var content = await response.Content.ReadAsStringAsync();

        var json = JsonDocument.Parse(content);
        return json.RootElement.GetProperty("access_token").GetString()!;
    }

    public async Task<string?> CreateCheckoutSessionAsync(Guid consultationId, double amount)
    {
        var accessToken = await GetAccessTokenAsync();

        var requestBody = new
        {
            intent = "CAPTURE",
            purchase_units = new[]
            {
                new {
                    reference_id = consultationId.ToString(),
                    amount = new {
                        currency_code = "USD",
                        value = amount.ToString("F2", CultureInfo.InvariantCulture)
                    }
                }
            },
            application_context = new
            {
                return_url = $"https://yourapp.com/api/payment/success?consultationId={consultationId}",
                cancel_url = "https://yourapp.com/payment/cancelled"
            }
        };

        var request = new HttpRequestMessage(HttpMethod.Post, $"{_config["PayPal:BaseUrl"]}/v2/checkout/orders");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        request.Content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

        var response = await _httpClient.SendAsync(request);
        var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync());

        var link = json.RootElement.GetProperty("links")
            .EnumerateArray()
            .FirstOrDefault(l => l.GetProperty("rel").GetString() == "approve");

        if (link.ValueKind == JsonValueKind.Undefined)
            return null;

        return link.GetProperty("href").GetString();

    }

    public async Task<bool> CapturePaymentAsync(string orderId, Guid consultationId)
    {
        var accessToken = await GetAccessTokenAsync();

        var request = new HttpRequestMessage(HttpMethod.Post, $"{_config["PayPal:BaseUrl"]}/v2/checkout/orders/{orderId}/capture");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        var response = await _httpClient.SendAsync(request);
        if (!response.IsSuccessStatusCode) return false;

        var consultation = await _context.Consultations.FindAsync(consultationId);
        if (consultation == null) return false;

        consultation.IsPaid = true;
        await _context.SaveChangesAsync();

        return true;
    }
}

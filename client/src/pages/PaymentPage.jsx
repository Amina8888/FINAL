// POST /api/payment/create/{consultationId} (возвращает checkoutUrl)

// После оплаты PayPal вызывает GET /api/payment/success?token=..., который обновляет статус

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const { consultationId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return navigate("/login");

    fetch(`https://localhost:5085/api/payment/create/${consultationId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl; // перенаправление на PayPal
        } else {
          alert("Ошибка при создании оплаты");
          navigate("/dashboard");
        }
      });
  }, [consultationId, navigate]);

  return (
    <div className="p-8 text-center text-white">
      <h2 className="text-2xl font-bold">Перенаправление на PayPal...</h2>
    </div>
  );
}

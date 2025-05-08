// 🔄 Backend должен поддерживать:
// GET /api/client/specialists/:id

// POST /api/consultations/book — с телом { specialistId: UUID }, возвращает consultationId

// GET /api/calendar/available?specialistId=... → возвращает [{ id, dateTime }]

// POST /api/consultations/book → { specialistId, slotId } → возвращает consultationId
// 🧠 API должен возвращать:
// json
// Копировать

// {
//     "fullName": "Айгуль М.",
//     "category": "Психолог",
//     "subcategory": "Семейная терапия",
//     "resume": "Опыт работы 10 лет...",
//     "pricePerConsultation": 25,
//     "licenseDocumentUrl": "/licenses/license1.pdf",
//     "isLicenseApproved": true
//   }
// ✅ Backend должен поддерживать:
// Method	URL	Описание
// POST	/api/review/add	{ consultationId, rating, text }
// GET	/api/review/specialist/{id}	[ { id, rating, text, createdAt } ]
  

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BookingForm from "../components/BookingForm";
import ReviewList from "../components/ReviewList";


export default function SpecialistProfile() {
  const { id } = useParams();
  const [specialist, setSpecialist] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://localhost:5085/api/client/specialists/${id}`)
      .then((res) => res.json())
      .then(setSpecialist)
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await fetch("https://localhost:5085/api/consultations/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ specialistId: id }),
      });

      if (!res.ok) throw new Error("Ошибка при бронировании");

      const result = await res.json();
      alert("Бронирование успешно! Оплатите на следующем шаге.");
      // Перенаправление, например, на оплату
      // navigate(`/payment/${result.consultationId}`);
    } catch (err) {
      console.error(err);
      alert("Произошла ошибка.");
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (!specialist) return <p>Специалист не найден</p>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-zinc-800 rounded shadow-lg text-white">
    <div className="flex flex-col md:flex-row gap-6">
      <img
        src="/placeholder-profile.jpg"
        alt="Фото специалиста"
        className="w-40 h-40 object-cover rounded-full border border-zinc-700"
      />

      <div className="flex-1">
        <h2 className="text-2xl font-bold">{specialist.fullName}</h2>
        <p className="text-sm text-zinc-400 mb-1">{specialist.category} / {specialist.subcategory}</p>
        <p className="text-zinc-300 mt-2 whitespace-pre-line">{specialist.resume}</p>

        <div className="mt-4 space-y-2">
          <p>
            <strong>Цена консультации:</strong>{" "}
            <span className="text-green-400">${specialist.pricePerConsultation}</span>
          </p>

          {specialist.licenseDocumentUrl && (
            <div>
              <p>
                <strong>Лицензия:</strong>{" "}
                <a
                  href={specialist.licenseDocumentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Посмотреть документ
                </a>
              </p>
              <p className={specialist.isLicenseApproved ? "text-green-400" : "text-yellow-400"}>
                {specialist.isLicenseApproved ? "✅ Подтверждена" : "⏳ На проверке"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>

    <hr className="my-6 border-zinc-700" />

    <BookingForm specialistId={id} />
    <ReviewList specialistId={id} />

  </div>
  );
}

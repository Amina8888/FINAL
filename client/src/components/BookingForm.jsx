import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BookingForm({ specialistId }) {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://localhost:5001/api/calendar/available?specialistId=${specialistId}`)
      .then((res) => res.json())
      .then(setSlots)
      .finally(() => setLoading(false));
  }, [specialistId]);

  const handleBook = async () => {
    if (!selectedSlot) return alert("Выберите дату и время");

    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const res = await fetch("https://localhost:5001/api/consultations/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ specialistId, slotId: selectedSlot }),
    });

    if (!res.ok) {
      alert("Ошибка при бронировании");
      return;
    }

    const { consultationId } = await res.json();
    navigate(`/payment/${consultationId}`);
  };

  if (loading) return <p className="text-gray-300">Загрузка слотов...</p>;
  if (!slots.length) return <p className="text-yellow-400">Нет доступных слотов</p>;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Выберите дату и время:</h3>
      <select
        className="bg-zinc-700 text-white p-2 rounded w-full mb-4"
        value={selectedSlot}
        onChange={(e) => setSelectedSlot(e.target.value)}
      >
        <option value="">-- Выберите слот --</option>
        {slots.map((slot) => (
          <option key={slot.id} value={slot.id}>
            {new Date(slot.dateTime).toLocaleString("ru-RU")}
          </option>
        ))}
      </select>

      <button
        onClick={handleBook}
        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
      >
        Назначить консультацию
      </button>
    </div>
  );
}

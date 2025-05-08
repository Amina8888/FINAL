// 🛠 Backend должен поддерживать:
// Метод	URL	Описание
// GET	/api/calendar/my	Получить свои слоты
// POST	/api/calendar/add	Добавить слот { dateTime }
// DELETE	/api/calendar/remove/{slotId}	Удалить слот

import { useEffect, useState } from "react";

export default function CalendarManager() {
  const [slots, setSlots] = useState([]);
  const [dateTime, setDateTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const fetchSlots = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://localhost:5001/api/calendar/my-slots", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Ошибка при получении слотов");
      const data = await res.json();
      setSlots(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleAddSlot = async () => {
    if (!dateTime) return;
    try {
      const localDate = new Date(dateTime);
      const utcDateTime = localDate.toISOString();

      const res = await fetch("https://localhost:5001/api/calendar/create-slot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dateTime: utcDateTime }),
      });
      if (!res.ok) throw new Error("Ошибка при добавлении слота");
      setDateTime("");
      fetchSlots();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteSlot = async (id) => {
    try {
      const res = await fetch(`https://localhost:5001/api/calendar/remove/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Ошибка при удалении слота");
      fetchSlots();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-zinc-800 p-6 rounded shadow text-white">
    <div className="max-w-2xl mx-auto bg-zinc-800 p-6 rounded shadow text-white">
      <h2 className="text-xl font-bold mb-4">Управление слотами</h2>
      <p className="text-sm text-gray-400 mb-2">
        Ваш часовой пояс: {timeZone}
      </p>

      {error && <div className="text-red-500 mb-2">{error}</div>}
      <p className="text-sm text-gray-400 mb-2">
        Ваш часовой пояс: {timeZone}
      </p>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      <input
        type="datetime-local"
        className="p-2 w-full bg-zinc-700 text-white rounded mb-3"
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
      />
      <button
        onClick={handleAddSlot}
        className="w-full bg-blue-600 py-2 rounded hover:bg-blue-500 mb-4 disabled:opacity-50"
        disabled={!dateTime || loading}
        className="w-full bg-blue-600 py-2 rounded hover:bg-blue-500 mb-4 disabled:opacity-50"
        disabled={!dateTime || loading}
      >
        {loading ? "Добавление..." : "Добавить слот"}
        {loading ? "Добавление..." : "Добавить слот"}
      </button>

      {loading ? (
        <p>Загрузка слотов...</p>
      ) : slots.length === 0 ? (
        <p className="text-gray-400">Нет доступных слотов</p>
      ) : (
        <ul className="space-y-2">
          {slots.map((slot) => {
            const localDate = new Date(slot.dateTime);
            const formattedDate = localDate.toLocaleString("ru-RU", { timeZone });
            return (
              <li
                key={slot.id}
                className="flex justify-between items-center bg-zinc-700 px-4 py-2 rounded"
              >
                <span>{formattedDate}</span>
                <button
                  onClick={() => handleDeleteSlot(slot.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Удалить
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div> // Закрывающий тег для основного <div>
      {loading ? (
        <p>Загрузка слотов...</p>
      ) : slots.length === 0 ? (
        <p className="text-gray-400">Нет доступных слотов</p>
      ) : (
        <ul className="space-y-2">
          {slots.map((slot) => {
            const localDate = new Date(slot.dateTime);
            const formattedDate = localDate.toLocaleString("ru-RU", { timeZone });
            return (
              <li
                key={slot.id}
                className="flex justify-between items-center bg-zinc-700 px-4 py-2 rounded"
              >
                <span>{formattedDate}</span>
                <button
                  onClick={() => handleDeleteSlot(slot.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Удалить
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div> // Закрывающий тег для основного <div>
  );
}

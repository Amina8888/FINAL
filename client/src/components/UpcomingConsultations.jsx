import { useEffect, useState } from "react";
import { getGoogleCalendarUrl } from "../utils/googleCalendar";


export default function UpcomingConsultations() {
  const [consultations, setConsultations] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchConsultations = async () => {
      const res = await fetch("https://localhost:5085/api/consultations/upcoming", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setConsultations(data);
    };

    fetchConsultations();
  }, []);

  const now = new Date();

  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold mb-2">Предстоящие консультации</h3>
      <ul className="space-y-2">
        {consultations.map((c) => {
          const dt = new Date(c.dateTime);
          const diffMinutes = (dt - now) / 60000;
          const highlight = diffMinutes <= 15 && diffMinutes > 0;

          return (
            <li
              key={c.id}
              className={`p-3 rounded bg-zinc-700 ${
                highlight ? "border-l-4 border-yellow-400" : ""
              }`}
            >
              <div>
                🕓 {dt.toLocaleString("ru-RU")}
                {highlight && (
                  <span className="text-yellow-300 ml-2 font-semibold">Через {Math.round(diffMinutes)} мин</span>
                )}
              </div>
              <div className="text-sm opacity-75">
                {c.withWhomRole === "Client"
                  ? `Клиент: ${c.withWhomName}`
                  : `Специалист: ${c.withWhomName}`}
              </div>
            </li>
          );
        })}
      </ul>
      <a
        href={getGoogleCalendarUrl({
            title: "Онлайн консультация",
            description: `Встреча с ${c.withWhomName}`,
            startTime: dt,
            endTime: new Date(dt.getTime() + 30 * 60000), // +30 минут
        })}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-400 hover:underline ml-1"
      >
        Добавить в Google Calendar
    </a>
    </div>
  );
}

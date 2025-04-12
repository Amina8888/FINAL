// Backend должен поддерживать:
// GET /api/consultations/upcoming

// И возвращать JSON:

// json
// Копировать
// [
//   {
//     "id": "guid",
//     "dateTime": "2025-04-06T13:30:00Z",
//     "withWhomRole": "Client",
//     "withWhomName": "Алиса"
//   }
// ]
// (чтобы и клиент, и специалист знали, с кем у них встреча)

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UpcomingConsultations from "../components/UpcomingConsultations";


export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Добро пожаловать в панель!</h1>
      <UpcomingConsultations />
      <p>Здесь будет ваша активность, календарь и история консультаций.</p>
    </div>
  );
}

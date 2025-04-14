// Backend должен поддерживать:
// Метод	URL	Описание
// GET	/api/specialist/profile	Получить текущий профиль
// PUT	/api/specialist/update-profile	Обновить профиль специалиста
// POST	/api/specialist/upload-license	Загрузить новую лицензию

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    category: "",
    subcategory: "",
    resume: "",
    pricePerConsultation: "",
  });

  const [license, setLicense] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("https://localhost:5001/api/specialist/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setForm);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("https://localhost:5001/api/specialist/update-profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (license) {
      const data = new FormData();
      data.append("file", license);
      await fetch("https://localhost:5001/api/specialist/upload-license", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });
    }

    setMessage("Профиль обновлён!");
    setTimeout(() => navigate("/dashboard"), 1500);
  };

  return (
    <div className="max-w-xl mx-auto mt-8 bg-zinc-800 p-6 rounded text-white">
      <h2 className="text-xl font-bold mb-4">Редактировать профиль</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {["fullName", "category", "subcategory", "resume", "pricePerConsultation"].map((field) => (
          <div key={field}>
            <label className="block text-sm capitalize mb-1">{field}</label>
            {field === "resume" ? (
              <textarea
                className="w-full bg-zinc-700 p-2 rounded"
                rows={4}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              />
            ) : (
              <input
                type={field === "pricePerConsultation" ? "number" : "text"}
                className="w-full bg-zinc-700 p-2 rounded"
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              />
            )}
          </div>
        ))}

        <div>
          <label className="block text-sm mb-1">Загрузить новую лицензию</label>
          <input
            type="file"
            accept="application/pdf,image/*"
            className="text-white"
            onChange={(e) => setLicense(e.target.files[0])}
          />
        </div>

        <button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500">Сохранить</button>
        {message && <p className="text-green-400 mt-2">{message}</p>}
      </form>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function SpecialistList() {
  const [specialists, setSpecialists] = useState([]);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const categories = [...new Set(specialists.map((s) => s.category))];


  useEffect(() => {
    fetch("https://localhost:5001/api/client/specialists")
      .then((res) => res.json())
      .then((data) => {
        setSpecialists(data);
        setFiltered(data);
      });
  }, []);

  const handleSearch = (q) => {
    setQuery(q);
    const lower = q.toLowerCase();
    setFiltered(
      specialists.filter(
        (s) =>
          s.fullName.toLowerCase().includes(lower) ||
          s.category.toLowerCase().includes(lower) ||
          s.subcategory?.toLowerCase().includes(lower)
      )
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Все специалисты</h1>
      <select
        className="w-full p-2 mb-4 bg-zinc-700 rounded"
        onChange={(e) => {
        const selected = e.target.value;
        if (selected === "all") {
        setFiltered(specialists);
        } else {
        setFiltered(
            specialists.filter((s) => s.category === selected)
        );
        }
    }}
    >
    <option value="all">Все категории</option>
    {categories.map((cat) => (
        <option key={cat} value={cat}>
        {cat}
        </option>
    ))}
    </select>

      <input
        className="w-full p-2 mb-4 bg-zinc-700 rounded"
        placeholder="Поиск по имени, категории или подкатегории..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <p className="text-gray-400">Ничего не найдено</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((s) => (
            <Link
              key={s.id}
              to={`/specialist/${s.id}`}
              className="block bg-zinc-800 p-4 rounded hover:bg-zinc-700"
            >
              <h2 className="text-lg font-bold">{s.fullName}</h2>
              <p className="text-sm text-zinc-400">
                {s.category} / {s.subcategory}
              </p>
              <p className="text-sm mt-2">
                💰 ${s.pricePerConsultation} · ⭐ {s.averageRating?.toFixed(1) || "—"}
              </p>
              <p className="text-xs text-green-400 mt-1">
                {s.isLicenseApproved ? "✅ Лицензия подтверждена" : "⏳ Лицензия не проверена"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";

export default function ReviewList({ specialistId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`https://localhost:5001/api/review/specialist/${specialistId}`)
      .then((res) => res.json())
      .then(setReviews);
  }, [specialistId]);

  if (!reviews.length) return <p className="text-gray-400 mt-4">Отзывов пока нет.</p>;

  const average =
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-2">
        Отзывы ({reviews.length}) · ⭐ {average.toFixed(1)}
      </h3>

      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="bg-zinc-700 p-3 rounded">
            <div className="text-yellow-400">
              {"★".repeat(r.rating)}{" "}
              <span className="text-white text-sm opacity-50">
                · {new Date(r.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm mt-1">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

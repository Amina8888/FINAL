// Модель отзыва на фронте
// Мы будем использовать API:

// POST /api/review/add — оставить отзыв

// GET /api/review/specialist/{id} — получить отзывы специалиста
//-------------------------
//  Проверка отзыва только после получения консультации
//  Что нужно сделать:
//  🔒 Проверка должна быть на backend:
//  Пользователь — клиент этой консультации
 
//  Консультация завершена (IsFinished = true)
 
//  Отзыв ещё не был добавлен

// 🧠 Backend должен обрабатывать:
// GET /api/review/check/{consultationId}
// Пример ответа:

// json
// Копировать
// {
//   "canReview": true,
//   "alreadyReviewed": false
// }
// POST /api/review/add — должен:
// Проверить, что:

// Консультация IsFinished == true

// Автор — клиент

// Отзыв по этой консультации ещё не существует

// Только тогда сохранять

import { useEffect, useState } from "react";

export default function ReviewForm({ consultationId, onSubmitted }) {
    const [canReview, setCanReview] = useState(false);
    const [alreadyReviewed, setAlreadyReviewed] = useState(false);
    const [rating, setRating] = useState(5);
    const [text, setText] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const token = localStorage.getItem("token");
  
    useEffect(() => {
      fetch(`https://localhost:5001/api/review/check/${consultationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setCanReview(data.canReview);
          setAlreadyReviewed(data.alreadyReviewed);
        });
    }, [consultationId]);
  
    const submitReview = async () => {
      await fetch("https://localhost:5001/api/review/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ consultationId, rating, text }),
      });
  
      setSubmitted(true);
      if (onSubmitted) onSubmitted();
    };
  
    if (submitted || alreadyReviewed)
      return <p className="text-green-400">Спасибо за ваш отзыв!</p>;
  
    if (!canReview) return <p className="text-yellow-400">Оставить отзыв можно только после завершения консультации.</p>;
  
    return (
      <div className="bg-zinc-700 p-4 rounded mt-6">
        <h3 className="text-lg font-bold mb-2">Оставить отзыв</h3>
        <div className="flex gap-2 mb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              className={s <= rating ? "text-yellow-400" : "text-zinc-500"}
              onClick={() => setRating(s)}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          placeholder="Ваш отзыв"
          className="w-full bg-zinc-800 text-white p-2 rounded mb-2"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="bg-blue-600 px-4 py-1 rounded hover:bg-blue-500"
          onClick={submitReview}
        >
          Отправить
        </button>
      </div>
    );
  }
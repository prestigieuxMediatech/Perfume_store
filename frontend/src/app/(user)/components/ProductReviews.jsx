"use client";
import { useMemo, useState } from "react";
import axios from "axios";

const BASE = process.env.NEXT_PUBLIC_API_URL;

const formatReviewDate = (value) => {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "";
  }
};

const renderStars = (rating, className = "pd-review-stars") => (
  <div className={className} aria-label={`${rating} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, index) => (
      <span key={index} className={index < rating ? "filled" : ""}>
        ★
      </span>
    ))}
  </div>
);

export default function ProductReviews({
  productId,
  user,
  reviews = [],
  reviewSummary,
  onAuthRequired,
  onReviewSaved,
}) {
  const [form, setForm] = useState({
    rating: 5,
    title: "",
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const summary = useMemo(() => {
    const fallbackDistribution = [5, 4, 3, 2, 1].map((rating) => ({ rating, total: 0 }));
    return {
      average_rating: reviewSummary?.average_rating ?? null,
      total_reviews: reviewSummary?.total_reviews ?? reviews.length ?? 0,
      distribution: reviewSummary?.distribution?.length
        ? reviewSummary.distribution
        : fallbackDistribution,
    };
  }, [reviewSummary, reviews.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!user) {
      onAuthRequired?.();
      return;
    }

    setSubmitting(true);

    try {
      await axios.post(
        `${BASE}/api/auth/reviews`,
        {
          product_id: productId,
          rating: form.rating,
          title: form.title,
          comment: form.comment,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setMessage("Your review has been saved.");
      setForm({ rating: 5, title: "", comment: "" });
      await onReviewSaved?.();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save your review right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="pd-reviews-section">
      <div className="pd-reviews-header">
        <div>
          <span className="pd-reviews-kicker">Product Reviews</span>
          <h2 className="pd-reviews-title">What customers are saying</h2>
        </div>
        <p className="pd-reviews-copy">
          Honest product-specific feedback helps shoppers choose the right fragrance for their collection.
        </p>
      </div>

      <div className="pd-reviews-overview">
        <div className="pd-reviews-summary-card">
          <div className="pd-reviews-score">
            {summary.average_rating ? summary.average_rating.toFixed(1) : "New"}
          </div>
          {renderStars(Math.round(summary.average_rating || 0), "pd-review-stars lg")}
          <div className="pd-reviews-count">
            {summary.total_reviews} review{summary.total_reviews === 1 ? "" : "s"}
          </div>
        </div>

        <div className="pd-reviews-breakdown">
          {summary.distribution.map((item) => {
            const width = summary.total_reviews
              ? `${(item.total / summary.total_reviews) * 100}%`
              : "0%";

            return (
              <div key={item.rating} className="pd-review-bar-row">
                <span>{item.rating} Star</span>
                <div className="pd-review-bar">
                  <div className="pd-review-bar-fill" style={{ width }} />
                </div>
                <strong>{item.total}</strong>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pd-reviews-grid">
        <div className="pd-reviews-list">
          {reviews.length ? (
            reviews.map((review) => (
              <article key={review.id} className="pd-review-card">
                <div className="pd-review-card-top">
                  <div>
                    <h3>{review.title || "Loved it"}</h3>
                    <p>
                      {(review.name || `${review.first_name || ""} ${review.last_name || ""}`.trim() || "Verified Customer")}
                      {review.created_at ? ` • ${formatReviewDate(review.created_at)}` : ""}
                    </p>
                  </div>
                  {renderStars(Number(review.rating) || 0)}
                </div>
                <p className="pd-review-comment">{review.comment}</p>
              </article>
            ))
          ) : (
            <div className="pd-review-empty">
              No reviews yet for this product. Be the first to share your experience.
            </div>
          )}
        </div>

        <form className="pd-review-form" onSubmit={handleSubmit}>
          <div className="pd-review-form-header">
            <span className="pd-reviews-kicker">Write a Review</span>
            <h3>Share your experience</h3>
            <p>Help others with details on scent, longevity, projection, or overall value.</p>
          </div>

          <label className="pd-review-field">
            <span>Rating</span>
            <select name="rating" value={form.rating} onChange={handleChange}>
              <option value={5}>5 - Excellent</option>
              <option value={4}>4 - Very Good</option>
              <option value={3}>3 - Good</option>
              <option value={2}>2 - Fair</option>
              <option value={1}>1 - Poor</option>
            </select>
          </label>

          <label className="pd-review-field">
            <span>Review Title</span>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Example: Elegant and long-lasting"
              maxLength={120}
            />
          </label>

          <label className="pd-review-field">
            <span>Your Review</span>
            <textarea
              name="comment"
              value={form.comment}
              onChange={handleChange}
              placeholder="Tell others what stood out for you."
              rows={5}
              required
            />
          </label>

          {error && <div className="pd-review-status error">{error}</div>}
          {message && <div className="pd-review-status success">{message}</div>}

          <button type="submit" className="pd-review-submit" disabled={submitting}>
            {submitting ? "Saving Review..." : user ? "Submit Review" : "Login to Review"}
          </button>
        </form>
      </div>
    </section>
  );
}

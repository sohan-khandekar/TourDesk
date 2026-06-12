"use client";

import {
  AlertCircle,
  Briefcase,
  Calendar,
  CheckCircle,
  MessageSquare,
  Star,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { type ApiReview, createReview, fetchReviews } from "../services/api";

interface PlaceReviewsProps {
  placeId: string;
}

export function PlaceReviews({ placeId }: PlaceReviewsProps) {
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    async function loadReviews() {
      try {
        setLoading(true);
        const data = await fetchReviews(placeId);
        setReviews(data);
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, [placeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const newReview = await createReview({
        place_id: placeId,
        user_name: name,
        user_occupation: occupation,
        rating,
        comment,
        email,
      });

      setReviews((prev) => [newReview, ...prev]);
      setName("");
      setOccupation("");
      setEmail("");
      setRating(5);
      setComment("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error("Failed to submit review:", err);
      const axiosError = err as { response?: { data?: { detail?: string } } };
      setError(
        axiosError.response?.data?.detail ||
          "Something went wrong. Please check your inputs and try again.",
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "0.0";

  const ratingCounts = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { stars, count, percentage };
  });

  return (
    <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-10">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-indigo-500" />
        User Feedback & Reviews
      </h2>

      {/* Overview and Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 text-center flex flex-col justify-center items-center border border-slate-100 dark:border-slate-800">
          <div className="text-5xl font-extrabold text-slate-950 dark:text-white mb-2">
            {averageRating}
          </div>
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(Number(averageRating))
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-300 dark:text-slate-700"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Based on {reviews.length} independent user reviews
          </p>
        </div>

        {/* Rating Breakdown */}
        <div className="md:col-span-2 flex flex-col justify-center gap-2">
          {ratingCounts.map(({ stars, count, percentage }) => (
            <div key={stars} className="flex items-center gap-4 text-sm">
              <span className="w-12 text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1">
                {stars} Star
              </span>
              <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-right text-slate-500 dark:text-slate-400 font-semibold">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-6 max-h-[600px] overflow-y-auto pr-2">
          {loading ? (
            <div className="text-center py-10 text-slate-500">
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 dark:bg-slate-900/30 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-500">
              No reviews yet. Be the first to leave feedback!
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white dark:bg-slate-950 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition hover:shadow-md"
              >
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      {rev.user_name}
                    </h4>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1 mt-0.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      {rev.user_occupation}
                    </p>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= rev.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200 dark:text-slate-800"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed italic">
                  "{rev.comment}"
                </p>
                <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-900/50 flex justify-between items-center text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(rev.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider text-slate-500">
                    Verified Adoption Review
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Submit Review Form */}
        <div className="bg-slate-50 dark:bg-slate-900/30 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 h-fit">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Leave a Review
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            Your review helps us evaluate TourDesk's design, usability, and
            adoption alignment. Please specify your real-world role or
            occupation.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="user-name"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Your Full Name
              </label>
              <input
                id="user-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aditya Varma"
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="user-occupation"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Occupation / Role
              </label>
              <input
                id="user-occupation"
                type="text"
                required
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="e.g. Travel Blogger, BITS Student, Guide"
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="user-email"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Email Address
              </label>
              <input
                id="user-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. aditya@example.com"
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Rating
              </span>
              <div className="flex gap-1.5 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= (hoverRating || rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300 dark:text-slate-700"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="user-comment"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Review Comments
              </label>
              <textarea
                id="user-comment"
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience using TourDesk (e.g. features, redirects, layout, suggestions)..."
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-xs text-red-600 dark:text-red-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 text-xs text-emerald-600 dark:text-emerald-455 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Review submitted successfully! Thank you.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-sm py-2 px-4 rounded-lg shadow transition-colors flex items-center justify-center gap-2"
            >
              {submitLoading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

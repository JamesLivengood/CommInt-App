import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSubject, getRatings, createRating } from "../api/client";

function StarScore({ score }) {
  return (
    <span className="star-score">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= score ? "star filled" : "star"}>★</span>
      ))}
    </span>
  );
}

function RatingForm({ subjectId, onRatingAdded }) {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const rating = await createRating(subjectId, score, comment.trim());
      onRatingAdded(rating);
      setScore(0);
      setComment("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="rating-form" onSubmit={handleSubmit}>
      <h3>Add a Rating</h3>
      <div className="star-picker">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={n <= score ? "star filled" : "star"}
            onClick={() => setScore(n)}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        placeholder="Your comment…"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading || score === 0 || !comment.trim()}>
        {loading ? "Saving…" : "Submit Rating"}
      </button>
    </form>
  );
}

export default function SubjectShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [subjectData, ratingsData] = await Promise.all([
          getSubject(id),
          getRatings(id, page),
        ]);
        setSubject(subjectData);
        setRatings(ratingsData.ratings);
        setPagination(ratingsData.pagination);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, page]);

  async function handlePageChange(newPage) {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleRatingAdded(newRating) {
    setPage(1);
    try {
      const [subjectData, ratingsData] = await Promise.all([
        getSubject(id),
        getRatings(id, 1),
      ]);
      setSubject(subjectData);
      setRatings(ratingsData.ratings);
      setPagination(ratingsData.pagination);
    } catch {}
  }

  if (loading) return <div className="loading">Loading…</div>;
  if (error) return <div className="error-page">{error}</div>;
  if (!subject) return null;

  return (
    <div className="subject-show">
      <button className="back-btn" onClick={() => navigate("/")}>← Back</button>
      <h1>{subject.name}</h1>
      <div className="average-score">
        {subject.average_score !== null ? (
          <>
            <span className="avg-number">{subject.average_score}</span>
            <StarScore score={Math.round(subject.average_score)} />
            <span className="avg-label">average</span>
          </>
        ) : (
          <span className="avg-label">No ratings yet</span>
        )}
      </div>

      <RatingForm subjectId={id} onRatingAdded={handleRatingAdded} />

      <div className="ratings-list">
        <h2>Ratings</h2>
        {ratings.length === 0 ? (
          <p className="no-results">No ratings yet. Be the first!</p>
        ) : (
          ratings.map((r) => (
            <div key={r.id} className="rating-card">
              <div className="rating-header">
                <StarScore score={r.score} />
                <span className="rating-date">
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="rating-comment">{r.comment}</p>
            </div>
          ))
        )}
      </div>

      {pagination && pagination.total_pages > 1 && (
        <div className="pagination">
          {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={p === pagination.current_page ? "page-btn active" : "page-btn"}
              onClick={() => handlePageChange(p)}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchSubjects } from "../api/client";
import NewSubjectModal from "../components/NewSubjectModal";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await searchSubjects(query);
        setResults(data);
        setShowDropdown(true);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 250);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(subject) {
    setShowDropdown(false);
    navigate(`/subjects/${subject.id}`);
  }

  function handlePlusClick() {
    setShowDropdown(false);
    setShowModal(true);
  }

  function handleCreated(subject) {
    setShowModal(false);
    navigate(`/subjects/${subject.id}`);
  }

  return (
    <div className="home">
      <h1>Subjects</h1>
      <div className="search-row" ref={wrapperRef}>
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search subjects…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setShowDropdown(true)}
          />
          {showDropdown && (
            <ul className="dropdown">
              {results.length === 0 && !searching && (
                <li className="no-results">No subjects found</li>
              )}
              {results.map((s) => (
                <li key={s.id} onMouseDown={() => handleSelect(s)}>
                  {s.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button className="plus-btn" onClick={handlePlusClick} title="New subject">
          +
        </button>
      </div>
      {showModal && (
        <NewSubjectModal
          initialName={query}
          onCreated={handleCreated}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

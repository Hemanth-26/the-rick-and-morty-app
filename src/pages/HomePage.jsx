import { useState, useCallback, useMemo, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Character from "../components/Character";
import CharacterModal from "../components/CharacterModal";
import Filters from "../components/Filters";
import SkeletonCard from "../components/SkeletonCard";
import { useDebounce } from "../hooks/useDebounce";
import { useCharacters } from "../hooks/useCharacters";
import "../App.css";

const SKELETON_COUNT = 20;
const skeletons = Array.from({ length: SKELETON_COUNT }, (_, i) => (
  <SkeletonCard key={i} />
));

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const navigate = useNavigate();
  const gridRef = useRef(null);

  const nameQuery = searchParams.get("name") || "";
  const statusFilter = searchParams.get("status") || "";
  const page = Number(searchParams.get("page")) || 1;

  const debouncedName = useDebounce(nameQuery, 400);

  const { characters, info, loading, error } = useCharacters({
    page,
    name: debouncedName,
    status: statusFilter,
  });

  const updateParams = useCallback(
    (updates) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(updates).forEach(([key, value]) => {
          if (!value || value === "1" || (key === "page" && Number(value) <= 1)) {
            next.delete(key);
          } else {
            next.set(key, String(value));
          }
        });
        return next;
      }, { replace: true });
    },
    [setSearchParams]
  );

  const handleNameChange = useCallback(
    (value) => updateParams({ name: value, page: "1" }),
    [updateParams]
  );

  const handleStatusChange = useCallback(
    (value) => updateParams({ status: value, page: "1" }),
    [updateParams]
  );

  const handleCardClick = useCallback((character) => {
    setSelectedCharacter(character);
    navigate(`/character/${character.id}`);
  }, [navigate]);

  const handleCloseModal = useCallback(() => {
    setSelectedCharacter(null);
    navigate(-1);
  }, [navigate]);

  const handlePrev = useCallback(
    () => updateParams({ page: String(Math.max(1, page - 1)) }),
    [page, updateParams]
  );

  const handleNext = useCallback(
    () => updateParams({ page: String(Math.min(info.pages, page + 1)) }),
    [page, info.pages, updateParams]
  );

  const handleGridKeyDown = useCallback((e) => {
    const grid = gridRef.current;
    if (!grid || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;

    const cards = [...grid.querySelectorAll("[tabindex='0']")];
    const idx = cards.indexOf(document.activeElement);
    if (idx === -1) return;

    e.preventDefault();
    const cols = Math.round(grid.offsetWidth / cards[0].offsetWidth);
    let next = idx;

    if (e.key === "ArrowRight") next = Math.min(cards.length - 1, idx + 1);
    else if (e.key === "ArrowLeft") next = Math.max(0, idx - 1);
    else if (e.key === "ArrowDown") next = Math.min(cards.length - 1, idx + cols);
    else if (e.key === "ArrowUp") next = Math.max(0, idx - cols);

    cards[next]?.focus();
  }, []);

  const grid = useMemo(
    () =>
      characters.map((c) => (
        <Character key={c.id} character={c} onClick={handleCardClick} />
      )),
    [characters, handleCardClick]
  );

  return (
    <>
      <h1 className="app__title">Rick &amp; Morty Characters</h1>
      <Filters
        nameQuery={nameQuery}
        onNameChange={handleNameChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
      />

      <div aria-live="polite" aria-atomic="true">
        {!loading && error && <p className="message message--error">{error}</p>}
        {!loading && !error && characters.length === 0 && (
          <p className="message">No characters found.</p>
        )}
      </div>

      {loading && <div className="app__grid">{skeletons}</div>}

      {!loading && !error && characters.length > 0 && (
        <>
          <div
            className="app__grid"
            ref={gridRef}
            onKeyDown={handleGridKeyDown}
          >
            {grid}
          </div>
          <nav className="app__pagination" aria-label="Pagination">
            <button className="btn btn--prev" onClick={handlePrev} disabled={page === 1}>
              Prev
            </button>
            <span className="app__page-info">
              Page {page} of {info.pages}
            </span>
            <button
              className="btn btn--next"
              onClick={handleNext}
              disabled={page === info.pages}
            >
              Next
            </button>
          </nav>
        </>
      )}

      {selectedCharacter && (
        <CharacterModal
          character={selectedCharacter}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}

export default HomePage;

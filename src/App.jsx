import { useState, useCallback, useMemo, useRef } from "react";
import Character from "./components/Character";
import CharacterModal from "./components/CharacterModal";
import Filters from "./components/Filters";
import SkeletonCard from "./components/SkeletonCard";
import { useDebounce } from "./hooks/useDebounce";
import { useCharacters } from "./hooks/useCharacters";
import { useSearchParams } from "./hooks/useSearchParams";
import "./App.css";

const SKELETON_COUNT = 20;
const skeletons = Array.from({ length: SKELETON_COUNT }, (_, i) => (
  <SkeletonCard key={i} />
));

function App() {
  const [params, setParams] = useSearchParams();
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const gridRef = useRef(null);

  const debouncedName = useDebounce(params.name, 400);
  const { characters, info, loading, error } = useCharacters({
    page: params.page,
    name: debouncedName,
    status: params.status,
  });

  const handleNameChange = useCallback(
    (value) => setParams({ name: value, page: 1 }),
    [setParams]
  );

  const handleStatusChange = useCallback(
    (value) => setParams({ status: value, page: 1 }),
    [setParams]
  );

  const handleCardClick = useCallback((character) => {
    setSelectedCharacter(character);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedCharacter(null);
  }, []);

  const handlePrev = useCallback(
    () => setParams({ page: Math.max(1, params.page - 1) }),
    [params.page, setParams]
  );

  const handleNext = useCallback(
    () => setParams({ page: Math.min(info.pages, params.page + 1) }),
    [params.page, info.pages, setParams]
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
    <main className="app">
      <h1 className="app__title">Rick &amp; Morty Characters</h1>

      <Filters
        nameQuery={params.name}
        onNameChange={handleNameChange}
        statusFilter={params.status}
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
            <button className="btn" onClick={handlePrev} disabled={params.page === 1}>
              Previous
            </button>
            <span className="app__page-info">
              Page {params.page} of {info.pages}
            </span>
            <button
              className="btn"
              onClick={handleNext}
              disabled={params.page === info.pages}
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
    </main>
  );
}

export default App;

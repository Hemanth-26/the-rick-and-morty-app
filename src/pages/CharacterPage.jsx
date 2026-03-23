import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCharacterById } from "../services/api";
import "./CharacterPage.css";

const statusClassMap = {
  Alive: "badge--alive",
  Dead: "badge--dead",
  unknown: "badge--unknown",
};

function CharacterPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchCharacterById(id, controller.signal)
      .then((data) => setCharacter(data))
      .catch((error) => {
        if (controller.signal.aborted) return;
        if (error.message?.includes("429")) {
          setError("Too many requests. Please wait and try again.");
        } else {
          setError("Failed to load character.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <div className="character-page">
        <div className="character-page__skeleton">
          <div className="character-page__img-placeholder shimmer" />
          <div className="character-page__body">
            <div className="skeleton-line skeleton-line--title" style={{ width: "60%" }} />
            <div className="skeleton-line skeleton-line--badge" style={{ width: "30%", marginTop: 12 }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="character-page">
        <p className="message message--error">{error}</p>
        <button className="btn" onClick={() => navigate(-1)}>Go back</button>
      </div>
    );
  }

  if (!character) return null;

  return (
    <div className="character-page">
      <button className="btn character-page__back" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      <div className="character-page__card">
        <img
          className="character-page__img"
          src={character.image}
          alt={character.name}
        />
        <div className="character-page__body">
          <h2 className="character-page__name">{character.name}</h2>
          <div className="character-page__badges">
            <span
              className={`badge ${statusClassMap[character.status] || "badge--unknown"}`}
            >
              {character.status}
            </span>
            <span className="badge">{character.species}</span>
            {character.gender && <span className="badge">{character.gender}</span>}
          </div>

          <div className="character-page__details">
            {character.type && <Detail label="Type" value={character.type} />}
            <Detail label="Origin" value={character.origin?.name} />
            <Detail label="Location" value={character.location?.name} />
            <Detail
              label="Episodes"
              value={`${character.episode?.length} episode(s)`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="character-page__detail-row">
      <span className="character-page__detail-label">{label}</span>
      <span className="character-page__detail-value">{value}</span>
    </div>
  );
}

export default CharacterPage;

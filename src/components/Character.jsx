import React, { useState } from "react";
import "./Character.css";

const statusClassMap = {
  Alive: "badge--alive",
  Dead: "badge--dead",
  unknown: "badge--unknown",
};

const Character = React.memo(function Character({ character, onClick }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(character);
    }
  };

  return (
    <article
      className="character-card"
      role="button"
      tabIndex={0}
      onClick={() => onClick(character)}
      onKeyDown={handleKeyDown}
    >
      <CharacterImage src={character.image} alt={character.name} key={character.id} />
      <div className="character-card__info">
        <h3 className="character-card__name">{character.name}</h3>
        <span
          className={`badge ${statusClassMap[character.status] || "badge--unknown"}`}
        >
          {character.status}
        </span>
      </div>
    </article>
  );
});

function CharacterImage({ src, alt }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="character-card__img-wrapper">
      <img
        className="character-card__img"
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
      />
      <div className={`shimmer ${loaded ? "shimmer--hidden" : ""}`} />
    </div>
  );
}

export default Character;

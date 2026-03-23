import React, { useEffect, useRef } from "react";
import "./CharacterModal.css";

const statusClassMap = {
  Alive: "badge--alive",
  Dead: "badge--dead",
  unknown: "badge--unknown",
};

const CharacterModal = React.memo(function CharacterModal({
  character,
  onClose,
}) {
  const modalRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    triggerRef.current = document.activeElement;
    const firstFocusable = modalRef.current?.querySelector("button");
    firstFocusable?.focus();
    return () => triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();

      if (e.key === "Tab") {
        const focusable = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!character) return null;

  return (
    <div className="overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={character.name}>
      <div className="modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <button className="modal__close-btn" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <img
          className="modal__img"
          src={character.image}
          alt={character.name}
        />
        <div className="modal__body">
          <h2 className="modal__name">{character.name}</h2>
          <div className="modal__badges">
            <span
              className={`badge ${statusClassMap[character.status] || "badge--unknown"}`}
            >
              {character.status}
            </span>
            <span className="badge">{character.species}</span>
          </div>
          <div className="modal__details">
            {character.type && (
              <Detail label="Type" value={character.type} />
            )}
            <Detail label="Gender" value={character.gender} />
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
});

function Detail({ label, value }) {
  return (
    <div className="modal__detail-row">
      <span className="modal__detail-label">{label}</span>
      <span className="modal__detail-value">{value}</span>
    </div>
  );
}

export default CharacterModal;

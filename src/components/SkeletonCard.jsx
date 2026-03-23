import React from "react";

const SkeletonCard = React.memo(function SkeletonCard() {
  return (
    <div className="character-card skeleton-card" aria-hidden="true">
      <div className="character-card__img-wrapper">
        <div className="shimmer" />
      </div>
      <div className="character-card__info">
        <div className="skeleton-line skeleton-line--title" />
        <div className="skeleton-line skeleton-line--badge" />
      </div>
    </div>
  );
});

export default SkeletonCard;

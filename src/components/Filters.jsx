import React from "react";
import "./Filters.css";

const Filters = React.memo(function Filters({
  nameQuery,
  onNameChange,
  statusFilter,
  onStatusChange,
}) {
  return (
    <div className="filters" role="search">
      <label className="sr-only" htmlFor="name-search">Search by name</label>
      <input
        id="name-search"
        className="input filters__input"
        type="text"
        placeholder="Search by name..."
        value={nameQuery}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <label className="sr-only" htmlFor="status-filter">Filter by status</label>
      <select
        id="status-filter"
        className="select filters__select"
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="">All</option>
        <option value="Alive">Alive</option>
        <option value="Dead">Dead</option>
        <option value="unknown">Unknown</option>
      </select>
    </div>
  );
});

export default Filters;

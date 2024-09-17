import React from 'react';

const FilterSelector = ({ filters, selectedFilter, onChange }) => {
  return (
    <div>
      <label htmlFor="filterSelector">Select filter: </label>
      <select
        id="filterSelector"
        value={selectedFilter}
        onChange={(e) => onChange(e.target.value)}
      >
        {Object.keys(filters).map((filter) => (
          <option key={filter} value={filter.name}>
            {filters[filter].name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterSelector;

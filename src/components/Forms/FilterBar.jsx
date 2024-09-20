// FilterBar.jsx
import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const FilterBar = ({
  searchName,
  setSearchName,
  searchIngredient,
  setSearchIngredient,
  sortOrder,
  handleSortChange,
}) => {
  const navigate = useNavigate();

  const handleAddRecipe = () => {
    navigate("/create-recipe");
  };
  return (
    <div className="container-input">
      <input
        type="text"
        placeholder="Buscar por nombre"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        className="search-input"
      />
      <input
        type="text"
        placeholder="Buscar por ingrediente"
        value={searchIngredient}
        onChange={(e) => setSearchIngredient(e.target.value)}
        className="search-input"
      />
      <select
        value={sortOrder}
        onChange={handleSortChange}
        className="sort-select"
      >
        <option value="A-Z">Ordenar A-Z</option>
        <option value="Z-A">Ordenar Z-A</option>
      </select>
      <button className="add-recipe-button" onClick={handleAddRecipe}>
        <FontAwesomeIcon icon={faPlus} size="2x" />
      </button>
    </div>
  );
};

FilterBar.propTypes = {
  searchName: PropTypes.string.isRequired,
  setSearchName: PropTypes.func.isRequired,
  searchIngredient: PropTypes.string.isRequired,
  setSearchIngredient: PropTypes.func.isRequired,
  sortOrder: PropTypes.string.isRequired,
  handleSortChange: PropTypes.func.isRequired,
  handleAddRecipe: PropTypes.func.isRequired,
};

export default FilterBar;

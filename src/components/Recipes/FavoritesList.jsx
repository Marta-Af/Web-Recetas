// src/components/FavoritesList.jsx
import React from "react";
import { useFavorites } from "../contexts/FavoritesContext";
import { useNavigate } from "react-router-dom";

const FavoritesList = () => {
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const handleViewRecipe = (id) => {
    navigate(`/receta/${id}`);
  };

  if (favorites.length === 0) {
    return <p>No tienes recetas en favoritos.</p>;
  }

  return (
    <div className="recipes-container">
      <ul className="recipes-list">
        {favorites.map((recipe) => (
          <li
            key={recipe.id}
            className="recipe-card"
            onClick={() => handleViewRecipe(recipe.id)}
          >
            <div className="card-front">
              <img
                src={`http://localhost:3000/uploads/${recipe.recipe_image}`}
                alt={recipe.recipe_name}
                className="recipe-image"
              />
              <h3 className="recipe-name">{recipe.recipe_name}</h3>
            </div>
            <div className="card-back">
              <h4>Ingredientes:</h4>
              <ul className="ingredients-list">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={`${recipe.id}-${index}`}>
                    {ingredient.ingredient_name}
                  </li>
                ))}
              </ul>
              <h4>Modo de empleo:</h4>
              <p>{recipe.recipe_instructions}</p>
              <p>Dificultad: {recipe.difficulty}</p>
              <p>Tiempo: {recipe.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritesList;

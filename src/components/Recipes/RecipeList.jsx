import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FilterBar from "../Forms/FilterBar";

const RecipesList = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchIngredient, setSearchIngredient] = useState("");
  const [sortOrder, setSortOrder] = useState("A-Z");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/recipes");
        const data = await response.json();
        setRecipes(data.result);
      } catch (error) {
        console.error("Error al obtener las recetas:", error);
      }
    };

    fetchRecipes();
  }, []);

  const handleViewRecipe = (id) => {
    navigate(`/receta/${id}`);
  };

  const handleAddRecipe = () => {
    navigate("/create-recipe");
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const sortRecipes = (recipes) => {
    return [...recipes].sort((a, b) => {
      if (sortOrder === "A-Z") {
        return a.recipe_name.localeCompare(b.recipe_name);
      } else {
        return b.recipe_name.localeCompare(a.recipe_name);
      }
    });
  };

  // Filtro por nombre
  const filteredRecipesByName = sortRecipes(
    recipes.filter((recipe) =>
      recipe.recipe_name.toLowerCase().includes(searchName.toLowerCase())
    )
  );

  // Filtro por ingrediente
  const filteredRecipesByIngredient = sortRecipes(
    recipes.filter((recipe) =>
      recipe.ingredients.some((ingredient) =>
        ingredient.ingredient_name
          .toLowerCase()
          .includes(searchIngredient.toLowerCase())
      )
    )
  );

  // Combinación de ambos filtros: nombre e ingrediente
  const filteredRecipes = filteredRecipesByName.filter((recipe) =>
    filteredRecipesByIngredient.includes(recipe)
  );

  return (
    <div className="recipes-container">
      <FilterBar
        searchName={searchName}
        setSearchName={setSearchName}
        searchIngredient={searchIngredient}
        setSearchIngredient={setSearchIngredient}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        handleSortChange={handleSortChange}
        handleAddRecipe={handleAddRecipe}
      />

      <ul className="recipes-list">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <li
              key={recipe.id}
              className="recipe-card"
              onClick={() => handleViewRecipe(recipe.id)}
            >
              <div className="card-front">
                <img
                  src={recipe.recipe_image}
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
          ))
        ) : (
          <p>No se encontraron recetas.</p>
        )}
      </ul>
    </div>
  );
};

export default RecipesList;

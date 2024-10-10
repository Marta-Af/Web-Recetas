import React, { useState, useEffect } from "react"; // Importar useEffect
import { useNavigate } from "react-router-dom";

import FilterBar from "../Forms/FilterBar";

const RecipesList = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]); // Estado para las recetas
  const [searchName, setSearchName] = useState(""); // Estado para búsqueda por nombre
  const [searchIngredient, setSearchIngredient] = useState(""); // Estado para búsqueda por ingrediente
  const [sortOrder, setSortOrder] = useState("A-Z");

  // Efecto para obtener recetas de la API al montar el componente
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/recipes"); // Cambia la URL si es necesario
        const data = await response.json();
        setRecipes(data.result); // Suponiendo que el resultado está en la propiedad "result"
      } catch (error) {
        console.error("Error al obtener las recetas:", error);
      }
    };

    fetchRecipes();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

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
        return a.recipe_name.localeCompare(b.recipe_name); // Usa el campo adecuado
      } else {
        return b.recipe_name.localeCompare(a.recipe_name); // Usa el campo adecuado
      }
    });
  };

  // Filtro por nombre
  const filteredRecipesByName = sortRecipes(
    recipes.filter(
      (recipe) =>
        recipe.recipe_name.toLowerCase().includes(searchName.toLowerCase()) // Usa el campo adecuado
    )
  );

  // Filtro por ingrediente
  const filteredRecipesByIngredient = sortRecipes(
    recipes.filter((recipe) =>
      recipe.ingredients.some(
        (ingredient) =>
          ingredient.ingredient_name
            .toLowerCase()
            .includes(searchIngredient.toLowerCase()) // Usa el campo adecuado
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
                  src={recipe.recipe_image} // Usa el campo adecuado
                  alt={recipe.recipe_name} // Usa el campo adecuado
                  className="recipe-image"
                />
                <h3 className="recipe-name">{recipe.recipe_name}</h3>{" "}
                {/* Usa el campo adecuado */}
              </div>
              <div className="card-back">
                <h4>Ingredientes:</h4>
                <ul className="ingredients-list">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={`${recipe.id}-${index}`}>
                      {ingredient.ingredient_name}
                    </li> // Usa el campo adecuado
                  ))}
                </ul>
                <h4>Modo de empleo:</h4>
                <p>{recipe.instructions}</p>
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

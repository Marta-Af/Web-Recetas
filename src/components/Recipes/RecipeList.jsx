import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TortilladePatatas from "../images/TortilladePatatas.png";
import Paella from "../images/Paella.png";
import EnsaladaCesar from "../images/EnsaladaCesar.png";
import FilterBar from "../Forms/FilterBar";

const recipes = [
  {
    id: 1,
    name: "Ensalada César",
    image: EnsaladaCesar,
    ingredients: [
      "Lechuga",
      "Pollo",
      "Crutones",
      "Queso parmesano",
      "Salsa César",
    ],
    instructions: "Mezcla todos los ingredientes y añade la salsa.",
    difficulty: "Fácil",
    time: "15 minutos",
  },
  {
    id: 2,
    name: "Paella",
    image: Paella,
    ingredients: ["Arroz", "Pollo", "Mariscos", "Verduras", "Caldo de pescado"],
    instructions:
      "Cocina el arroz con el caldo y añade los demás ingredientes.",
    difficulty: "Media",
    time: "60 minutos",
  },
  {
    id: 3,
    name: "Tortilla de Patatas",
    image: TortilladePatatas,
    ingredients: ["Arroz", "Pollo", "Mariscos", "Verduras", "Caldo de pescado"],
    instructions:
      "Cocina el arroz con el caldo y añade los demás ingredientes.Cocina el arroz con el caldo y añade los demás ingredientes.Cocina el arroz con el caldo y añade los demás ingredientes.Cocina el arroz con el caldo y añade los demás ingredientes.Cocina el arroz con el caldo y añade los demás ingredientes.Cocina el arroz con el caldo y añade los demás ingredientes.Cocina el arroz con el caldo y añade los demás ingredientes.Cocina el arroz con el caldo y añade los demás ingredientes.Cocina el arroz con el caldo y añade los demás ingredientes.",
    difficulty: "Media",
    time: "60 minutos",
  },
  {
    id: 4,
    name: "Ensalada César",
    image: EnsaladaCesar,
    ingredients: [
      "Lechuga",
      "Pollo",
      "Crutones",
      "Queso parmesano",
      "Salsa César",
    ],
    instructions: "Mezcla todos los ingredientes y añade la salsa.",
    difficulty: "Fácil",
    time: "15 minutos",
  },
  {
    id: 5,
    name: "Paella",
    image: Paella,
    ingredients: ["Arroz", "Pollo", "Mariscos", "Verduras", "Caldo de pescado"],
    instructions:
      "Cocina el arroz con el caldo y añade los demás ingredientes.",
    difficulty: "Media",
    time: "60 minutos",
  },
  {
    id: 6,
    name: "Tortilla de Patatas",
    image: TortilladePatatas,
    ingredients: ["Arroz", "Pollo", "Mariscos", "Verduras", "Caldo de pescado"],
    instructions:
      "Cocina el arroz con el caldo y añade los demás ingredientes.",
    difficulty: "Media",
    time: "60 minutos",
  },
  // Más recetas...
];

const RecipesList = () => {
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState(""); // Estado para búsqueda por nombre
  const [searchIngredient, setSearchIngredient] = useState(""); // Estado para búsqueda por ingrediente
  const [sortOrder, setSortOrder] = useState("A-Z");

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
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  };

  // Filtro por nombre
  const filteredRecipesByName = sortRecipes(
    recipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(searchName.toLowerCase())
    )
  );

  // Filtro por ingrediente
  const filteredRecipesByIngredient = sortRecipes(
    recipes.filter((recipe) =>
      recipe.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(searchIngredient.toLowerCase())
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
                  src={recipe.image}
                  alt={recipe.name}
                  className="recipe-image"
                />
                <h3 className="recipe-name">{recipe.name}</h3>
              </div>
              <div className="card-back">
                <h4>Ingredientes:</h4>
                <ul className="ingredients-list">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={`${recipe.id}-${index}`}>{ingredient}</li>
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

import React from "react";
import { useNavigate } from "react-router-dom";

const recipes = [
  {
    id: 1,
    name: "Ensalada César",
    image: "https://via.placeholder.com/150",
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
    image: "https://via.placeholder.com/150",
    ingredients: ["Arroz", "Pollo", "Mariscos", "Verduras", "Caldo de pescado"],
    instructions:
      "Cocina el arroz con el caldo y añade los demás ingredientes.",
    difficulty: "Media",
    time: "60 minutos",
  },
  {
    id: 3,
    name: "Paella",
    image: "https://via.placeholder.com/150",
    ingredients: ["Arroz", "Pollo", "Mariscos", "Verduras", "Caldo de pescado"],
    instructions:
      "Cocina el arroz con el caldo y añade los demás ingredientes.",
    difficulty: "Media",
    time: "60 minutos",
  },
  {
    id: 4,
    name: "Paella",
    image: "https://via.placeholder.com/150",
    ingredients: ["Arroz", "Pollo", "Mariscos", "Verduras", "Caldo de pescado"],
    instructions:
      "Cocina el arroz con el caldo y añade los demás ingredientes.",
    difficulty: "Media",
    time: "60 minutos",
  },
  {
    id: 5,
    name: "Paella",
    image: "https://via.placeholder.com/150",
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

  const handleViewRecipe = (id) => {
    navigate(`/receta/${id}`); // Redirige al detalle de la receta
  };

  return (
    <div className="recipes-container">
      <ul className="recipes-list">
        {recipes.map((recipe) => (
          <li
            key={recipe.id}
            className="recipe-card"
            onClick={() => handleViewRecipe(recipe.id)} // Añade el evento onClick
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
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
              <h4>Modo de empleo:</h4>
              <p>{recipe.instructions}</p>
              <p>Dificultad: {recipe.difficulty}</p>
              <p>Tiempo: {recipe.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipesList;

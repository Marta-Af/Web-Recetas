import React from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faShareAlt } from "@fortawesome/free-solid-svg-icons";
import TortilladePatatas from "../images/TortilladePatatas.png";
import Paella from "../images/Paella.png";
import EnsaladaCesar from "../images/EnsaladaCesar.png";

// Lista de recetas (puedes reemplazar esto con una solicitud a una API)
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
      "Cocina el arroz con el caldo y añade los demás ingredientes.",
    difficulty: "Media",
    time: "60 minutos",
  },
  // Más recetas...
];

const RecipeDetail = () => {
  const { id } = useParams();

  // Encuentra la receta por ID
  const recipe = recipes.find((r) => r.id === parseInt(id));

  // Manejar el caso donde no se encuentra la receta
  if (!recipe) {
    return <div>Receta no encontrada</div>;
  }

  return (
    <div className="recipe-detail-container">
      <div className="recipe-image-container">
        <img src={recipe.image} alt={recipe.name} className="recipe-image" />
      </div>
      <div className="recipe-info">
        <div className="button-container">
          <button
            className="edit-button"
            onClick={() => alert("Editar receta")}
          >
            <FontAwesomeIcon icon={faEdit} size="2x" />
          </button>
          <button
            className="edit-button"
            onClick={() => alert("Editar receta")}
          >
            <FontAwesomeIcon icon={faShareAlt} size="2x" />
          </button>
        </div>

        <h2 className="recipe-name">{recipe.name}</h2>
        <h3 className="section-title">Ingredientes</h3>
        <ul className="ingredients-list">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
        <h3 className="section-title">Modo de empleo</h3>
        <p className="recipe-instructions">{recipe.instructions}</p>
        <p className="recipe-difficulty">Dificultad: {recipe.difficulty}</p>
      </div>
    </div>
  );
};

export default RecipeDetail;

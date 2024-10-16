import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faShareAlt,
  faTrash,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipeData, setRecipeData] = useState(null); // Estado para almacenar la receta
  const [loading, setLoading] = useState(true); // Estado para manejar el estado de carga
  const [error, setError] = useState(null); // Estado para manejar errores
  const navigate = useNavigate();

  useEffect(() => {
    // Hacer la solicitud a la API cuando el componente se monta
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/recipes/${id}`);
        if (!response.ok) {
          throw new Error("Error al obtener la receta");
        }
        const data = await response.json();

        setRecipeData(data); // Guardar los datos de la receta en el estado
        setLoading(false); // Desactivar el estado de carga
      } catch (err) {
        setError(err.message); // Guardar el mensaje de error
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  // Mostrar un mensaje de carga mientras los datos se obtienen
  if (loading) {
    return <div>Cargando receta...</div>;
  }

  // Mostrar un mensaje de error si hubo un problema
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Manejar el caso donde no se encuentra la receta
  if (!recipeData) {
    return <div>Receta no encontrada</div>;
  }

  return (
    <div className="recipe-detail-container">
      <div className="recipe-image-container">
        <img
          src={recipeData.recipe_image}
          alt={recipeData.recipe_name}
          className="recipe-image"
        />
      </div>
      <div className="recipe-info">
        <div className="button-container">
          <button
            className="edit-button"
            onClick={() => alert("Eliminar receta")}
          >
            <FontAwesomeIcon icon={faTrash} size="2x" />
          </button>
          <button
            className="edit-button"
            onClick={() => navigate(`/edit-recipe/${recipeData.id}`)}
          >
            <FontAwesomeIcon icon={faEdit} size="2x" />
          </button>
          <button
            className="edit-button"
            onClick={() => alert("Compartir receta")}
          >
            <FontAwesomeIcon icon={faShareAlt} size="2x" />
          </button>
          <button
            className="edit-button"
            onClick={() => alert("Guardar como favorito")}
          >
            <FontAwesomeIcon icon={faHeart} size="2x" />
          </button>
        </div>

        <h2 className="recipe-name">{recipeData.recipe_name}</h2>
        <h3 className="section-title">Ingredientes</h3>
        <ul className="ingredients-list">
          {recipeData.ingredients.map((ingredient) => (
            <li key={ingredient.ingredient_id}>
              {ingredient.quantity} {ingredient.unit} de{" "}
              {ingredient.ingredient_name}
            </li>
          ))}
        </ul>
        <h3 className="section-title">Modo de empleo</h3>
        <p className="recipe-instructions">{recipeData.recipe_instructions}</p>
        <p className="recipe-difficulty">Dificultad: {recipeData.difficulty}</p>
      </div>
    </div>
  );
};

export default RecipeDetail;

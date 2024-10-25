import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faHeart,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipeData, setRecipeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/recipes/${id}`);
        if (!response.ok) {
          throw new Error("Error al obtener la receta");
        }
        const data = await response.json();
        setRecipeData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar esta receta?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/recipes/${recipeData.id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          alert("Receta eliminada con éxito");
          navigate("/recipes"); // Redirigir a la lista de recetas
        } else {
          throw new Error("Error al eliminar la receta");
        }
      } catch (err) {
        console.error(err);
        alert("No se pudo eliminar la receta.");
      }
    }
  };

  const handleShareWhatsApp = () => {
    const message = `¡Mira esta receta! ${recipeData.recipe_name}: http://localhost:3000/recipes/${recipeData.id}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleShareLink = async () => {
    const url = `http://localhost:5153/receta/${recipeData.id}`;
    try {
      await navigator.clipboard.writeText(url);
      alert("URL copiada al portapapeles");
    } catch (err) {
      console.error("Error al copiar la URL: ", err);
      alert("No se pudo copiar la URL");
    }
  };

  if (loading) {
    return <div>Cargando receta...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!recipeData) {
    return <div>Receta no encontrada</div>;
  }

  return (
    <div className="recipe-detail-container">
      <div className="recipe-image-container">
        <img
          src={`http://localhost:3000/uploads/${recipeData.recipe_image}`} // Asegurarse de que la URL de la imagen sea correcta
          alt={recipeData.recipe_name}
          className="recipe-image"
        />
      </div>
      <div className="recipe-info">
        <div className="button-container">
          <button className="edit-button" onClick={handleDelete}>
            <FontAwesomeIcon icon={faTrash} size="2x" />
          </button>
          <button
            className="edit-button"
            onClick={() => navigate(`/edit-recipe/${recipeData.id}`)}
          >
            <FontAwesomeIcon icon={faEdit} size="2x" />
          </button>
          <button className="edit-button" onClick={handleShareWhatsApp}>
            <FontAwesomeIcon icon={faWhatsapp} size="2x" />
          </button>
          <button className="edit-button" onClick={handleShareLink}>
            <FontAwesomeIcon icon={faLink} size="2x" />
          </button>
          <button
            className="edit-button"
            onClick={() => alert("Guardar como favorito")}
          >
            <FontAwesomeIcon icon={faHeart} size="2x" />
          </button>
        </div>
        <h2>{recipeData.recipe_name}</h2>
        <p>{recipeData.recipe_instructions}</p>
        <p>Dificultad: {recipeData.difficulty}</p>
        <p>Tiempo: {recipeData.time}</p>
        <div className="ingredients">
          <h3>Ingredientes:</h3>
          <ul>
            {recipeData.ingredients.map((ingredient) => (
              <li key={ingredient.ingredient_id}>
                {ingredient.quantity} {ingredient.unit}{" "}
                {ingredient.ingredient_name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;

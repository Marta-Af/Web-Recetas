import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditRecipe = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipeData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/recipes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeData),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la receta");
      }

      // Cambia a la ruta correcta para redirigir a la página de detalle
      navigate(`/receta/${id}`); // Asegúrate de redirigir a la URL correcta
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Cargando receta...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!recipeData) return <div>Receta no encontrada</div>;

  return (
    <div className="edit-recipe-wrapper">
      <div className="edit-recipe-container">
        <h2 className="edit-recipe-title">Editar Receta</h2>
        <form className="edit-recipe-form" onSubmit={handleSubmit}>
          <label>
            Nombre de la receta:
            <input
              type="text"
              name="recipe_name"
              value={recipeData.recipe_name}
              onChange={handleChange}
            />
          </label>
          <label>
            Imagen de la receta:
            <input
              type="text"
              name="recipe_image"
              value={recipeData.recipe_image}
              onChange={handleChange}
            />
          </label>
          <label>
            Instrucciones:
            <textarea
              name="recipe_instructions"
              value={recipeData.recipe_instructions}
              onChange={handleChange}
            />
          </label>
          <label>
            Dificultad:
            <select
              name="difficulty"
              value={recipeData.difficulty}
              onChange={handleChange}
            >
              <option value="Fácil">Fácil</option>
              <option value="Media">Media</option>
              <option value="Difícil">Difícil</option>
            </select>
          </label>
          <button type="submit">Guardar Cambios</button>
        </form>
      </div>
    </div>
  );
};

export default EditRecipe;

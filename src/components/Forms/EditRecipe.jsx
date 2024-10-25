import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useParams, useNavigate } from "react-router-dom";

const EditRecipe = () => {
  const { id } = useParams();
  const [recipeName, setRecipeName] = useState("");
  const [ingredients, setIngredients] = useState([
    { ingredient_name: "", unit: "", quantity: "" },
  ]);
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState(null);
  const [difficulty, setDifficulty] = useState("Fácil");
  const [time, setTime] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        console.log(`Fetching recipe with ID: ${id}`);
        const response = await fetch(`http://localhost:3000/api/recipes/${id}`);
        if (!response.ok) {
          throw new Error("Error al obtener la receta");
        }
        const data = await response.json();
        console.log("Recipe data fetched:", data);
        setRecipeName(data.recipe_name);
        setIngredients(data.ingredients);
        setInstructions(data.recipe_instructions);
        setImage(data.recipe_image);
        setDifficulty(data.difficulty);
        setTime(data.time);
      } catch (error) {
        console.error("Error in fetchRecipe:", error);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleAddIngredient = () => {
    console.log("Adding new ingredient");
    setIngredients([
      ...ingredients,
      { ingredient_name: "", unit: "", quantity: "" },
    ]);
  };

  const handleRemoveIngredient = (index) => {
    console.log(`Removing ingredient at index: ${index}`);
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleIngredientChange = (index, field, value) => {
    console.log(
      `Updating ingredient at index ${index}, field: ${field}, value: ${value}`
    );
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const handleImageChange = (e) => {
    console.log("Image selected:", e.target.files[0]);
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("Submitting form with data:", {
      recipeName,
      instructions,
      time,
      ingredients,
      image,
    });

    // Validaciones
    if (!recipeName || !instructions || !time || ingredients.length === 0) {
      console.error(
        "Todos los campos son obligatorios y deben incluir al menos un ingrediente."
      );
      return;
    }

    for (let ingredient of ingredients) {
      if (
        !ingredient.ingredient_name ||
        !ingredient.quantity ||
        !ingredient.unit
      ) {
        console.error(
          "Todos los ingredientes deben tener nombre, cantidad y unidad."
        );
        return;
      }
    }

    const formData = new FormData();
    formData.append("recipe_name", recipeName);
    formData.append("recipe_instructions", instructions);
    formData.append("difficulty", difficulty);
    formData.append("time", time);
    if (image) {
      formData.append("recipe_image", image);
    }

    // Agregar ingredientes
    ingredients.forEach((ingredient, index) => {
      formData.append(
        `ingredients[${index}][ingredient_name]`,
        ingredient.ingredient_name
      );
      formData.append(`ingredients[${index}][quantity]`, ingredient.quantity);
      formData.append(`ingredients[${index}][unit]`, ingredient.unit);
    });

    try {
      console.log("Sending update request...");
      const response = await fetch(`http://localhost:3000/api/recipes/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error in response from server:", errorData);
        throw new Error(`Error: ${errorData.error || "Error desconocido"}`);
      }

      const data = await response.json();
      console.log("Receta actualizada:", data);
      navigate("/RecipeList");
    } catch (error) {
      console.error("Error al actualizar la receta:", error);
    }
  };

  const handleKeyDown = (e, action) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Previene el comportamiento por defecto del enter
      action();
    }
  };

  return (
    <div className="create-recipe-container">
      <h2>Editar Receta</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre de la receta:</label>
          <input
            type="text"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            placeholder="Nombre de la receta"
            required // Agregado para que el campo sea obligatorio
          />
        </div>

        <div className="form-group">
          <label>Ingredientes:</label>
          {ingredients.map((ingredient, index) => (
            <div key={index} className="ingredient-fields">
              <input
                type="text"
                placeholder="Nombre del ingrediente"
                value={ingredient.ingredient_name}
                onChange={(e) =>
                  handleIngredientChange(
                    index,
                    "ingredient_name",
                    e.target.value
                  )
                }
                className="input-text"
                required // Agregado para que el campo sea obligatorio
              />
              <input
                type="number"
                placeholder="Cantidad"
                value={ingredient.quantity}
                onChange={(e) =>
                  handleIngredientChange(index, "quantity", e.target.value)
                }
                className="input-number"
                required // Agregado para que el campo sea obligatorio
              />
              <input
                type="text"
                placeholder="Unidad"
                value={ingredient.unit}
                onChange={(e) =>
                  handleIngredientChange(index, "unit", e.target.value)
                }
                className="input-text"
                required // Agregado para que el campo sea obligatorio
              />

              <FontAwesomeIcon
                icon={faTrash}
                onClick={() => handleRemoveIngredient(index)}
                onKeyDown={(e) =>
                  handleKeyDown(e, () => handleRemoveIngredient(index))
                }
                className="icon-trash"
                role="button"
                aria-label="Eliminar ingrediente"
              />
              <FontAwesomeIcon
                icon={faPlus}
                onClick={handleAddIngredient}
                onKeyDown={(e) => handleKeyDown(e, handleAddIngredient)}
                className="icon-add"
                role="button"
                aria-label="Añadir ingrediente"
              />
            </div>
          ))}
        </div>

        <div className="form-group">
          <label>Instrucciones:</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="textarea-instructions"
            required // Agregado para que el campo sea obligatorio
          />
        </div>

        <div className="form-group">
          <label>Dificultad:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="select-difficulty"
          >
            <option value="Fácil">Fácil</option>
            <option value="Intermedia">Intermedia</option>
            <option value="Difícil">Difícil</option>
          </select>
        </div>

        <div className="form-group">
          <label>Tiempo (minutos):</label>
          <input
            type="number"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="input-number"
            required // Agregado para que el campo sea obligatorio
          />
        </div>

        <div className="form-group">
          <label>Imagen de la receta:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="input-file"
          />
        </div>

        <button type="submit" className="button-submit">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default EditRecipe;

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

const CreateRecipe = () => {
  const [recipeName, setRecipeName] = useState("");
  const [ingredients, setIngredients] = useState([
    { ingredient_name: "", unit: "", quantity: "" },
  ]);
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState(null);
  const [difficulty, setDifficulty] = useState("Fácil");
  const [time, setTime] = useState("");

  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      { ingredient_name: "", unit: "", quantity: "" },
    ]);
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("recipe_name", recipeName);
    formData.append("recipe_image", image);
    formData.append("recipe_instructions", instructions);
    formData.append("difficulty", difficulty);
    formData.append("time", time);
    formData.append("user_id", 1); // Cambia esto según el ID del usuario que esté creando la receta

    // Agregar ingredientes como objetos en el FormData
    formData.append("ingredients", JSON.stringify(ingredients)); // Enviar todos los ingredientes como un único objeto JSON

    try {
      const response = await fetch("http://localhost:3000/api/recipes", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${errorData.error}`);
      }

      const data = await response.json();
      console.log("Receta creada:", data);
    } catch (error) {
      console.error("Error al crear la receta:", error.message);
    }
  };

  const handleKeyDown = (e, action) => {
    if (e.key === "Enter") {
      action();
    }
  };

  return (
    <div className="create-recipe-container">
      <h2>Añadir Receta</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre de la receta:</label>
          <input
            type="text"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            placeholder="Nombre de la receta"
            tabIndex={1} // Primer elemento en el flujo de tabulación
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
                tabIndex={index * 5 + 2} // tabIndex para nombre del ingrediente
              />
              <input
                type="text"
                placeholder="Unidad"
                value={ingredient.unit}
                onChange={(e) =>
                  handleIngredientChange(index, "unit", e.target.value)
                }
                className="input-text"
                tabIndex={index * 5 + 3} // tabIndex para unidad
              />
              <input
                type="number"
                placeholder="Cantidad"
                value={ingredient.quantity}
                onChange={(e) =>
                  handleIngredientChange(index, "quantity", e.target.value)
                }
                className="input-number"
                tabIndex={index * 5 + 4} // tabIndex para cantidad
              />
              <FontAwesomeIcon
                icon={faTrash}
                onClick={() => handleRemoveIngredient(index)}
                onKeyDown={(e) =>
                  handleKeyDown(e, () => handleRemoveIngredient(index))
                }
                className="icon-trash"
                tabIndex={index * 5 + 5} // tabIndex para papelera
                role="button"
                aria-label="Eliminar ingrediente"
              />
              <FontAwesomeIcon
                icon={faPlus}
                onClick={handleAddIngredient}
                onKeyDown={(e) => handleKeyDown(e, handleAddIngredient)}
                className="icon-add"
                tabIndex={index * 5 + 6} // tabIndex para añadir ingrediente
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
            tabIndex={ingredients.length * 5 + 7} // tabIndex después de ingredientes
          />
        </div>

        <div className="form-group">
          <label>Dificultad:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="select-difficulty"
            tabIndex={ingredients.length * 5 + 8}
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
            tabIndex={ingredients.length * 5 + 9}
          />
        </div>

        <div className="form-group">
          <label>Imagen de la receta:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="input-file"
            tabIndex={ingredients.length * 5 + 10}
          />
        </div>

        <button
          type="submit"
          className="button-submit"
          tabIndex={ingredients.length * 5 + 11}
        >
          Guardar Receta
        </button>
      </form>
    </div>
  );
};

export default CreateRecipe;

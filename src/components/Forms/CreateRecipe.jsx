import React, { useState } from "react";

const CreateRecipe = () => {
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState(null);
  const [difficulty, setDifficulty] = useState("Fácil");

  const handleAddIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para el envío del formulario pendiente
  };

  return (
    <div className="create-recipe-container">
      <h2>Añadir Receta</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre de la receta:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-text"
          />
        </div>
        <div className="form-group">
          <label>Ingredientes:</label>
          {ingredients.map((ingredient, index) => (
            <input
              key={index}
              type="text"
              value={ingredient}
              onChange={(e) => {
                const newIngredients = [...ingredients];
                newIngredients[index] = e.target.value;
                setIngredients(newIngredients);
              }}
              className="input-text"
            />
          ))}
          <button
            type="button"
            onClick={handleAddIngredient}
            className="button-add-ingredient"
          >
            Añadir Ingrediente
          </button>
        </div>
        <div className="form-group">
          <label>Instrucciones:</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="textarea-instructions"
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
          <label>Imagen de la receta:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="input-file"
          />
        </div>

        <button type="submit" className="button-submit">
          Guardar Receta
        </button>
      </form>
    </div>
  );
};

export default CreateRecipe;

import React from "react";
import { useParams } from "react-router-dom";

const RecipeDetail = () => {
  const { id } = useParams();

  // Aquí puedes cargar los detalles de la receta con el id

  return (
    <div>
      <h2>Detalle de la Receta {id}</h2>
      {/* Más detalles de la receta */}
    </div>
  );
};

export default RecipeDetail;

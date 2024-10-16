import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import Header from "./Header";
import Login from "./InfoLogin/Login";
import Register from "./InfoRegister/Register";
import Footer from "./Footer";
import RecipesList from "./Recipes/RecipeList";
import RecipeDetail from "./Recipes/RecipeDetail";
import CreateRecipe from "./Forms/CreateRecipe";
import EditRecipe from "./Forms/EditRecipe";

function App() {
  return (
    <div className="app">
      <Header />
      <div className="page">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/receta/:id" element={<RecipeDetail />} />
          <Route path="/recipes" element={<RecipesList />} />
          <Route path="/create-recipe" element={<CreateRecipe />} />
          <Route path="/edit-recipe/:id" element={<EditRecipe />} />
          <Route path="/edit-recipe/:id" element={<EditRecipe />} />

          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;

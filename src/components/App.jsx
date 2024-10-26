import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import Header from "./Header";
import Login from "./InfoLogin/Login";
import Register from "./InfoRegister/Register";
import Footer from "./Footer";
import RecipesList from "./Recipes/RecipeList";
import RecipeDetail from "./Recipes/RecipeDetail";
import EditRecipe from "./Forms/EditRecipe";
import CreateRecipe from "./Forms/CreateRecipe";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import FavoritesList from "./Recipes/FavoritesList";

function App() {
  return (
    <div className="app">
      <FavoritesProvider>
        <Header />
        <div className="page">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/receta/:id" element={<RecipeDetail />} />
            <Route path="/recipes" element={<RecipesList />} />
            <Route path="/create-recipe" element={<CreateRecipe />} />
            <Route path="/edit-recipe/:id" element={<EditRecipe />} />
            <Route path="/register" element={<Register />} />
            <Route path="/FavoritesProvider" element={<FavoritesProvider />} />
            <Route path="/favorites" element={<FavoritesList />} />
          </Routes>
        </div>
        <Footer />
      </FavoritesProvider>
    </div>
  );
}

export default App;

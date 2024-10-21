const { getConnection } = require('../db'); // Importa getConnection desde db.js

// Controlador para actualizar una receta
const updateRecipe = async (req, res) => {
    const { id } = req.params;
    const { recipe_name, recipe_image, recipe_instructions, difficulty } = req.body;

    const sql = `
        UPDATE recipes
        SET recipe_name = ?, recipe_image = ?, recipe_instructions = ?, difficulty = ?, time = ?
        WHERE id = ?;
    `;

    let connection;
    try {
        connection = await getConnection();
        const [result] = await getConnection.query(sql, [recipe_name, recipe_image, recipe_instructions, difficulty, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Receta no encontrada" });
        }

        res.status(200).json({ message: "Receta actualizada con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

// Controlador para crear una nueva receta
const createRecipe = async (req, res) => {
    const { recipe_name, recipe_image, recipe_instructions, difficulty, time, user_id, ingredients } = req.body;

    let connection;
    try {
        connection = await getConnection();
        
        // Primero, insertar la receta
        const [result] = await connection.query(
            `INSERT INTO recipes (recipe_name, recipe_image, recipe_instructions, difficulty, time, user_id)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [recipe_name, recipe_image, recipe_instructions, difficulty, time, user_id]
        );

        const recipeId = result.insertId;

        if (ingredients && ingredients.length > 0) {
            const ingredientQueries = ingredients.map(async (ingredient) => {
                const [ingredientResult] = await connection.query(
                    `SELECT id FROM ingredients WHERE ingredient_name = ?`,
                    [ingredient.ingredient_name]
                );
        
                let ingredientId;
        
                if (ingredientResult.length > 0) {
                    // Ingrediente existe, usar su ID
                    ingredientId = ingredientResult[0].id;
                } else {
                    // Si no existe, agregar el nuevo ingrediente
                    const [insertResult] = await connection.query(
                        `INSERT INTO ingredients (ingredient_name) VALUES (?)`,
                        [ingredient.ingredient_name]
                    );
                    ingredientId = insertResult.insertId; // Obtén el ID del nuevo ingrediente
                }
        
                // Ahora inserta en recipe_ingredients
                return connection.query(
                    `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (?, ?, ?, ?)`,
                    [recipeId, ingredientId, ingredient.quantity, ingredient.unit]
                );
            });
        
            await Promise.all(ingredientQueries);
        }
        

        res.status(201).json({ message: "Receta creada exitosamente", recipeId });
    } catch (error) {
        console.error("Error al crear receta:", error);
        res.status(500).json({ message: "Error al crear la receta", error: error.message });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

module.exports = { updateRecipe, createRecipe,  };

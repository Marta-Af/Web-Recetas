const { getConnection } = require('../db');
const multer = require('multer');
const path = require('path');

// Configurar multer para subir archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para el archivo
    }
});

const upload = multer({ storage: storage });

// Controlador para actualizar una receta
const updateRecipe = async (req, res) => {
    const { id } = req.params; // ID de la receta a actualizar
    const { recipe_name, recipe_instructions, difficulty, time, ingredients } = req.body;

    // Validar que todos los campos sean obligatorios
    if (!recipe_name || !recipe_instructions || !difficulty || !time || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ error: "Todos los campos son obligatorios y deben incluir al menos un ingrediente" });
    }
    

    const sql = `
        UPDATE recipes
        SET recipe_name = ?, recipe_image = ?, recipe_instructions = ?, difficulty = ?, time = ?
        WHERE id = ?;
    `;

    let connection;
    try {
        connection = await getConnection();
        
        const [result] = await connection.query(sql, [
            recipe_name,
            req.file ? req.file.filename : null, // Solo se incluye si hay una imagen
            recipe_instructions,
            difficulty,
            time,
            id
        ]);

        // Verificar si la receta fue actualizada
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Receta no encontrada" });
        }

        // Actualizar ingredientes
        const ingredientQueries = [];
        for (const ingredient of ingredients) {
            const { ingredient_id, quantity, unit } = ingredient;

            // Validar que los ingredientes tengan id, cantidad y unidad
            if (!ingredient_id || !quantity || !unit) {
                return res.status(400).json({ error: "Cada ingrediente debe tener id, cantidad y unidad" });
            }

            ingredientQueries.push(
                connection.query(
                    `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE quantity = ?, unit = ?`,
                    [id, ingredient_id, quantity, unit, quantity, unit] // Si ya existe, actualiza cantidad y unidad
                )
            );
        }

        await Promise.allSettled(ingredientQueries);

        res.status(200).json({ message: "Receta actualizada exitosamente" });
    } catch (error) {
        console.error("Error al actualizar la receta:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

// Controlador para crear una nueva receta
const createRecipe = async (req, res) => {
    const { recipe_name, recipe_instructions, difficulty, time } = req.body;
    const ingredients = JSON.parse(req.body.ingredients || '[]'); // Este debe ser un arreglo de ingredientes

    // Validar si los datos básicos están presentes
    if (!recipe_name || ingredients.length === 0) {
        return res.status(400).json({ error: "El nombre de la receta y al menos un ingrediente son obligatorios" });
    }

    let connection;
    try {
        connection = await getConnection();

        // Insertar la receta
        const [result] = await connection.query(
            `INSERT INTO recipes (recipe_name, recipe_image, recipe_instructions, difficulty, time)
             VALUES (?, ?, ?, ?, ?)`,
            [recipe_name, req.file ? req.file.filename : null, recipe_instructions, difficulty, time]
        );

        const recipeId = result.insertId;

        // Insertar ingredientes
        const ingredientQueries = [];

        for (const ingredient of ingredients) {
            if (!ingredient.ingredient_name || !ingredient.quantity || !ingredient.unit) {
                return res.status(400).json({ error: "Todos los ingredientes deben tener nombre, cantidad y unidad." });
            }

            const [ingredientResult] = await connection.query(
                `SELECT id FROM ingredients WHERE ingredient_name = ?`,
                [ingredient.ingredient_name]
            );

            let ingredientId;
            if (ingredientResult.length > 0) {
                ingredientId = ingredientResult[0].id;
            } else {
                const [insertResult] = await connection.query(
                    `INSERT INTO ingredients (ingredient_name) VALUES (?)`,
                    [ingredient.ingredient_name]
                );
                ingredientId = insertResult.insertId;
            }

            ingredientQueries.push(
                connection.query(
                    `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (?, ?, ?, ?)`,
                    [recipeId, ingredientId, ingredient.quantity, ingredient.unit]
                )
            );
        }

        await Promise.allSettled(ingredientQueries);

        res.status(201).json({ message: "Receta creada exitosamente", recipeId });
    } catch (error) {
        console.error("Error al crear receta:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

// Controlador para obtener receta por ID
const getRecipeById = async (req, res) => {
    const recipeId = req.params.id;

    const sql = `
        SELECT 
            r.id AS recipe_id,
            r.recipe_name,
            r.recipe_image,
            r.recipe_instructions,
            r.difficulty,
            r.time,
            i.id AS ingredient_id,
            i.ingredient_name,
            ri.quantity,
            ri.unit
        FROM 
            recipes r
        LEFT JOIN 
            recipe_ingredients ri ON r.id = ri.recipe_id
        LEFT JOIN 
            ingredients i ON ri.ingredient_id = i.id
        WHERE r.id = ?;
    `;

    let connection;
    try {
        connection = await getConnection();
        const [results] = await connection.query(sql, [recipeId]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Receta no encontrada' });
        }

        const recipe = {
            id: results[0].recipe_id,
            recipe_name: results[0].recipe_name,
            recipe_image: results[0].recipe_image,
            recipe_instructions: results[0].recipe_instructions,
            difficulty: results[0].difficulty,
            time: results[0].time,
            ingredients: results.map(ing => ({
                ingredient_id: ing.ingredient_id,
                ingredient_name: ing.ingredient_name,
                quantity: ing.quantity,
                unit: ing.unit
            }))
        };

        res.json(recipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};


// Controlador para eliminar la receta
// Controlador para eliminar la receta
const deleteRecipe = async (req, res) => {
    const { id } = req.params; // ID de la receta a eliminar
    let connection;

    try {
        connection = await getConnection(); // Obtener la conexión a la base de datos

        // Primero, elimina las entradas relacionadas en recipe_ingredients
        await connection.query('DELETE FROM recipe_ingredients WHERE recipe_id = ?', [id]);

        // Luego, elimina la receta
        const [result] = await connection.query('DELETE FROM recipes WHERE id = ?', [id]);
        
        // Verificar si la receta fue eliminada
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Receta no encontrada' });
        }

        res.status(204).send(); // No hay contenido para enviar en la respuesta
    } catch (error) {
        console.error('Error al eliminar la receta:', error); // Para el debugging
        res.status(500).json({ message: 'Error al eliminar la receta', error });
    } finally {
        if (connection) {
            await connection.end(); // Cierra la conexión
        }
    }
};




module.exports = { updateRecipe, createRecipe, upload, getRecipeById, deleteRecipe };

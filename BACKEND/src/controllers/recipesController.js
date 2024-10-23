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
    const { id } = req.params;
    const { recipe_name, recipe_instructions, difficulty, time } = req.body;

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
            req.file ? req.file.filename : null,
            recipe_instructions,
            difficulty,
            time,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Receta no encontrada" });
        }

        res.status(200).json({ message: "Receta actualizada con éxito" });
    } catch (error) {
        console.error("Error al actualizar la receta:", error);
        res.status(500).json({ error: "Error interno del servidor" });
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

module.exports = { updateRecipe, createRecipe, upload };

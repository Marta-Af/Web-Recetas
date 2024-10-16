const { getConnection } = require('../db'); // Importa getConnection desde db.js

// Controlador para actualizar una receta
const updateRecipe = async (req, res) => {
    const { id } = req.params;
    const { recipe_name, recipe_image, recipe_instructions, difficulty } = req.body;

    const sql = `
        UPDATE recipes
        SET recipe_name = ?, recipe_image = ?, recipe_instructions = ?, difficulty = ?
        WHERE id = ?;
    `;

    let connection;
    try {
        connection = await getConnection();
        const [result] = await connection.query(sql, [recipe_name, recipe_image, recipe_instructions, difficulty, id]);

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

module.exports = { updateRecipe };

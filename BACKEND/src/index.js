// IMPORTAR BIBLIOTECAS
const express = require('express');
const cors = require('cors');

require('dotenv').config();
const mysql = require('mysql2/promise');

// CREAR VARIABLES
const app = express();
const port = process.env.PORT || 3000;

// CONFIGURAMOS EXPRESS
app.use(cors());
app.use(express.json({ limit: '25Mb' }));

// CONFIGURAMOS MYSQL
const getConnection = async () => {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_SCHEMA || 'bd_recipes',
  });

  console.log(`Conexión establecida con la base de datos (identificador=${connection.threadId})`);
  return connection;
};

// ARRANCAR SERVIDOR
app.listen(port, () => {
  console.log(`Server has been started at http://localhost:${port}`);
});

// ENDPOINTS
/// ENDPOINTS
// Endpoint para obtener todas las recetas con ingredientes
app.get('/api/recipes', async (req, res) => {
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
        ORDER BY 
            r.id;
    `;

    let connection;
    try {
        connection = await getConnection(); // Obtener conexión
        const [results] = await connection.query(sql); // Ejecutar la consulta

        // Mapeo directo de los resultados
        const recipes = results.map(row => ({
            id: row.recipe_id,
            recipe_name: row.recipe_name,
            recipe_image: row.recipe_image,
            recipe_instructions: row.recipe_instructions,
            difficulty: row.difficulty,
            time: row.time,
            ingredients: results.filter(ing => ing.recipe_id === row.recipe_id)
                               .map(ing => ({
                                   ingredient_id: ing.ingredient_id,
                                   ingredient_name: ing.ingredient_name,
                                   quantity: ing.quantity,
                                   unit: ing.unit
                               }))
        }));

        // Eliminamos duplicados
        const uniqueRecipes = Array.from(new Map(recipes.map(item => [item.id, item])).values());

        res.json({
            info: {
                count: uniqueRecipes.length
            },
            result: uniqueRecipes
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    } finally {
        if (connection) {
            await connection.end(); // Cerrar conexión
        }
    }
});

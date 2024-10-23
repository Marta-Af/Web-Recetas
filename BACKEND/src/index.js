// IMPORTAR BIBLIOTECAS
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

require('dotenv').config();

const { getConnection } = require('./db'); 
const { updateRecipe, createRecipe } = require("./controllers/recipesController");

// CREAR VARIABLES
const app = express();
const port = process.env.PORT || 3000;

// CONFIGURAMOS EXPRESS
app.use(cors());
app.use(express.json({ limit: '25Mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configurar multer para subir archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads'); 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });

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
        connection = await getConnection();
        const [results] = await connection.query(sql);
        
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
            await connection.end();
        }
    }
});

// Endpoint para crear una receta
app.post("/api/recipes", upload.single('recipe_image'), createRecipe);

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

// src/routes/index.js
// HTTP(S) routing/controllers

// Import all models
const recipe = require("../models/recipe.model.js");

const express = require('express');
const router = express.Router();

router.use('/doc', function(req, res, next) {
    res.end(`Documentation http://expressjs.com/`);
});

//GET /recipes lists all recipes that have not been deleted
router.get('/recipes', function(req, res, next) {
    recipe.find({deleted: {$ne: true}}, function(err, recipes) {
        if (err) {
          console.log(err);
          return res.status(500).json(err);
        }
      
        res.json(recipes);
      });
});

// GET /recipes/:recipeId is a route for a specific recipe
router.get('/recipes/:recipeId', function(req, res, next) {
    const { recipeId } = req.params;
    // same as 'const recipeId = req.params.recipeId'

    const recipe = RECIPES.find(entry => entry.id === recipeId);
    if (err) {
    return res.status(404).end(`Could not find recipe '${recipeId}'`);
    }

    res.json(recipe);
});

//POST /recipes creates a new recipe in the list
router.post('/recipes', function(req, res, next) {
    const recipeData = {
        title: req.body.title,
        category: req.body.category,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
    };

    recipe.create(recipeData, function(err, newRecipe) {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
        res.json(newRecipe);
    });
});

//PUT /recipes/:recipeId edits a specific recipe
router.put('/recipes/:recipeId', function(req, res, next) {
    const {recipeId} = req.params;
    const recipe = RECIPES.find(entry => entry.id === recipeId);
    if (!recipe) {
      return res.status(404).end(`Could not find recipe '${recipeId}'`);
    }
  
    // recipe.title = req.body.title;
    // recipe.category = req.body.category;
    // recipe.ingredients: req.body.ingredients;
    // recipe.instructions: req.body.instructions;
    // res.json(recipe);
});

router.delete('/recipes/:recipeId', function(req, res, next) {
    const { recipeId } = req.params;

    //find the specific recipe; if found, "soft" delete it
    recipe.findById(recipeId, function (err, recipe) {
        if (err) {
            console.log(err)
            return res.status(500).json(err)
        }
        if (!recipe) {
            return res.status(404).json({message: "Recipe not found"})
        }

        recipe.deleted = true

        recipe.save(function (err, deletedRecipe) {
            res.json(deletedRecipe)
        })
    })
});
  
module.exports = router;
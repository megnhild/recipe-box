// Database models

// Load mongoose package
const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
    title: {type: String, required: true},
    category: {type: String, required: true},
    ingredients: {type: String, required: true},
    instructions: {type: String, required: true},
    favorite: {type: String, default: "false"},
    created_at: { type: Date, default: Date.now },
    deleted: { type: Boolean }
});

const Recipe = mongoose.model("Recipe", RecipeSchema);

Recipe.countDocuments({}, function(err, count) {
    if (err) {
      throw err;
    }
    if (count > 0) return ;

    const seedRecipes = require("./recipe.seed.json");
    Recipe.create(seedRecipes, function (err, newRecipes) {
        if (err) {
            throw err;
        }
        console.log("DB seeded");
    });
});

module.exports = Recipe;
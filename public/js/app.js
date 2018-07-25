// jQuery template string

// {/* <input type="checkbox" name="favorite" id="favorite${item.id}" value="Favorite!">
//             Love it! */}

function listItemTemplate(data) {
  let compiled = '';
  data.forEach(item => {
    compiled += `
      <li class="list-group-item">
        <strong>${item.title}</strong>${item.category}
        <button type="button" id="view-edit-button" onclick="handleViewRecipeClick(this)" data-recipe-id="${item._id}>View&#47;Edit</button>
        <button type="button" id="delete-button" onclick="handleDeleteRecipeClick(this)" data-recipe-id="${item._id}">Remove</button>
      </li>
    `;
  });
  compiled = `<ul class="list-group">${compiled}</ul>`;
  return compiled;
}

function getRecipes() {
  return $.ajax('/api/recipes')
    .then(res => {
      console.log("Results from getRecipes()", res);
      return res;
    })
    .fail(err => {
      console.log("Error in getRecipes()", err);
      throw err;
    });
}

function refreshRecipeList() {
  getRecipes()
    .then(recipes => {
      window.recipeList = recipes;
      $('#list-container').html(listItemTemplate(recipes));
    })
}

function submitRecipeForm() {
  console.log("You clicked 'submit'.");

  //stores the value of the radio button selected
  const selectedCategory = $("input[name=category]:checked").attr("value");

  const recipeData = {
    title: $('#recipe-title').val(),
    category: selectedCategory,
    ingredients: $('#recipe-ingredients').val(),
    instructions: $('#recipe-instructions').val(),
    _id: $('#recipe-id').val()
  };

  //fetch API, fetch method
  fetch('/api/recipes', {
    method: 'POST',
    body: JSON.stringify(recipeData),
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
  })
    .then(res => res.json())
    .then(recipe => {
        console.log("we have posted the data", recipe);
        refreshRecipeList();
    })
    .catch(err => {
        console.error(err);
    }) 

  console.log("Your recipe data", recipeData);
  
  $('#add-recipe-form')[0].reset();
}

function cancelRecipeForm() {
  $('#add-recipe-form')[0].reset();
}

// function handleViewRecipeClick(element) {
//   const recipeId = element.getAttribute('data-recipe-id');

//   const recipe = window.recipeList.find(recipe => recipe._id === recipeId);
//   if (recipe) {
//     $('#recipe-title').val(recipe.title);
//     $("input[name=category]:checked").attr("value");
//     $('#recipe-ingredients').val(recipe.ingredients);
//     $('#recipe-instructions').val(recipe.instructions);
//     $('#recipe-id').val(recipe._id)
//   }

//   showAddRecipeForm();
// }

function deleteRecipe(recipeId) {
  const url = '/api/recipes/' + recipeId;

  fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'}
    })
    .then(res => res.json())
    .then(res => {
      console.log("recipe has been deleted");
      refreshRecipeList();
    })
    .catch(err => {
      console.error("recipe was not deleted", err);
    });
  }

function handleDeleteRecipeClick(element) {
  const recipeId = element.getAttribute('data-recipe-id');

  if (confirm("Are you sure you want to remove this recipe from the list?")) {
    deleteRecipe(recipeId);
  }
}


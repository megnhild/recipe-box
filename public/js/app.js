// jQuery template string

// Get the modal
const modal = document.getElementById('view-recipe-modal');

// Get the button that opens the modal
// const btn = document.getElementById("view-edit-button");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal 
// btn.onclick = function() {
//     modal.style.display = "block";
// }

// When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//     modal.style.display = "none";
// }

// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
// }

function listItemTemplate(data) {
  let compiled = '';
  data.forEach(item => {
    compiled += `
      <li class="list-group-item">
        <strong>${item.title}</strong>${item.category}
        <button type="button" id="view-edit-button" onclick="handleViewRecipeClick(this)" data-recipe-id="${item._id}">View&#47;Edit</button>
        <button type="button" id="delete-button" onclick="handleDeleteRecipeClick(this)" data-recipe-id="${item._id}">Remove</button>
      </li>
    `;
  });
  compiled = `<ul class="list-group">${compiled}</ul>`;
  return compiled;
}

function modalRecipeTemplate(data) {
  let compiled = '';
  data.forEach(item => {
    compiled += `
      <h1 class="full-recipe-items" id="full-recipe-title">${item.title}</h1>
      <h2 class="full-recipe-items" id="full-recipe-category">${item.category}</h2>
      <h2 class="full-recipe-items" id="full-recipe-ingred-label">Ingredients:</h2>
      <p class="full-recipe-items" id="full-recipe-ingredients">${item.ingredients}</p>
      <h2 class="full-recipe-items" id="full-recipe-instruct-label">Instructions:</h2>
      <p class="full-recipe-items" id="full-recipe-instructions">${item.instructions}</p>
      <button type="button" id="edit-button" onclick="handleEditRecipeClick(this)" data-recipe-id="${item._id}">Edit</button>
    `;
  });
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

function viewRecipe(recipeId) {
  const url = '/api/recipes/' + recipeId;

  return $.ajax(url)
    .then(res => {
      console.log("Results from viewRecipe()", res);
      return res;
    })
    .fail(err => {
      console.log("Error in viewRecipe()", err);
      throw err;
    });
}

function viewRecipeModal() {

  viewRecipe()
    .then(recipe => {
      recipe = window.recipeList.find(recipe => recipe._id === recipeId);
      $("view-recipe-modal").html(modalRecipeTemplate(recipe));
    })

  const selectedCategory = $("input[name=category]:checked").attr("value");

  const recipeData = {
    title: $('#recipe-title').val(),
    category: selectedCategory,
    ingredients: $('#recipe-ingredients').val(),
    instructions: $('#recipe-instructions').val(),
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
}

function handleViewRecipeClick(element) {
  modal.style.display = "block";
  console.log("You clicked 'View&#47;Edit'.");
  const recipeId = element.getAttribute('data-recipe-id');

  viewRecipeModal(recipeId);
}

function deleteRecipe() {
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

refreshRecipeList();
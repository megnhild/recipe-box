// jQuery template string

// {/* <input type="checkbox" name="favorite" id="favorite${item.id}" value="Favorite!">
//             Love it! */}

// {/* <button type="button" id="view-edit-button" onclick="handleViewRecipeClick(this)" data-recipe-id="${item._id}">View&#47;Edit</button> */}

// function generateForm(items) {
//   items.map(item => {
//       let classNames = ['something', 'something--${title}']

//       return (
//           '<li className="${classNames.join(' ')}">{items.title}</li>';
//       )
//   })
// }

function listItemTemplate(data) {
  let compiled = '';
  data.forEach(item => {
    let favoriteIdName = [`favorite-${item._id}`];
    compiled += `
      <li class="list-group-item">
        <strong>${item.title}</strong>${item.category}
        <label for="favorite-recipe"><input type="checkbox" class="favorite-checkbox" id="${favoriteIdName.join('')}" onclick="checkedFavorite(this)" name="favorite" value="true" data-recipe-id="${item._id}">Favorite</label>
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
    favorite: $('#favorite-status').val(),
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

// $('input[name=favorite]').live("click",function(){
//   var id    = $(this).attr('id');

//   if($(this).attr('checked')) {
//       var favorite = 1;
//   } else {
//       var favorite = 0;
//   }

//   $.ajax({
//       type:'GET',
//       url:'favorites.php',
//       data:'id= ' + id + '&favorite='+favorite
//   });
//   //console.log('id: ' + id + ' Publico: '+publico + 'Value: '+value);

// });

//  if checked
//    change the value of favorite to true
//    console.log('Recipe has been favorited.')

// const checkedValue = $(`#favorite-${recipeId}:checked`).val();

function updateFavoriteStatus(recipeId) {
  const recipe = window.recipeList.find(recipe => recipe._id === recipeId);
  //gets the value of the checked favorite checkbox
  let value = $(`#favorite-${recipeId}:checked`).val();
  if(value !== undefined) {
    value = true;
    console.log(recipe);
    console.log(value);
  } else if(value === undefined) {
    value = false;
    console.log(recipe);
    console.log(value);
  }
  
  const url = 'api/recipes/' + recipeId;

  fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  })
    .then(res => res.json())
    .then(res => {
      console.log("recipe's favorite status has been updated");
    })
    .catch(err => {
      console.error("recipe's favorite status was not updated", err);
    })
};

function checkedFavorite (element) {
  const recipeId = element.getAttribute('data-recipe-id');

  updateFavoriteStatus(recipeId);
}

function deleteRecipe(recipeId) {
  const url = '/api/recipes/' + recipeId;

  fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
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

// our jQuery template string
function getList(data) {
    var compiled = '';
    data.forEach(item => {
      compiled += `
        <div class="row">
          <div class="col-xs-6"><strong>${item.name}</strong></div>
          <div class="col-xs-6">${item.description}</div>
        </div>
      `;
    });
    return compiled;
  }

$(document).ready(function() {
    // setup the title of the page and greeting
    const welcome = { name: "Code Louisvillains" }
    // jquery template string
    const greetingTemplate = `<p>Hello ${welcome.name}! I am a template!<p>`;
    // put the template data into the actual page
    $('body h1').first().after(greetingTemplate);

    // let's setup some fake data array of javascript objects
    // each javascript object has a name and a value property
    const data = {
        list: [
        {name: 'iron man shirt', description: 'iron man flying high'},
        {name: 'cats-r-us', description: 'toys-r-us logo saying cats-r-us'},
        {name: 'coffee', description: 'a cup of coffee elegantly portrayed'},
        {name: 'dogs', description: 'need i say more?'},
        ],
    };

    // pass out data.list and then insert the generated string of html
    $('#list-container').html(getList(data.list));
});
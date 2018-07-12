//global variables
const id = sessionStorage.getItem("uid");

//function for display recipe list
function displayRecipesList() {
    database.ref("users/" + id + "/recipes").once("value", (snapshot) => {
        snapshot.forEach((recipe) => {
            const recipeData = recipe.val();

            const recipesList = $('#recipesList');
            const colDiv = $("<div>").addClass("col-md-4");
            const cardDiv = $("<div>").addClass("card mb-4 box-shadow");
            const img = $("<img>").addClass("card-img-top");
            img.attr("src", recipeData.pic);
            const cardBodyDiv = $("<div>").addClass("card-body");
            const cardTextP = $("<p>").text(recipeData.name);
            const dFlexDiv = $("<div>").addClass("d-flex justify-content-between align-items-center");
            const btnDiv = $("<div>").addClass("btn-group");
            const viewBtn = $("<button>").addClass("view-btn btn btn-sm btn-outline-secondary");
            viewBtn.attr("type", "button");
            viewBtn.attr("data-name", recipeData);
            viewBtn.text("View");
            const editBtn = $("<button>").addClass("edit-btn btn btn-sm btn-outline-secondary");
            editBtn.attr("type", "button");
            editBtn.attr("data-name", recipeData);
            editBtn.text("Edit");
            const small = $("<small>").addClass("text-muted");
            const span = $("<span>").addClass("date-added");
            var dateAdded = moment.unix(recipeData.dateAdded);
            span.text(dateAdded);
            //Append starting from inside out
            small.append(span);
            btnDiv.append(viewBtn, editBtn);
            dFlexDiv.append(btnDiv, small);
            cardBodyDiv.append(cardTextP, dFlexDiv);
            cardDiv.append(img, cardBodyDiv);
            colDiv.append(cardDiv);
            recipesList.append(colDiv);
        });
    });
};

//Passing the recipe name to the url
$(document).on("click", ".view-btn", ()=> {
    console.log(this);
    var recipeName = $(this).attr("data-name");
    console.log(recipeName);
    var url = new URL("http://recipe-details.html?recipeName=" + recipeName);
    window.location.href = url;
});

//function for displaying recipe detail page

function displayRecipeDetail() {
    //grab recipeName from the url
    let params = new URLSearchParams(queryString.substring(1));
    let query = params.get("recipeName");
    console.log(query);
    database.ref("users/" + id + "/recipes/" + query).once("value", (snapshot) => {
        var recipeDetails = snapshot.val();
        $("#recipe-name").text(recipeDetails.name);
        $(".card-img").attr("src", recipeDetails.pic);
        $("#notes").text(recipeDetails.notes); // Will return as string. 

        recipeDetails.ingredients.forEach(ingredient => {
            var ingredientList = $(".ingredient-list");
            var li = $("<li>").addClass("list-group-item");
            var p = $("<p>");
            var spanQty = $("<span>").attr("id", "quantity");
            var spanIngredient = $("<span>").attr("id", "ingredient");

            p.append(spanQty, spanIngredient);
            li.append(p);
            ingredientList.append(li);  
        });
    });
};

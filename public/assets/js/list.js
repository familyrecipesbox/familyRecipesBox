//global variables
const id = sessionStorage.getItem("uid");

//function for display recipe list
function displayRecipesList() {
    database.ref("users/" + id + "/recipes").once("value", (snapshot) => {
        snapshot.forEach((recipe) => {
            const recipeData = recipe.val();

            const recipesList = $('#recipesList');
            const colDiv = $("<div>").addClass("col-md-3");
            const cardDiv = $("<div>").addClass("card mb-3 box-shadow");
            const img = $("<img>").addClass("card-img-top recipe-card");
            if(recipeData.pic==""){
                img.attr("src", "assets/images/nopic.png");
            }else{
                img.attr("src", recipeData.pic);
            }
           
            const cardBodyDiv = $("<div>").addClass("card-body");
            const cardTextP = $("<p>").text(recipeData.name);
            const dFlexDiv = $("<div>").addClass("d-flex justify-content-between align-items-center");
            const btnDiv = $("<div>").addClass("btn-group");
            const viewBtn = $("<button>").addClass("view-btn btn btn-sm btn-outline-secondary");
            viewBtn.attr("type", "button");
            viewBtn.attr("data-name", recipe.key);
            viewBtn.text("View");
            const editBtn = $("<button>").addClass("edit-btn btn btn-sm btn-outline-secondary");
            editBtn.attr("type", "button");
            editBtn.attr("data-name", recipe.key);
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
$(document).on("click", ".view-btn", function() {
    var recipeName = $(this).attr("data-name");
    //var url = new URL("http://recipe-details.html?recipeName=" + recipeName);
    window.location.href = "recipe-details.html?recipeName=" + recipeName;
});

//Passing the recipe name to the url
$(document).on("click", ".edit-btn", function() {
    var recipeName = $(this).attr("data-name");
    //var url = new URL("http://recipe-details.html?recipeName=" + recipeName);
    window.location.href = "edit.html?recipeName=" + recipeName;
});

$("#edit-recipe").on("click",function(){
    window.location.href = "edit.html?recipeName=" + $(this).attr("data-key");
});

//function for displaying recipe detail page

function displayRecipeDetail() {
    //grab recipeName from the url
    let params = (new URL(document.location)).searchParams;
    let query = params.get("recipeName");
    database.ref("users/" + id + "/recipes/" + query).once("value", (snapshot) => {
        $("#edit-recipe").attr("data-key",query);
        var recipeDetails = snapshot.val();
        $("#recipe-name").text(recipeDetails.name);
        $("#cuisine").text(recipeDetails.cuisine);
        $("#category").text(recipeDetails.category);
        $(".card-img").attr("src", recipeDetails.pic);
        var tempCont = document.createElement("div");
        (new Quill(tempCont)).setContents(JSON.parse(recipeDetails.notes).ops);
        $("#notes").html(tempCont.getElementsByClassName("ql-editor")[0].innerHTML);

        recipeDetails.ingredients.forEach(ingredient => {
            var ingredientList = $(".ingredients-list");
            var li = $("<li>").addClass("list-group-item");
            var p = $("<p>");
            var spanIngredient = $("<span>").attr("id", "ingredient");
            var ing=JSON.parse(ingredient);
            spanIngredient.text(ing.name +" "+ing.quantity);

            p.append(spanIngredient);
            li.append(p);
            ingredientList.append(li);  
        });
    });
};



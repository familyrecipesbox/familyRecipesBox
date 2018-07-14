//global variables
const id = sessionStorage.getItem("email");

//function for display recipe list
function displayRecipesList() {
    database.ref("users/" + id + "/recipes").once("value", (snapshot) => {
        snapshot.forEach((recipe) => {
            const recipeData = recipe.val();

            const recipesList = $('#recipesList');
            const colDiv = $("<div>").addClass("col-md-3");
            const cardDiv = $("<div>").addClass("card mb-3 box-shadow");
            const img = $("<img>").addClass("card-img-top recipe-card");

            if (recipeData.pic == "") {
                img.attr("src", "assets/images/nopic.png");
            } else {
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
            const delBtn = $("<button>").addClass("del-btn btn btn-sm btn-outline-secondary");
            delBtn.attr("type", "button");
            delBtn.attr("data-name", recipe.key);
            delBtn.text("Delete");
            const shareBtn = $("<button>").addClass("share-btn btn btn-sm btn-outline-secondary");
            shareBtn.attr("type", "button");
            shareBtn.attr("data-name", recipe.key);
            shareBtn.text("Share");
            const small = $("<small>").addClass("text-muted");
            const span = $("<span>").addClass("date-added");
            var dateAdded = moment.unix(recipeData.dateAdded);
            //span.text(dateAdded);
            //Append starting from inside out
            small.append(span);
            btnDiv.append(viewBtn, editBtn, shareBtn);
            dFlexDiv.append(btnDiv, small);
            cardBodyDiv.append(cardTextP, dFlexDiv);
            cardDiv.append(img, cardBodyDiv);
            colDiv.append(cardDiv);
            recipesList.append(colDiv);
        });
    });
};

//Passing the recipe name to the url
$(document).on("click", ".view-btn", function () {
    var recipeName = $(this).attr("data-name");
    //var url = new URL("http://recipe-details.html?recipeName=" + recipeName);
    window.location.href = "recipe-details.html?recipeName=" + recipeName;
});

//Passing the recipe name to the url
$(document).on("click", ".edit-btn", function () {
    var recipeName = $(this).attr("data-name");
    window.location.href = "edit.html?recipeName=" + recipeName;
});

$(document).on("click", ".del-btn", function () {
    var recipeName = $(this).attr("data-name");
    swal({
        title: 'Are you sure? Recipe looks good!',
        text: "You won't be able to revert this!",
        icon: 'info'
    }).then((result) => {
        if (result.value) {
            database.ref("users/" + id + "/recipes/").child(recipeName).remove().then(() => {
                swal('It looked good :(', 'Recipe is out of your box!', 'success');
            });
        }
    });
});


//Passing the recipe name to the url
$(document).on("click", ".share-btn", function () {
    var recipeName = $(this).attr("data-name");
    swal("Share to email id :", {
        content: "input",
    })
        .then((value) => {
            if (value.trim() != "") {
                let email = value.split("@")[0].replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
                if (email.trim() != "") {
                    database.ref("users/" + email).once("value", (snapshot) => {

                    }).then(function (snapshot) {
                        if (snapshot.val() != null) {
                            console.log("Found user in DB");
                            database.ref("users/" + id + "/recipes/" + recipeName).once("value", (snapshot) => {
                                database.ref("users/" + value + "/recipes/" + recipeName).set(snapshot.val())
                                    .then(function () {
                                        swal("Sweet!", "Your family member or friend has access to the recipe now.", "success");
                                    });
                            });
                        } else {
                            swal("oops!!", "Friend or family member should login to have access.", "error");
                        }
                    });
                }
            }
        });
});

$("#edit-recipe").on("click", function () {
    window.location.href = "edit.html?recipeName=" + $(this).attr("data-key");
});

//function for displaying recipe detail page

function displayRecipeDetail() {
    //grab recipeName from the url
    let params = (new URL(document.location)).searchParams;
    let query = params.get("recipeName");
    database.ref("users/" + id + "/recipes/" + query).once("value", (snapshot) => {
        $("#edit-recipe").attr("data-key", query);
        var recipeDetails = snapshot.val();
        $("#recipe-name").text(recipeDetails.name);
        getCuisineName(recipeDetails.cuisine);
        getCategoryName(recipeDetails.category);
        $(".card-img").attr("src", recipeDetails.pic);
        var tempCont = document.createElement("div");
        (new Quill(tempCont)).setContents(JSON.parse(recipeDetails.notes).ops);
        $("#notes").html(tempCont.getElementsByClassName("ql-editor")[0].innerHTML);

        recipeDetails.ingredients.forEach(ingredient => {
            var ingredientList = $(".ingredients-list");
            var li = $("<li>").addClass("list-group-item");
            var p = $("<p>");
            var spanIngredient = $("<span>").attr("id", "ingredient");
            var ing = JSON.parse(ingredient);
            spanIngredient.text(ing.name + " " + ing.quantity);

            p.append(spanIngredient);
            li.append(p);
            ingredientList.append(li);
        });
    });
};

function getCuisineName(cuisineId) {
    if (cuisineId != "") {
        database.ref("cuisines/" + cuisineId).once("value", (snapshot) => {
            $("#cuisine").text(snapshot.val().name);
        });
    }
}

function getCategoryName(categoryId) {
    if (categoryId != "") {
        database.ref("categories/" + categoryId).once("value", (snapshot) => {
            $("#category").text(snapshot.val().name);
        });
    }
}

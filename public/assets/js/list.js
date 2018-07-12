//function for display recipe list
const id = sessionStorage.getItem("uid");
function displayRecipesList() {
    database.ref("users/" + id + "/recipes").on("value", (snapshot) => {

        //Conditional for validating userid
        snapshot.forEach((recipe) => {
            const recipesList = $('#recipesList');
            const colDiv = $("<div>").addClass("col-md-4");
            const cardDiv = $("<div>").addClass("card mb-4 box-shadow");
            const img = $("<img>").addClass("card-img-top");
            img.attr("src", recipe.val().pic);
            const cardBodyDiv = $("<div>").addClass("card-body");
            const cardTextP = $("<p>").text(recipe.val().name);
            const dFlexDiv = $("<div>").addClass("d-flex justify-content-between align-items-center");
            const btnDiv = $("<div>").addClass("btn-group");
            const viewBtn = $("<button>").addClass("view-btn btn btn-sm btn-outline-secondary");
            viewBtn.attr("type", "button");
            viewBtn.text("View");
            const editBtn = $("<button>").addClass("edit-btn btn btn-sm btn-outline-secondary");
            editBtn.attr("type", "button");
            editBtn.text("Edit");
            const small = $("<small>").addClass("text-muted");
            const span = $("<span>").addClass("date-added");
            var dateAdded = moment.unix(recipe.val().dateAdded);
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

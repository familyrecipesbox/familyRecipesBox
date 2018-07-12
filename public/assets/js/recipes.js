
  var quill = new Quill('#editor', {
    theme: 'snow'
  });

// Add Recipe
$("#add-recipe").on("click", function (event) {
    const id = sessionStorage.getItem("uid");
    event.preventDefault();
    let recipe = new Object();

    const metadata={
        contentType:"image/jpeg"
    };
    recipe.name = $("#name").val().trim();
    recipe.pic = document.getElementById("pic").files[0];
    recipe.cuisine = $("#cuisines").val();
    recipe.category = $("#categories").val();
    var notes = $('#notes');
    notes.val( JSON.stringify(quill.getContents()));
    recipe.notes = $("#notes").val();
    let file = new File([recipe.pic], recipe.pic, { "type": "image/jpeg" });
    var fileName = document.getElementById("pic").files[0].name;
    console.log(document.getElementById("pic").files[0]);
    console.log(file);
    let uploadTask = storage.ref("images/" + id + "/" + fileName).put(file,metadata);
    let url = "";
    uploadTask.on('state_changed', function (snapshot) {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        $("#uploader").val(progress);
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
        }
    }, function (error) {
        // Handle unsuccessful uploads
    }, function () {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            url = downloadURL;
            console.log('File available at', downloadURL);
            // Code for handling the push
            database.ref("users/" + id + "/recipes/"+recipe.name.replace(" ","")).set({
                "name": recipe.name,
                "cuisine": recipe.cuisine,
                "pic": url,
                "category": recipe.category,
                "notes": recipe.notes,
                "dateAdded": firebase.database.ServerValue.TIMESTAMP,
                "dateUpdated": ""
            });
            clear();
            swal("Looks yum!", "Added recipe to your box!!", "success");
        });

    });


});

//function for clearing input after adding recipes
function clear(){
    $("#name").val("");
    $("#pic").val("");
    $("#cuisines").val("");
    $("#categories").val("");
    $("#notes").val("");
   quill.setContents("");
    $("#uploader").val(0);
}



$(document).ready(function () {
    database.ref("cuisines").once("value", function (snapshot) {
        snapshot.forEach(function(cuisine) {
            let option = $("<option>").html(cuisine.val().name).val(cuisine.val().id);
            $("#cuisines").append(option);
        });
    });
    database.ref("categories").once("value", function (snapshot) {
        snapshot.forEach(function(category) {
            let option = $("<option>").html(category.val().name).val(category.val().id);
            $("#categories").append(option);
        });
    });
});

//function for display recipe list

function displayRecipesList () {
    database.ref("users").on("value", (snapshot) => {
        snapshot.forEach((user) => {
            const userId = user.val();
            const uid = sessionStorage.getItem("uid");
            const recipes = userId.recipes;
            if (userId === uid) {
                //Conditional for validating userid
                recipes.forEach((recipe) => {
                    const recipesList = $('#recipesList');
                    const colDiv = $("<div>").addClass("col-md-4");
                    const cardDiv = $("<div>").addClass("card mb-4 box-shadow");
                    const img = $("<img>").addClass("card-img-top");
                    img.attr("src", recipe.pic);
                    const cardBodyDiv = $("<div>").addClass("card-body");
                    const cardTextP = $("<p>").text(recipe.name);
                    const dFlexDiv = $("<div>").addClass("d-flex justify-content-between align-items-center");
                    const btnDiv = $("<div>").addClass("btn-group");
                    const viewBtn = $("<button>").addClass("view-btn btn btn-sm btn-outline-secondary");
                    viewBtn.attr("type", "button");
                    viewBtn.text("View");
                    const editBtn = $("<button>").addClass("edit-btn btn btn-sm btn-outline-secondary");
                    viewBtn.attr("type", "button");
                    viewBtn.text("Edit");
                    const small = $("<small>").addClass("text-muted");
                    const span = $("<span>").addClass("date-added");
                    var dateAdded = moment.unix(recipe.dateAdded);
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
            } else {
                alert("User's recipes list does not exist");
                logout();
            }
        });
    });
};

displayRecipesList();
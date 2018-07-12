
var quill = new Quill('#editor', {
    theme: 'snow'
});

let recipe = {};
const id = sessionStorage.getItem("uid");
let ingIndex = 1;

function addIng() {
    let name = "ing" + ingIndex;
    let ingsdiv = $("<div>")
        .addClass("ings");
    let txt = $("<input>")
        .attr("type", "text")
        .attr("id", name + "-name");
    let quantOptions = $("<select>")
        .addClass("form-control quantity")
        .attr("id", name + "-quantity")
        .html("<option id=''>Please select</option>");
    ingsdiv.append(txt, quantOptions);
    $("#ing-list").append(ingsdiv);
    loadQuantities(name + "-quantity");
    ingIndex++;
}

function uploadPic() {
    recipe.pic = document.getElementById("pic").files[0];

    let file = new File([recipe.pic], recipe.pic, { "type": "image/jpeg" });
    var fileName = document.getElementById("pic").files[0].name;

    console.log(document.getElementById("pic").files[0]);
    console.log(file);
    let timestamp=Math.round(+new Date()/1000);
    let uploadTask = storage.ref("images/" + id + "/" + fileName+timestamp).put(file);
    recipe.url = "";

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
            recipe.url = downloadURL;
            $("#recipe-pic").removeAttr("data-src");
            $("#recipe-pic").attr("src", recipe.url);
            console.log('File available at', downloadURL);
        });
    });
}

$("#add-recipe").on("click", function (event) {

    event.preventDefault();
    if (recipe.url == undefined) {
        recipe.url = "";
    }
    recipe.name = $("#name").val().trim();
    recipe.cuisine = $("#cuisines").val();
    recipe.category = $("#categories").val();
    var notes = $('#notes');
    notes.val(JSON.stringify(quill.getContents()));
    recipe.notes = $("#notes").val();

    if (validate($("#name")) && validate($("#notes"))) {
        // Code for handling the push
        database.ref("users/" + id + "/recipes/" + recipe.name.replace(" ", "")).set({
            "name": recipe.name,
            "cuisine": recipe.cuisine,
            "pic": recipe.url,
            "category": recipe.category,
            "notes": recipe.notes,
            "dateAdded": firebase.database.ServerValue.TIMESTAMP,
            "dateUpdated": ""
        });
        // clear();
        swal("Looks yum!", "Added recipe to your box!!", "success");
        window.location = "recipes.html";
    }
});

//Validate element is blank
function validate(element) {
    if (element.val().trim() == "") {
        $("#" + element.attr("id") + "-error").show();
        element.focus();
        return false;
    } else {
        $("#" + element.attr("id") + "-error").hide();
        return true;
    }
}

//function for clearing input after adding recipes
function clear() {
    $("#name").val("");
    $("#pic").val("");
    $("#cuisines").val("");
    $("#categories").val("");
    $("#notes").val("");
    quill.setContents("");
    $("#uploader").val(0);
    $(".ings").remove();
    $("#recipe-pic").removeAttr("src");
    $("#recipe-pic").attr("data-src", "holder.js/50px75px?theme=thumb&bg=cccccc&fg=eceeef&text=Recipe pic");
}

function loadQuantities(elementId) {
    database.ref("quantities").once("value", function (snapshot) {
        snapshot.forEach(function (quantity) {
            let option = $("<option>").html(quantity.val().name).val(quantity.val().id);
            $("#" + elementId).append(option);
        });
    });
}



$(document).ready(function () {
    //Hiding validation error divs
    $(".error").hide();

    database.ref("cuisines").once("value", function (snapshot) {
        snapshot.forEach(function (cuisine) {
            let option = $("<option>").html(cuisine.val().name).val(cuisine.val().id);
            $("#cuisines").append(option);
        });
    });
    database.ref("categories").once("value", function (snapshot) {
        snapshot.forEach(function (category) {
            let option = $("<option>").html(category.val().name).val(category.val().id);
            $("#categories").append(option);
        });
    });
});


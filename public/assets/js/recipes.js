$("#add-recipe").on("click", function (event) {
    const id = sessionStorage.getItem("uid");
    event.preventDefault();
    let recipe = new Object();

    recipe.name = $("#name").val().trim();
    recipe.pic = $("#pic").val();
    recipe.cuisine = $("#cuisines").val();
    recipe.category = $("#categories").val();
    recipe.notes = $("#notes").val();
    let file = new File([''], recipe.pic, { "type": "image/jpeg" });
    var fileName = recipe.pic.substring(recipe.pic.lastIndexOf('\\') + 1);
    console.log(fileName);

    let uploadTask = storage.ref("images/" + id + "/" + fileName).put(file);
    let url = "";
    uploadTask.on('state_changed', function (snapshot) {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
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


function clear(){
    $("#name").val("");
    $("#pic").val("");
    $("#cuisines").val("");
    $("#categories").val("");
    $("#notes").val("");
}

$(document).ready(function () {
    database.ref("cuisines").once("value", function (snapshot) {
        snapshot.forEach((cuisine) => {
            let option = $("<option>").html(cuisine.val().name).val(cuisine.val().id);
            $("#cuisines").append(option);
        });
    });
    database.ref("categories").once("value", function (snapshot) {
        snapshot.forEach((category) => {
            let option = $("<option>").html(category.val().name).val(category.val().id);
            $("#categories").append(option);
        });
    });
});
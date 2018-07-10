

function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then(result => {
            const user = result.user;
            const id = user.uid;
            sessionStorage.setItem("uid", user.uid);
            sessionStorage.setItem("name", user.displayName);
            sessionStorage.setItem("pp", user.photoURL);
            let users = database.ref("users");
            users.once('value', function (snapshot) {
                if (!snapshot.hasChild(id)) {
                    // Code for handling the push
                    database.ref("users/" + id).set({
                        "id": user.uid,
                        "fullName": user.displayName,
                        "email": user.email,
                        "photoURL": user.photoURL,
                        "providerId": "google.com",
                        "dateAdded": firebase.database.ServerValue.TIMESTAMP,
                        "dateUpdated": "",
                        "loginTime": firebase.database.ServerValue.TIMESTAMP,
                        "logoutTime": ""
                    });
                } else {
                    database.ref("users/" + id).update({
                        "dateUpdated": firebase.database.ServerValue.TIMESTAMP,
                        "loginTime": firebase.database.ServerValue.TIMESTAMP,
                        "logoutTime": ""
                    });
                }
                console.log(user);
                window.location = 'recipes.html';
            });



        }).catch(function (error) {
            console.log("error" + error);
        }

        )
}





function logout() {
    firebase.auth().signOut().then(function () {
        const id = sessionStorage.getItem("uid");


        database.ref("users/" + id).update({
            "logoutTime": firebase.database.ServerValue.TIMESTAMP
        });

        window.location = "index.html";
    }).catch(function (error) {
        // An error happened.
    });
}
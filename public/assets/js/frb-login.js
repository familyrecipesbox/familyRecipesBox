

      function googleLogin(){
          const provider=new firebase.auth.GoogleAuthProvider();
          firebase.auth().signInWithPopup(provider)
          .then(result=>{
              const user=result.user;
              sessionStorage.setItem("uid",user.uid);
              sessionStorage.setItem("name",user.displayName);
              sessionStorage.setItem("pp",user.photoURL);
               // Code for handling the push
            database.ref("users").push({
                "id": user.uid,
                "fullName": user.displayName,
                "email":user.email,
                "photoURL":user.photoURL,
                "providerId":"google.com",
                "dateAdded": firebase.database.ServerValue.TIMESTAMP
            });
              window.location = 'recipes.html';
              console.log(user);

          }).catch(function(error){
            console.log("error"+error);          }
              
          )
      }

      firebase.auth().signInAnonymously().catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        
      });



      function logout(){
        firebase.auth().signOut().then(function() {
            window.location="index.html";
          }).catch(function(error) {
            // An error happened.
          });
      }
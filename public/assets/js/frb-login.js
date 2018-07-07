

      function googleLogin(){
          const provider=new firebase.auth.GoogleAuthProvider();
          firebase.auth().signInWithPopup(provider)
          .then(result=>{
              const user=result.user;
              sessionStorage.setItem("uid",user.uid);
              sessionStorage.setItem("name",user.displayName);
              window.location = 'recipes.html';
              //document.write("Hello! "+user.displayName);
              console.log(user);

          }).catch(
              console.log()
          )
      }

      function logout(){
        firebase.auth().signOut().then(function() {
            window.location="index.html";
          }).catch(function(error) {
            // An error happened.
          });
      }
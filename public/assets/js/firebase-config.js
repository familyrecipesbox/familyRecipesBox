


  document.addEventListener('DOMContentLoaded', function() {
    let app = firebase.app();
    console.log(app);
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    // // The Firebase SDK is initialized and available here!
    //
    //firebase.auth().onAuthStateChanged(user => { });
    //firebase.database().ref('/path/to/ref').on('value', snapshot => { });
    //firebase.messaging().requestPermission().then(() => { });
    //firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
    //
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

    /*try {
      let app = firebase.app();
      let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
      //document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;
    } catch (e) {
      console.error(e);
     // document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
    }*/
  });



  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBJiG1i_nzx3GtS-I5IpTFAWpXE4f1L_4c",
    authDomain: "frbox-95742.firebaseapp.com",
    databaseURL: "https://frbox-95742.firebaseio.com",
    projectId: "frbox-95742",
    storageBucket: "frbox-95742.appspot.com",
    messagingSenderId: "631164592713"
  };
  firebase.initializeApp(config);

  // Create a variable to reference the database.
var database = firebase.database();
var storage=firebase.storage();
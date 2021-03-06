// Initialize Firebase
var config = {
    apiKey: "AIzaSyA5FCtuvrR61E1o8I52F_19N28RJa53AKA",
    authDomain: "civuserdata.firebaseapp.com",
    databaseURL: "https://civuserdata.firebaseio.com",
    projectId: "civuserdata",
    storageBucket: "civuserdata.appspot.com",
    messagingSenderId: "780486775608"
};
firebase.initializeApp(config);

var db = firebase.firestore();

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            return true; 
        },
        uiShown: function () { document.getElementById('loader').style.display = 'none'; } // Hide loader when widget has loaded
    },
    signInFlow: 'popup',
    credentialHelper: firebaseui.auth.CredentialHelper.NONE, // Disable the Account Chooser 
    signInSuccessUrl: '/',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
};
ui.start('#firebaseui-auth-container', uiConfig); // The start method will wait until the DOM is loaded.


const preferenceForm = document.querySelector('#preferenceForm');
preferenceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    var user = firebase.auth().currentUser;
    
    db.collection('users').doc(user.uid).set({
        playerName: preferenceForm['playerName'].value,
        discordID: preferenceForm['discordID'].value,
        email: user.email,
        //phoneNumber: preferenceForm['phoneNumber'].value,
        
        discordNotifs: preferenceForm['discordNotifs'].checked,
        emailNotifs: preferenceForm['emailNotifs'].checked,
        smsNotifs: preferenceForm['smsNotifs'].checked
    }).then( () => {
        confirmUpdate();
    })
})

// Sign out when the sign out button is clicked
const signOut = document.querySelectorAll('#signout');
signOut.forEach(item => { 
    item.addEventListener('click', (e) => {
        e.preventDefault(); //Prevent page from reloading
        
        firebase.auth().signOut().then(function () {
            
        }).catch(function (error) {
            console.log(error)
        });
    });
})

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        setupUI(user);
        // Get the user data and update the form with the user's preferences
        db.collection('users').doc(user.uid).get().then( (doc) => {
            updateForm( doc.data(), user.email );
        });
    } else {
        setupUI(user);
    }
});

// Delete the logged in user
const deleteUser = document.querySelectorAll('#deleteUser');
deleteUser.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault(); //Prevent page from reloading

        db.collection("users").doc(firebase.auth().currentUser.uid).delete().then(function () {

            firebase.auth().currentUser.delete().then(function () {
                var modal = document.querySelector('#deleteAccountModal');
                M.Modal.getInstance(modal).close();
            }).catch( error => { logDeleteError(error) } )
            
        }).catch( error => { console.error(error.message) } )

    });
})
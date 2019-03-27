document.addEventListener('DOMContentLoaded', function () {
    M.AutoInit();
});

const confirmUpdate = () => {
    const updated = document.querySelector('#updated');
    updated.innerHTML = 'Your preferences have been updated!'; // Give a confirmation that the preferences have been updated
    // Make the message go away after some time
    setTimeout( () => {
        updated.innerHTML = ''
    }, 3000);
}


const loggedInLinks = document.querySelectorAll('.logged-in');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const userGreetings = document.querySelectorAll('.userGreeting');

const setupUI = (user) => {
    if(user) {
        loggedInLinks.forEach( item => item.style.display = 'block' );
        loggedOutLinks.forEach(item => item.style.display = 'none');
        // Display account details        
        userGreetings.forEach(item => item.innerHTML = `${user.displayName}`);

    } else {
        loggedInLinks.forEach(item => item.style.display = 'none');
        loggedOutLinks.forEach(item => item.style.display = 'block');
        preferenceForm.reset(); // Clears the previous user's data when logging out
    }
}


const updateForm = ( data ) => {

    preferenceForm['email'].value = data.email;

    if( data.playerName ) { // New users have not yet assigned a playerName, so their data will be empty until they submit information
        preferenceForm['playerName'].value = data.playerName;
        preferenceForm['discordID'].value = data.discordID;
        //preferenceForm['phone'].value = data.phoneNumber;
        preferenceForm['discordNotifs'].checked = data.discordNotifs;
        preferenceForm['emailNotifs'].checked = data.emailNotifs;
        preferenceForm['smsNotifs'].checked = data.smsNotifs;
    }

    M.updateTextFields(); // Updates the styling of the text fields so that the labels don't cover the data when it is present
}
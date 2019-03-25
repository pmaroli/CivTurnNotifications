document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
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
const userGreeting = document.querySelector('.userGreeting');

const setupUI = (user) => {
    if(user) {
        loggedInLinks.forEach( item => item.style.display = 'block' );
        loggedOutLinks.forEach(item => item.style.display = 'none');
        // Display account details
        var html1 = `
            <span>Welcome, ${user.displayName}</span>
        `;
        
        userGreeting.innerHTML = html1;
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
        preferenceForm['discordNotifs'].checked = data.discordNotifs;
        preferenceForm['emailNotifs'].checked = data.emailNotifs;
        preferenceForm['smsNotifs'].checked = data.smsNotifs;
    }

    M.updateTextFields(); // Updates the styling of the text fields so that the labels don't cover the data when it is present
}
/**************************************************************/
// main.mjs
// Main entry for index.html
// Written by Wilfred Leicester, Term 2 2025
/**************************************************************/

import { fb_initialise, fb_authenticate, fb_authChanged, fb_logout, fb_read, fb_write, fb_update, fb_readSorted, fb_delete } from './fb.mjs';
window.fb_initialise = fb_initialise;
window.fb_authenticate = fb_authenticate;
window.fb_authChanged = fb_authChanged;
window.fb_logout = fb_logout;
window.fb_read = fb_read;
window.fb_write = fb_write;
window.fb_update = fb_update;
window.fb_readSorted = fb_readSorted;
window.fb_delete = fb_delete;

fb_initialise();

const elements = document.getElementsByClassName('gameIcon'); 
for (let i = 0; i < elements.length; i++) {
	const element = elements[i];
	
	element.addEventListener("click", () => {
		sessionStorage.setItem('game', element.id);
    });
}


document.getElementById('LogButton').addEventListener('click', function() {

    if (sessionStorage.getItem('UID') == null) {
		login();
	} else {
		logout();
	}
});


function updateStatus() {
	document.getElementById('LogButton').innerHTML = "Log In";
	
}

async function logout() {
	await fb_logout();
	sessionStorage.removeItem('UID');
	updateStatus();
}

async function login() {
	let userData = await fb_authenticate();
	
	sessionStorage.setItem('UID', userData.user.uid);
	document.getElementById('LogButton').innerHTML = "Log Out";

	document.getElementById('DisplayName').innerHTML = await fb_read("UserData/" + sessionStorage.getItem('UID') + "/Username");
}

async function changeName() {
	var newName = prompt("What do you want your username to be?");
	await fb_write("UserData/" + sessionStorage.getItem('UID') + "/Username", newName )

	document.getElementById('DisplayName').innerHTML = await fb_read("UserData/" + sessionStorage.getItem('UID') + "/Username");
}

window.changeName = changeName;


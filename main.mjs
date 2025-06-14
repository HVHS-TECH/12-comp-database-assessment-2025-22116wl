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

const elements = document.getElementsByClassName('gameIcon'); 
for (let i = 0; i < elements.length; i++) {
	const element = elements[i];
	
	element.addEventListener("click", () => {
		sessionStorage.setItem('game', element.id);
    });

	element.querySelector("img").src = "/Games/" + element.id + "/Icon.png";

	const nameModule = await import(`./Games/${element.id}/gameName.mjs`);
	element.querySelector(".gameName").innerHTML = nameModule.gameName;
}


document.getElementById('LogButton').addEventListener('click', function() {

    if (sessionStorage.getItem('UID') == null) {
		login();
	} else {
		logout();
	}
});


async function updateStatus() {
	if (sessionStorage.getItem('UID') != null) {
		//Logged in
		document.getElementById('DisplayName').innerHTML = "Display Name: " + await fb_read("UserData/" + sessionStorage.getItem('UID') + "/Username");
		document.getElementById('DisplayName').style = "Display: block;"

		document.getElementById('LogButton').innerHTML = "Log Out";
		document.getElementById('logStatus').innerHTML = "Logged in";

		document.getElementById('SettingsButton').disabled = false;
	} else {
		//Not logged in
		document.getElementById('LogButton').innerHTML = "Log In";
		document.getElementById('logStatus').innerHTML = "Not logged in";

		document.getElementById('DisplayName').style = "Display: none;"

		document.getElementById('SettingsButton').disabled = true;
	}
}

async function logout() {
	fb_logout();
	updateStatus();
}

async function login() {
	let userData = await fb_authenticate();
	
	const UID = userData.user.uid;

	var userExists = await fb_read("UserData/" + UID);

	if(userExists == null) {
		//Add entry for this user in userData table
		fb_write("UserData/" + UID, 
			{
				Username: "",
			}
		)

		//Add entry for this user is all leaderboards
		Object.keys(await fb_read('Leaderboard')).forEach(game => {
			fb_write("Leaderboard/" + game + "/" + UID, { Score: 0 } )
		});
		
		changeName();
	}

	updateStatus();
}

async function changeName() {
	var newName = prompt("What do you want your display name to be?");
	if (newName != null && newName != "" && newName != " ") {
		await fb_write("UserData/" + sessionStorage.getItem('UID') + "/Username", newName);
		updateStatus();
	}
}

window.changeName = changeName;

updateStatus();
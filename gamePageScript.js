var currentGame = sessionStorage.getItem('game');
console.log(currentGame);

import { fb_initialise, fb_authenticate, fb_readSorted, fb_read, fb_write } from "./fb.mjs";
fb_initialise();

// Detect element added, if element is p5 canvas then add it to the div
const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        for (const element of mutation.addedNodes) {
            //if element is the p5 play canvas
            if (element.className == "p5-fullscreen") {
                document.getElementById('horizontalContainer').appendChild(element);

                //disconnect function after canvas added
                observer.disconnect();
            }
        }
    }
});

observer.observe(document.body, {childList: true, subtree: true});

console.log('listening');
window.addEventListener('scoreChanged', async function(event) {
    console.log("Event received!");

    const score = event.detail.score;
    const oldScore = await fb_read('Leaderboard/' + currentGame + "/" + (sessionStorage.getItem("UID")) + "/Score");

    console.log(score);
    console.log(oldScore);

    await fb_authenticate();
    
    if (score > oldScore) {
        //New High Schore

        console.log("Leaderboard/" + currentGame + "/" + sessionStorage.getItem("UID"));

        await fb_write("Leaderboard/" + currentGame + "/" + sessionStorage.getItem("UID"), { Score: score });
    }
});

const leaderboardSpots = document.getElementsByClassName('leaderboardEntry').length;
console.log(leaderboardSpots);
var leaderboard = await fb_readSorted("Leaderboard/" + currentGame, "Score", leaderboardSpots);

var entries = document.getElementsByClassName('leaderboardEntry');
for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];

    if (leaderboard[i] != null) {
        const key = Object.keys(leaderboard[i])[0];
        const value = leaderboard[i][key];  //entry from first key in object (just score)
        
        const userName = await fb_read("UserData/" + key + "/Username");
        
        entry.querySelector(".leaderboardUsername").innerHTML = userName;
        entry.querySelector(".leaderboardScoreNumber").innerHTML = value;
    } else {
        // If there is not 4th 5th 6th etc place entry then hide the html element
        entry.style = "display: none";
    }
}
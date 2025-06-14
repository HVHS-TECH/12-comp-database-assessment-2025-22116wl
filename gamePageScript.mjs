var currentGame = sessionStorage.getItem('game');
console.log(currentGame);

const nameModule = await import(`./Games/${currentGame}/gameName.mjs`);
document.querySelector("h1").innerHTML = nameModule.gameName;

import { fb_initialise, fb_authenticate, fb_readSorted, fb_read, fb_write, fb_valChanged } from "./fb.mjs";


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
    const oldScore = await fb_read('Leaderboard/' + currentGame + "/" + sessionStorage.getItem("UID") + "/Score");

    console.log(score);
    console.log(oldScore);

    if (score > oldScore) {
        //New High Schore

        console.log("Leaderboard/" + currentGame + "/" + sessionStorage.getItem("UID"));

        await fb_write("Leaderboard/" + currentGame + "/" + sessionStorage.getItem("UID"), { Score: score });
    }
});

async function drawLeaderboard() {
    const leaderboardSpots = document.getElementsByClassName('leaderboardEntry').length;
    console.log(leaderboardSpots);
    var leaderboard = await fb_readSorted("Leaderboard/" + currentGame, "Score", leaderboardSpots);
    
    var entries = document.getElementsByClassName('leaderboardEntry');
    for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        
        if (leaderboard[i] != null) {
            const key = Object.keys(leaderboard[i])[0];
            const value = leaderboard[i][key];  //entry from first key in object (just score)
            
            if (key == sessionStorage.getItem('UID')) {
                //is user
                console.log(entry);
                console.log(entry instanceof HTMLElement);
                
                entry.querySelector(".leaderboardUsername").style.color = "#ba8800";
                entry.querySelector(".leaderboardScoreNumber").style.color = "#ba8800";
            } else {
                entry.querySelector(".leaderboardUsername").style.color = "#000000";
                entry.querySelector(".leaderboardScoreNumber").style.color = "#000000";
            }

            entry.querySelector(".leaderboardUsername").innerHTML = await fb_read("UserData/" + key + "/Username");;
            entry.querySelector(".leaderboardScoreNumber").innerHTML = value;
            
            entry.style = "display: list-item";
        } else {
            // If there is not 4th 5th 6th etc place entry then hide the html element
            entry.style = "display: none";
        }
    }
}

drawLeaderboard();

fb_valChanged("Leaderboard/" + currentGame, function() {
    drawLeaderboard();
});
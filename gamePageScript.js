console.log(sessionStorage.getItem('game'));


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
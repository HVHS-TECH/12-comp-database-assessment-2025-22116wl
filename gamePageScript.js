console.log(sessionStorage.getItem('game'));


// Small wait so it can load before it parents it
setTimeout(function() {
    document.getElementById('horizontalContainer').appendChild(document.querySelector('.p5-fullscreen'));
}, 1800);
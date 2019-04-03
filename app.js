// const body = document.querySelector("body");
let u; //User in firebase
let sy = 0; //Source y
let sx = 0; //Source x
let dx = 0; //destination x
let dy = 0; //destination y
let health = 100;

let canvas = document.querySelector("canvas");
canvas.style.display = "none";
let context = canvas.getContext("2d");
context.canvas.height = window.innerHeight;
context.canvas.width = window.innerWidth;
canvas.style.backgroundColor = "black";

let frameSizeX = 45;
let frameSizeY = 50;

let totalXFrames = 3;
let currentXFrame = 0;
let skeleton = new Image();
skeleton.src = "./images/spritesheetAstro.png";

let otherSkeletons = [];

function initializeSkeleton() {
    window.firebase.database().ref('/' + u.uid + '/skeleton').once('value').then(function(snapshot) {
        let savedSkeleton = snapshot.val();
        if (savedSkeleton) {
            sy = savedSkeleton.sy;
            sx = savedSkeleton.sx;
            dy = savedSkeleton.dy;
            dx = savedSkeleton.dx;
            health = health;
        }
        canvas.style.display = "inline";
        redraw();
    });
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        u = user;
        initializeSkeleton();
    } else {
        window.location.href = "./authenticate.html"
    }
});

function Planet(sx,sy){
    this.sx = sx,
    this.sy = sy,
    this.flagged = false
}

function Asteroid(sx,sy,dx,dy){
    this.sx = sx,
    this.sy = sy,
    this.dx = dx,
    this.dy = dy
}

window.addEventListener("resize", function() {
    context.canvas.height = window.innerHeight;
    context.canvas.width = window.innerWidth;
    redraw();

});

function redraw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(skeleton, sx, sy, 45, 50, dx, dy, 45, 50);

    otherSkeletons.forEach(function(e) {
        context.drawImage(skeleton, e.user.skeleton.sx, e.user.skeleton.sy, 45, 50, e.user.skeleton.dx, e.user.skeleton.dy, 45, 50);
    })
}


window.addEventListener("keydown", function(e) {
    currentXFrame++;
    if (currentXFrame > totalXFrames) {
        currentXFrame = 0;
    }

    switch (e.key) {
        case "w":
            {
                dy -= 10;
                sy = 3 * frameSizeY;
                sx = currentXFrame * frameSizeX;
                // console.log("up");
                break;
            }
        case "a":
            {
                dx -= 10;
                sy = 1 * frameSizeY;
                sx = currentXFrame * frameSizeX;
                // console.log("left");
                break;
            }
        case "d":
            {
                dx += 10;
                sy = 2 * frameSizeY;
                sx = currentXFrame * frameSizeX;
                // console.log("right");
                break;
            }
        case "s":
            {
                dy += 10;
                sy = 0 * frameSizeY;
                sx = currentXFrame * frameSizeX;
                // console.log("down");
                break;
            }
    }
    if (dy < 0) {
        dy = 0;
    }
    if (dy + frameSizeY > context.canvas.height) {
        dy = context.canvas.height - frameSizeY;
    }

    if (dx < 0) {
        dx = 0;
    }
    if (dx + frameSizeX > context.canvas.width) {
        dx = context.canvas.width - frameSizeX;
    }

    const skeleton = {
        sx: sx,
        sy: sy,
        dx: dx,
        dy: dy,
        health: health
    }

    window.firebase.database().ref('/' + u.uid + '/name').set(u.email);
    window.firebase.database().ref('/' + u.uid + '/skeleton').set(skeleton);
    // window.firebase.database().ref('/' + u.uid + 'planet');
    redraw();

})

redraw();

var body = document.querySelector("body");
var u; //User in firebase
var sy = 0; //Source y
var sx = 0; //Source x
var dx = 0; //destination x
var dy = 0; //destination y
var health = 100;

var canvas = document.querySelector("canvas");
canvas.style.display = "none";
var context = canvas.getContext("2d");
context.canvas.height = window.innerHeight;
context.canvas.width = window.innerWidth;
canvas.style.backgroundColor = "black";

var frameSizeX = 45;
var frameSizeY = 50;

var totalXFrames = 3;
var currentXFrame = 0;

var asteroids = [];
var planets = [];
var planetSrc = ["./images/planet1.png","./images/planet2.png","./images/planet3.png"];
var asterSrc = ["./images/asteroid1.png","./images/asteroid2.png","./images/asteroid3.png","./images/asteroid1.png"];

var flag = new Image();
flag.src = "./images/flag.png";

var flagsPlaced = 0;

function plusOrMinus(){
    var num = Math.random();
    if(num > 0.5){
        return 1
    } else{
        return -1
    }
}

function createAsteroids(){
    for(var i=0; i<asterSrc.length; i++){
        asteroids.push(new Image());
        asteroids[i].sx =  Math.floor(Math.random()*(.9 * context.canvas.width));
        asteroids[i].sy =  Math.floor(Math.random()*(.9 * context.canvas.height));
        asteroids[i].src = asterSrc[i];
    }
}

function createPlanets(){
    for(var i=0; i<planetSrc.length; i++){
        planets.push(new Image());
        planets[i].src = planetSrc[i];
        planets[i].sx =  Math.floor(Math.random()*(.85 * context.canvas.width));
        planets[i].sy =  Math.floor(Math.random()*(.85 * context.canvas.height));
        planets[i].flagged = false;
    }
}

createPlanets();
createAsteroids();

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

window.addEventListener("resize", function() {
    context.canvas.height = window.innerHeight;
    context.canvas.width = window.innerWidth;
    redraw();
});

var skeleton = new Image();
skeleton.src = "./images/spritesheetAstro.png";


function redraw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawPlanets();
    context.drawImage(skeleton, sx, sy, 45, 50, dx, dy, 45, 50);
    placeFlags();
    // otherSkeletons.forEach(function(e) {
    //     context.drawImage(skeleton, e.user.skeleton.sx, e.user.skeleton.sy, 45, 50, e.user.skeleton.dx, e.user.skeleton.dy, 45, 50);
    // })
}

function drawPlanets(){
    planets.forEach(planet => {
        context.drawImage(planet, planet.sx, planet.sy);
    });
}

function collisionCheck(){
    var healthBar = document.querySelector(".progress-bar");
    asteroids.forEach(asteroid =>{
        if((dx >= asteroid.sx)&&(dx <= (asteroid.sx + asteroid.width))&&( dy >= asteroid.sy)&&(dy <= (asteroid.sy + asteroid.height))){
            console.log("I've been hit ahhh");
            dx = 0;
            dy = 0;
            health -= 25;
            console.log(health);
            redraw();
        }
    });
    if (health <= 0) {
        health = 100;
        window.location.replace("gameover.html");
    }
    else if (health == 75){
        healthBar.style.width = "75%";
    }
    else if(health == 50){
        healthBar.style.width = "50%";
        healthBar.classList.remove("bg-success");
        healthBar.classList.add("bg-warning");
    }
    else if(health== 25){
      healthBar.style.width = "25%";
      healthBar.classList.remove("bg-warning");
      healthBar.classList.add("bg-danger");
    }
}

function flagPlanets(){
    planets.forEach(planet =>{
        if((dx >= planet.sx)&&(dx <= (planet.sx + planet.width))&&( dy >= planet.sy)&&(dy <= (planet.sy + planet.height))){
            console.log("I'm on a planet!");
            planet.flagged = true;
        }
    });
}

function placeFlags(){
    var flagcount = 0;
    planets.forEach(planet => {
        if(planet.flagged == true){
            context.drawImage(flag,planet.sx+(0.5*planet.width),planet.sy);
            flagcount++;
        }
    });
    if(planets.length === flagcount){
        window.location.replace("winner.html");
    }
}

function drawAsteroids(){
    redraw();
    asteroids.forEach(asteroid =>{
        context.drawImage(asteroid, asteroid.sx, asteroid.sy);
        asteroid.sx += 5;
        asteroid.sy += (1*plusOrMinus());
        if(asteroid.sx >= context.canvas.width){
            asteroid.sx = 0;
        }
        if(asteroid.sy >= context.canvas.height){
            asteroid.sx = 0;
        }
    });
    collisionCheck();
    placeFlags();
    setTimeout(drawAsteroids, 150);
    
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

    var skeleton = {
        sx: sx,
        sy: sy,
        dx: dx,
        dy: dy,
        health: health
    }
    flagPlanets();
    collisionCheck();
    window.firebase.database().ref('/' + u.uid + '/name').set(u.email);
    window.firebase.database().ref('/' + u.uid + '/skeleton').set(skeleton);
    // window.firebase.database().ref('/' + u.uid + 'planet');
    redraw();
    asteroids.forEach(asteroid =>{
        context.drawImage(asteroid, asteroid.sx, asteroid.sy);})

})

if(health>0){
    drawAsteroids();
}

redraw();

var registrationForm = document.querySelector("#register");
var loginForm = document.querySelector("#login");
var logoutForm = document.querySelector("#logout");


registrationForm.addEventListener("submit", function(e){
    var email = registrationForm.querySelector("#reg_email").value;
    var password = registrationForm.querySelector("#reg_password").value;
    window.firebase.auth()
        .createUserWithEmailAndPassword(email, password)
            .catch(function(error){
                console.log(error.message);
            });
    e.preventDefault();
});

loginForm.addEventListener("submit", function(e){
    var email = loginForm.querySelector("#log_email").value;
    var password = loginForm.querySelector("#log_password").value;
    window.firebase.auth()
        .signInWithEmailAndPassword(email, password)
            .catch(function(error){
                console.log(error.message);
            });
    e.preventDefault();
});

logoutForm.addEventListener("submit", function(e){
    window.firebase.auth().signOut();
    e.preventDefault();
});


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        registrationForm.style.display = "none";
        loginForm.style.display = "none";
        logoutForm.style.display = "block";

    } else {
        registrationForm.style.display = "block";
        loginForm.style.display = "block";
        logoutForm.style.display = "none";
    }
  });

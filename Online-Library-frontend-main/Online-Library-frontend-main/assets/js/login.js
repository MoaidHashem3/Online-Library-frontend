const form = document.querySelector("#loginForm");



form.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    const tryingToLogin_user = {email, password};

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const loggedUser = users.find((user) => user.email === tryingToLogin_user.email 
        && user.password === tryingToLogin_user.password);
    if (loggedUser) {
        alert('Logged in successfully!');
        localStorage.setItem("loggedInUser",JSON.stringify(tryingToLogin_user));
        window.location.href = 'ViewBooks.html';
    }else{
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.style.display = 'block';
    }

})
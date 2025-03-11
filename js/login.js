const loginMessage = document.createElement('p');
const loginForm = document.getElementById('login-form');
const errorMessage = document.createElement('p');
const registerForm = document.getElementById('register-form');
registerForm.appendChild(errorMessage);
loginForm.appendChild(loginMessage);
loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    checkUser();
});

function checkUser() {
    const userName = document.getElementById("username").value;
    const userPassword = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    const findUser = JSON.parse(localStorage.getItem(email));
    if (findUser) {
        if (findUser.userName === userName) {
            if (findUser.userPassword === userPassword) {
                localStorage.setItem('current user', JSON.stringify(findUser));
                window.location.href = "../html/games.html";
            } else {
                loginMessage.innerHTML = "שם המשתמש או הסיסמה שגויים";
            }
        } else {
            loginMessage.innerHTML = "שם המשתמש או הסיסמה שגויים";
        }
    } else {
        loginMessage.innerHTML = "אינך משתמש קיים";
    }
}


const btnRegister = document.getElementById("btnRegister");
btnRegister.addEventListener('click', (event) => {
    event.preventDefault();
    const formRegister = document.getElementById("formRegisterContainer");
    formRegister.style.display = "block";
    const formLogin = document.getElementById('formLoginContainer');
    formLogin.style.display = "none";
});

const register = document.getElementById("register-form");
register.addEventListener("submit", function (event) {
    event.preventDefault();
    validatePasswordMatch();
});

function validatePasswordMatch() {
    const password = document.getElementById("register-password").value;
    const passwordConfirm = document.getElementById("register-password-confirm").value;
    const errorPassword = document.getElementById("errorPassword");
    if (password !== passwordConfirm) {
        errorMessage.innerText = "הסיסמא שגויה"
    }
    else {
        addUser();
    }
}

function addUser() {
    const userName = document.getElementById('register-username').value;
    const userPassword = document.getElementById('register-password').value;
    const email = document.getElementById('register-email').value;
    const findUser = JSON.parse(localStorage.getItem(email));
    if (findUser) {
        errorMessage.innerHTML = 'האימייל כבר קיים במערכת';
    } else {
        const user = new User(userName, email, userPassword, 0)
        localStorage.setItem(email, JSON.stringify(user));
        localStorage.setItem('current user', JSON.stringify(user));
        window.location.href = "../html/games.html";
    }
}

let authUiFormModeIsRegister = true; 

async function handleRegistration() {
    const form = document.getElementById("signUpForm");
    if (!form) { console.error("Sign up form not found (ID: signUpForm)"); return; }

    const firstName = form.querySelector("#fname").value;
    const lastName = form.querySelector("#lname").value;
    const email = form.querySelector("#email").value;
    const password = form.querySelector("#psw").value;
    const passwordRepeat = form.querySelector("#pswrpt").value;
    const roleSelect = form.querySelector("#role_register");
    const role = roleSelect ? roleSelect.value : "job_seeker";

    if (password !== passwordRepeat) {
        alert("Passwords do not match!");
        return;
    }
    if (!firstName || !lastName || !email || !password || !role) {
        alert("Please fill in all required fields for registration.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: firstName,
                surname: lastName,
                email: email,
                password: password,
                role: role
            }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('accessToken', data.access_token);
            alert('Registration successful! Redirecting...');
            window.location.href = "index.html";
        } else {
            alert(`Registration failed: ${data.detail || response.statusText || 'Unknown server error'}`);
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred during registration. Check console for details.');
    }
}

async function handleLogin() {
    const form = document.getElementById("signInForm"); // Using ID from HTML
    if (!form) { console.error("Sign in form not found (ID: signInForm)"); return; }

    const email = form.querySelector("#email_sign_in").value;
    const password = form.querySelector("#psw_sign_in").value;

    if (!email || !password) {
        alert("Please enter email and password for login.");
        return;
    }

    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('accessToken', data.access_token);
            alert('Login Successful! Redirecting...');
            window.location.href = "index.html";
        } else {
            alert(`Login failed: ${data.detail || response.statusText || 'Unknown server error'}`);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login. Check console for details.');
    }
}

function validate() {
    if (authUiFormModeIsRegister) {
        handleRegistration();
    } else {
        handleLogin();
    }
}

function showSignUpFormUI() {
    const btnLoginTab = document.getElementById("login");
    const btnRegTab = document.getElementById("reg");
    const signInContainer = document.getElementById("sign_in");
    const signUpContainer = document.getElementById("sign_up");

    if (btnLoginTab) btnLoginTab.style.backgroundColor = "rgb(0, 100, 255)";
    if (btnRegTab) btnRegTab.style.backgroundColor = "rgb(0, 80, 180)";
    if (signInContainer) signInContainer.style.display = "none";
    if (signUpContainer) signUpContainer.style.display = "block";
    authUiFormModeIsRegister = true;
}

function showSignInFormUI() {
    const btnRegTab = document.getElementById("reg");
    const btnLoginTab = document.getElementById("login");
    const signInContainer = document.getElementById("sign_in");
    const signUpContainer = document.getElementById("sign_up");

    if (btnRegTab) btnRegTab.style.backgroundColor = "rgb(0, 100, 255)";
    if (btnLoginTab) btnLoginTab.style.backgroundColor = "rgb(0, 80, 180)";
    if (signInContainer) signInContainer.style.display = "block";
    if (signUpContainer) signUpContainer.style.display = "none";
    authUiFormModeIsRegister = false;
}

window.addEventListener('DOMContentLoaded', () => {
    const loginTabButtonWrapper = document.getElementById("loginbtn");
    const regTabButtonWrapper = document.getElementById("regbtn");

    if (loginTabButtonWrapper) loginTabButtonWrapper.querySelector('button')?.addEventListener("click", showSignInFormUI);
    if (regTabButtonWrapper) regTabButtonWrapper.querySelector('button')?.addEventListener("click", showSignUpFormUI);
    
    showSignInFormUI(); 
});
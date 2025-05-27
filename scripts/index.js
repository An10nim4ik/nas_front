document.addEventListener('DOMContentLoaded', () => {
    const yearElement = document.getElementById("year");
    if (yearElement) {
        let d = new Date();
        yearElement.innerHTML = "Copyright (c) " + d.getFullYear();
    }

    const logoutButton = document.getElementById('logoutButton');
    const profileLinkAnchor = document.querySelector('div.profile > a[href="profile.html"]');
    const getStartedButton = document.querySelector('a[href="auth.html"] > button.cta-button');
    const onAuthPage = window.location.pathname.includes('auth.html');

    if (typeof getAuthToken === 'function' && getAuthToken()) {
        if (logoutButton) logoutButton.style.display = 'inline-block';
        if (profileLinkAnchor) {
            profileLinkAnchor.style.display = 'inline-block';
            profileLinkAnchor.textContent = "Profile"; 
            profileLinkAnchor.href = "profile.html";
        }
        if (getStartedButton && (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html'))) {
            getStartedButton.style.display = 'none';
        }
    } else {
        if (logoutButton) logoutButton.style.display = 'none';
        if (profileLinkAnchor && !onAuthPage) {
            profileLinkAnchor.textContent = "Login/Register";
            profileLinkAnchor.href = "auth.html";
            profileLinkAnchor.style.display = 'inline-block';
        } else if (profileLinkAnchor && onAuthPage) {
            profileLinkAnchor.style.display = 'none';
        }
        if (getStartedButton && (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html'))) {
             getStartedButton.style.display = 'block'; 
        }
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('accessToken');
            alert('You have been logged out.');
            window.location.href = 'index.html';
        });
    }
});
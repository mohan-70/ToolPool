// Update UI based on Login State
auth.onAuthStateChanged(user => {
    const userInfo = document.getElementById('user-info');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');

    if (user) {
        if (userInfo) userInfo.textContent = `User: ${user.email}`;
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
    } else {
        if (userInfo) userInfo.textContent = '';
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
});

// Registration Logic
function register(email, password, name) {
    auth.createUserWithEmailAndPassword(email, password)
        .then(cred => {
            return db.collection("users").doc(cred.user.uid).set({
                name: name,
                trustScore: 0,
                email: email
            });
        })
        .then(() => {
            alert("Account created!");
            window.location.href = "index.html";
        })
        .catch(err => alert(err.message));
}

// Login Logic
function login(email, password) {
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            window.location.href = "index.html";
        })
        .catch(err => alert(err.message));
}

// Logout Logic
function logout() {
    auth.signOut().then(() => {
        alert("Logged out");
        window.location.reload();
    });
}
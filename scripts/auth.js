export function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('currentUser'));
    } catch (error) {
        return null;
    }
}

export function isAuthenticated() {
    return Boolean(getCurrentUser());
}

export function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'logIn.html';
}

export function checkAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'logIn.html';
        return null;
    }
    return user;
}
// data/profileData.js

export const users = [
    {
        id: "12345678", 
        username: "John",
        password: "123", 
        name: "John Smith",
        email: "john@example.com",
        phone: "514-000-0000",
        role: "Student",
        emergencyContact: "514-999-9999",
        accessibility: "none" 
    }
];

// Login status
export let isLoggedIn = false;

// Current User
export let currentUser = null;
// =====================================
// TravelGo Login
// =====================================

const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("loginMessage");

loginForm.addEventListener("submit", login);

async function login(e) {

    e.preventDefault();

    const username = document
        .getElementById("username")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value
        .trim();

    if (username === "" || password === "") {

        showMessage("Please enter username and password.", "red");

        return;

    }

    loginBtn.disabled = true;

    loginBtn.innerHTML = "Logging in...";

    try {

        const response = await fetch("/api/login", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                username,

                password

            })

        });

        const data = await response.json();

        if (response.ok && data.success) {

            showMessage("✅ Login Successful", "green");

            showToast("Welcome Administrator");

            setTimeout(() => {

                window.location.href = "/dashboard";

            }, 1200);

        }

        else {

            showMessage(

                data.message || "Invalid Username or Password",

                "red"

            );

        }

    }

    catch (error) {

        console.error(error);

        showMessage("Server Error. Please try again.", "red");

    }

    finally {

        loginBtn.disabled = false;

        loginBtn.innerHTML = "Login";

    }

}

// =====================================
// Message
// =====================================

function showMessage(text, color) {

    message.style.color = color;

    message.innerHTML = text;

}

// =====================================
// Toast Notification
// =====================================

function showToast(text) {

    let toast = document.getElementById("toast");

    if (!toast) return;

    toast.innerHTML = text;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}

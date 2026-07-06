const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const username = document.getElementById("username").value.trim();

    const password = document.getElementById("password").value.trim();

    const message = document.getElementById("loginMessage");

    if (!username || !password) {

        message.style.color = "red";
        message.innerHTML = "Please enter username and password.";

        return;

    }

    try {

        const response = await fetch("/login", {

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

        if (data.success) {

            message.style.color = "green";
            message.innerHTML = "✅ Login Successful...";

            setTimeout(() => {

                window.location.href = "/dashboard";

            }, 1000);

        }

        else {

            message.style.color = "red";
            message.innerHTML = data.message;

        }

    }

    catch (err) {

        message.style.color = "red";
        message.innerHTML = "Server Error.";

        console.error(err);

    }

});

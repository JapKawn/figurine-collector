
    function checkPassword() {
        const pass = document.getElementById("password").value;
        const correct = "HamburgerSauvage2727";

        if (pass === correct) {
            sessionStorage.setItem("auth", "ok");
            window.location.href = "index.php";
        } else {
            alert("Mot de passe incorrect.");
        }
    }
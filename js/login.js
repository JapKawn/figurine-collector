function checkPassword() {
    const pass = document.getElementById("password").value;
    const correct = "HamburgerSauvage2727"; // ⚠️ Ne pas utiliser ça en production !

    if (pass === correct) {
        sessionStorage.setItem("auth", "ok");
        window.location.href = "index.html";
    } else {
        alert("Mot de passe incorrect.");
    }
}

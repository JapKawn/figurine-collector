<?php
session_start();


// Si déjà connecté, redirection
if (!empty($_SESSION["auth"])) {
    header("Location: index.php");
    exit;
}

// Mot de passe haché (remplace-le par celui généré à l’étape 1)
$hashedPassword = '$2y$10$hqEZINt2i9mmpu/xg5N9.uIpaTHQZT9fSFvqbQjgPXjXMeRUV163y';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $pass = $_POST["password"];

    if (password_verify($pass, $hashedPassword)) {
        $_SESSION["auth"] = "ok";
        header("Location: index.php");
        exit;
    } else {
        $error = "Mot de passe incorrect.";
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Connexion</title>
    <link rel="stylesheet" href="css/login.css" />
</head>
<body>
<div class="login-box">
    <h2>Connexion</h2>
    <?php if (!empty($error)) echo "<p style='color:red;'>$error</p>"; ?>
    <form method="post">
        <input type="password" name="password" placeholder="Mot de passe" required>
        <button type="submit">Se connecter</button>
    </form>
</div>
</body>
</html>


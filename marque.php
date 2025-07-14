<?php
require_once "php/auth.php";

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    header("Location: index.php");
    exit;
}

$marqueId = intval($_GET['id']);
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Figurine Collector - Marque</title>
    <link rel="stylesheet" href="css/marque.css" />
</head>
<body data-marque-id="<?= $marqueId ?>">
<header>
    <h1 id="titreMarque">Figurines</h1>
    <div class="header-controls">
        <button id="btnAccueil" class="btn">Accueil</button>
        <input type="search" id="searchFigurines" placeholder="🔍 Rechercher une figurine..." />
        <button id="toggleForm" class="btn">Ajouter une Figurine</button>
        <form method="post" action="php/logout.php" style="display: inline;">
            <button type="submit" class="btn btn-danger">Déconnexion</button>
        </form>
    </div>
</header>

<section id="figurineFormSection" class="hidden">
    <form id="figurineForm" enctype="multipart/form-data">
        <input type="text" id="nom" name="nom" placeholder="Nom de la figurine" required />
        <input type="file" id="image" name="image" accept=".png, .jpg, .jpeg" required />
        <button type="submit" class="btn" id="btnAjouterFigurine">Ajouter</button>
    </form>
</section>

<main>
    <div id="figurinesContainer" class="figurines-container"></div>
</main>

<!-- 1. SDK Supabase -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>

<!-- 2. Ton fichier de config -->
<script src="js/supabaseClient.js"></script>

<script>
    // Récupérer l'id de la marque depuis l'attribut data du body
    const marqueId = parseInt(document.body.getAttribute('data-marque-id'), 10);

    // Bouton accueil : redirige vers index.php
    document.getElementById('btnAccueil').addEventListener('click', () => {
        window.location.href = 'index.php';
    });
</script>

<!-- 3. Ton script principal -->
<script src="js/marque.js" type="module" defer></script>
</body>
</html>

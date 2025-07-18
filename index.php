<?php require_once "php/auth.php"; ?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Figurine Collector</title>
    <link rel="stylesheet" href="css/index.css" />
</head>
<body>
<header>
    <h1>Figurine Collector</h1>

    <div class="header-actions">
        <button id="deleteModeBtn" class="btn btn-danger">🗑️ Retirer une Marque</button>
        <input type="text" id="searchInput" placeholder="🔍 Rechercher une marque..." />
        <button id="toggleForm" class="btn">➕ Ajouter une Marque</button>
        <form method="post" action="php/logout.php" style="display: inline;">
            <button type="submit" class="btn btn-danger">Déconnexion</button>
        </form>
    </div>
</header>

<section id="marqueFormSection" class="hidden form-container">
    <form id="marqueForm">
        <input type="text" id="nomMarque" placeholder="Nom de la marque" required />
        <button type="submit" class="btn">Ajouter</button>
    </form>
</section>

<p id="searchMessage" class="search-message hidden">Aucune marque trouvée.</p>

<main>
    <div id="marquesContainer" class="marques-container"></div>
</main>

<!-- 1. SDK Supabase -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>

<!-- 2. Ton fichier de config -->
<script src="js/supabaseClient.js"></script>

<!-- 3. Ton script principal -->
<script src="js/index.js" type="module" defer></script>


</body>
</html>

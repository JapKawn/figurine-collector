import { supabase } from './supabaseClient.js';

let deleteMode = false;

// Sélecteurs DOM
const marqueFormSection = document.getElementById("marqueFormSection");
const toggleFormBtn = document.getElementById("toggleForm");
const searchInput = document.getElementById("searchInput");
const searchMessage = document.getElementById("searchMessage");
const marquesContainer = document.getElementById("marquesContainer");
const marqueForm = document.getElementById("marqueForm");
const deleteModeBtn = document.getElementById("deleteModeBtn");

// Bouton pour afficher / cacher le formulaire
toggleFormBtn.addEventListener("click", () => {
    marqueFormSection.classList.toggle("hidden");
    toggleFormBtn.textContent = marqueFormSection.classList.contains("hidden")
        ? "➕ Ajouter une Marque"
        : "❌ Fermer";
});

// Bouton de bascule du mode suppression
deleteModeBtn.addEventListener("click", () => {
    deleteMode = !deleteMode;
    deleteModeBtn.textContent = deleteMode
        ? "❌ Fermer"
        : "🗑️ Retirer une Marque";
    renderMarques(searchInput.value);
});

// Soumission du formulaire d'ajout
marqueForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nom = document.getElementById("nomMarque").value.trim();
    if (!nom) return;

    const { error } = await supabase.from("marques").insert([{ nom }]);
    if (error) {
        alert("Erreur lors de l'ajout : " + error.message);
        return;
    }

    marqueForm.reset();
    marqueFormSection.classList.add("hidden");
    toggleFormBtn.textContent = "➕ Ajouter une Marque";
    await renderMarques();
});

// Barre de recherche dynamique
searchInput.addEventListener("input", () => {
    renderMarques(searchInput.value);
});

// Fonction pour afficher les marques
async function renderMarques(filterText = "") {
    const { data, error } = await supabase
        .from("marques")
        .select("*")
        .order("nom", { ascending: true });

    if (error) {
        console.error("Erreur chargement des marques :", error.message);
        return;
    }

    // Filtrage
    const filtered = data.filter(marque =>
        marque.nom.toLowerCase().includes(filterText.toLowerCase())
    );

    // Message "aucune marque trouvée"
    searchMessage.classList.toggle("hidden", filtered.length > 0);
    marquesContainer.innerHTML = "";

    // Affichage
    filtered.forEach(marque => {
        const btn = document.createElement("button");
        btn.className = "btn marque-btn";
        if (deleteMode) btn.classList.add("delete-mode");

        btn.textContent = marque.nom;

        btn.addEventListener("click", async () => {
            if (deleteMode) {
                const confirmation = confirm(`Supprimer la marque "${marque.nom}" ?`);
                if (confirmation) {
                    await supabase.from("figurines").delete().eq("marque_id", marque.id);
                    await supabase.from("marques").delete().eq("id", marque.id);
                    await renderMarques(searchInput.value); // recharge après suppression
                }
            } else {
                window.location.href = `marque.html?id=${marque.id}`;
            }
        });

        marquesContainer.appendChild(btn);
    });
}

// Initialisation
renderMarques();

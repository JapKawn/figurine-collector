import { supabase } from "./supabaseClient.js";

// === VARIABLES ===
const marquesContainer = document.getElementById("marquesContainer");
const formSection = document.getElementById("marqueFormSection");
const toggleFormBtn = document.getElementById("toggleForm");
const marqueForm = document.getElementById("marqueForm");
const searchInput = document.getElementById("searchInput");
const searchMessage = document.getElementById("searchMessage");
const deleteModeBtn = document.getElementById("deleteModeBtn");

let marques = [];
let deleteMode = false;
let filterText = "";

// === TOGGLE FORMULAIRE ===
toggleFormBtn.addEventListener("click", () => {
    const isVisible = !formSection.classList.contains("hidden");
    formSection.classList.toggle("hidden");
    toggleFormBtn.textContent = isVisible ? "➕ Ajouter une Marque" : "✖ Fermer";
});

// === MODE SUPPRESSION ===
deleteModeBtn.addEventListener("click", () => {
    deleteMode = !deleteMode;
    deleteModeBtn.textContent = deleteMode ? "❌ Annuler le Retrait" : "🗑️ Retirer une Marque";
    renderMarques(filterText); // Re-render with correct mode
});

// === RECHERCHE ===
searchInput.addEventListener("input", () => {
    filterText = searchInput.value.toLowerCase().trim();
    renderMarques(filterText);
});

// === AJOUT DE MARQUE ===
marqueForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nom = document.getElementById("nomMarque").value.trim();

    if (!nom) return;

    const { error } = await supabase.from("marques").insert({ nom });

    if (!error) {
        document.getElementById("nomMarque").value = "";
        formSection.classList.add("hidden");
        loadMarques();
    } else {
        alert("Erreur lors de l'ajout");
    }
});

// === CHARGER MARQUES ===
async function loadMarques() {
    const { data, error } = await supabase.from("marques").select("*").order("nom", { ascending: true });
    if (!error) {
        marques = data;
        renderMarques(filterText);
    }
}

// === AFFICHER MARQUES ===
function renderMarques(searchTerm = "") {
    marquesContainer.innerHTML = "";
    const filtered = marques.filter((m) => m.nom.toLowerCase().includes(searchTerm));

    if (filtered.length === 0) {
        searchMessage.classList.remove("hidden");
    } else {
        searchMessage.classList.add("hidden");
    }

    filtered.forEach((marque) => {
        const btn = document.createElement("button");
        btn.className = "btn";
        btn.textContent = marque.nom;

        if (deleteMode) {
            btn.classList.add("btn-danger");
            btn.addEventListener("click", async () => {
                if (confirm(`Supprimer la marque "${marque.nom}" ?`)) {
                    await supabase.from("figurines").delete().eq("marque_id", marque.id); // clean figurines
                    await supabase.from("marques").delete().eq("id", marque.id);
                    loadMarques();
                }
            });
        } else {
            btn.addEventListener("click", () => {
                // Redirection seulement si non en mode suppression
                window.location.href = `marque.php?id=${marque.id}`;
            });
        }

        marquesContainer.appendChild(btn);
    });
}

// === LANCEMENT ===
loadMarques();

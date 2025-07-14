import { supabase } from './supabaseClient.js';

let deleteMode = false;

// DOM
const marqueFormSection = document.getElementById("marqueFormSection");
const toggleFormBtn = document.getElementById("toggleForm");
const searchMessage = document.getElementById("searchMessage");
const searchInput = document.getElementById("searchInput");
const marquesContainer = document.getElementById("marquesContainer");
const marqueForm = document.getElementById("marqueForm");
const deleteModeBtn = document.getElementById("deleteModeBtn");

// Form toggle
toggleFormBtn.addEventListener("click", () => {
    marqueFormSection.classList.toggle("hidden");
    toggleFormBtn.textContent = marqueFormSection.classList.contains("hidden") ? "➕ Ajouter une Marque" : "❌ Fermer";
});

// Delete mode toggle
deleteModeBtn.addEventListener("click", () => {
    deleteMode = !deleteMode;
    deleteModeBtn.textContent = deleteMode ? "❌ Fermer" : "🗑️ Retirer une Marque";
    renderMarques(searchInput.value);
});

// Ajouter une marque
marqueForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nom = document.getElementById("nomMarque").value.trim();
    if (!nom) return;

    const { error } = await supabase.from('marques').insert([{ nom }]);
    if (error) return alert("Erreur : " + error.message);

    marqueForm.reset();
    marqueFormSection.classList.add("hidden");
    renderMarques();
});

// Afficher les marques
async function renderMarques(filterText = "") {
    const { data, error } = await supabase.from('marques').select('*').order('nom', { ascending: true });
    if (error) {
        console.error(error);
        return;
    }

    const marques = filterText
        ? data.filter((m) => m.nom.toLowerCase().includes(filterText.toLowerCase()))
        : data;

    searchMessage.classList.toggle("hidden", marques.length > 0);
    marquesContainer.innerHTML = "";

    marques.forEach((marque) => {
        const btn = document.createElement("button");
        btn.className = "btn marque-btn";
        if (deleteMode) btn.classList.add("delete-mode");

        btn.textContent = marque.nom;

        if (deleteMode) {
            btn.addEventListener("click", async () => {
                if (confirm(`Supprimer la marque "${marque.nom}" ?`)) {
                    await supabase.from('marques').delete().eq('id', marque.id);
                    await supabase.from('figurines').delete().eq('marque_id', marque.id); // clean figs
                    renderMarques(filterText);
                }
            });
        } else {
            btn.addEventListener("click", () => {
                window.location.href = `marque.html?id=${marque.id}`;
            });
        }

        marquesContainer.appendChild(btn);
    });
}

// Init
renderMarques();

import { supabase } from './supabaseClient.js';

const urlParams = new URLSearchParams(window.location.search);
const marqueId = urlParams.get("id");

// DOM Elements
const titreMarque = document.getElementById("titreMarque");
const searchInput = document.getElementById("searchFigurines");
const formSection = document.getElementById("figurineFormSection");
const toggleForm = document.getElementById("toggleForm");
const form = document.getElementById("figurineForm");
const container = document.getElementById("figurinesContainer");

let allFigurines = []; // toutes les figurines de la marque

toggleForm.addEventListener("click", () => {
    formSection.classList.toggle("hidden");
    toggleForm.textContent = formSection.classList.contains("hidden")
        ? "Ajouter une Figurine"
        : "❌ Fermer le formulaire";
});

// Ajouter une figurine
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nom = document.getElementById("nom").value.trim();
    const image = document.getElementById("image").files[0];

    if (!nom || !image) return alert("Nom et image requis.");

    const filePath = `figurines/${Date.now()}-${image.name}`;

    const { error: uploadError } = await supabase
        .storage
        .from("figurines")
        .upload(filePath, image);

    if (uploadError) {
        alert("Erreur upload : " + uploadError.message);
        return;
    }

    const { error: insertError } = await supabase
        .from("figurines")
        .insert([{ nom, image_url: filePath, marque_id: marqueId }]);

    if (insertError) {
        alert("Erreur insertion : " + insertError.message);
        return;
    }

    form.reset();
    formSection.classList.add("hidden");
    toggleForm.textContent = "Ajouter une Figurine";
    await fetchFigurines();
    renderFigurines();
});

// Recherche
searchInput.addEventListener("input", () => {
    const searchText = searchInput.value.toLowerCase();
    const filtered = allFigurines.filter(f =>
        f.nom.toLowerCase().includes(searchText)
    );
    renderFigurines(filtered);
});

// Récupère les figurines liées à la marque
async function fetchFigurines() {
    const { data, error } = await supabase
        .from("figurines")
        .select("*")
        .eq("marque_id", marqueId);

    if (error) {
        console.error("Erreur récupération figurines :", error.message);
        return;
    }

    allFigurines = data;
}

// Affiche les figurines dans la page
function renderFigurines(list = allFigurines) {
    container.innerHTML = "";

    list.forEach(fig => {
        const { publicUrl } = supabase
            .storage
            .from("figurines")
            .getPublicUrl(fig.image_url).data;

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${publicUrl}" alt="${fig.nom}" />
            <h3>${fig.nom}</h3>
            <button class="btn btn-danger delete-btn">X</button>
        `;

        const deleteBtn = card.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", async () => {
            const confirmDelete = confirm(`Supprimer la figurine "${fig.nom}" ?`);
            if (!confirmDelete) return;

            // Supprime l'entrée de la BDD
            await supabase.from("figurines").delete().eq("id", fig.id);

            // Supprime l'image du storage (optionnel mais propre)
            await supabase.storage.from("figurines").remove([fig.image_url]);

            await fetchFigurines();
            renderFigurines();
        });

        container.appendChild(card);
    });
}

// Récupère le nom de la marque
async function fetchMarqueName() {
    const { data, error } = await supabase
        .from("marques")
        .select("nom")
        .eq("id", marqueId)
        .single();

    if (!error && data) {
        titreMarque.textContent = data.nom;
    }
}

// Initialisation
await fetchMarqueName();
await fetchFigurines();
renderFigurines();import { supabase } from './supabaseClient.js';

const urlParams = new URLSearchParams(window.location.search);
const marqueId = urlParams.get("id");

// DOM Elements
const titreMarque = document.getElementById("titreMarque");
const searchInput = document.getElementById("searchFigurines");
const formSection = document.getElementById("figurineFormSection");
const toggleForm = document.getElementById("toggleForm");
const form = document.getElementById("figurineForm");
const container = document.getElementById("figurinesContainer");

let allFigurines = []; // toutes les figurines de la marque

toggleForm.addEventListener("click", () => {
    formSection.classList.toggle("hidden");
    toggleForm.textContent = formSection.classList.contains("hidden")
        ? "Ajouter une Figurine"
        : "❌ Fermer le formulaire";
});

// Ajouter une figurine
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nom = document.getElementById("nom").value.trim();
    const image = document.getElementById("image").files[0];

    if (!nom || !image) return alert("Nom et image requis.");

    const filePath = `figurines/${Date.now()}-${image.name}`;

    const { error: uploadError } = await supabase
        .storage
        .from("figurines")
        .upload(filePath, image);

    if (uploadError) {
        alert("Erreur upload : " + uploadError.message);
        return;
    }

    const { error: insertError } = await supabase
        .from("figurines")
        .insert([{ nom, image_url: filePath, marque_id: marqueId }]);

    if (insertError) {
        alert("Erreur insertion : " + insertError.message);
        return;
    }

    form.reset();
    formSection.classList.add("hidden");
    toggleForm.textContent = "Ajouter une Figurine";
    await fetchFigurines();
    renderFigurines();
});

// Recherche
searchInput.addEventListener("input", () => {
    const searchText = searchInput.value.toLowerCase();
    const filtered = allFigurines.filter(f =>
        f.nom.toLowerCase().includes(searchText)
    );
    renderFigurines(filtered);
});

// Récupère les figurines liées à la marque
async function fetchFigurines() {
    const { data, error } = await supabase
        .from("figurines")
        .select("*")
        .eq("marque_id", marqueId);

    if (error) {
        console.error("Erreur récupération figurines :", error.message);
        return;
    }

    allFigurines = data;
}

// Affiche les figurines dans la page
function renderFigurines(list = allFigurines) {
    container.innerHTML = "";

    list.forEach(fig => {
        const { publicUrl } = supabase
            .storage
            .from("figurines")
            .getPublicUrl(fig.image_url).data;

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${publicUrl}" alt="${fig.nom}" />
            <h3>${fig.nom}</h3>
            <button class="btn btn-danger delete-btn">X</button>
        `;

        const deleteBtn = card.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", async () => {
            const confirmDelete = confirm(`Supprimer la figurine "${fig.nom}" ?`);
            if (!confirmDelete) return;

            // Supprime l'entrée de la BDD
            await supabase.from("figurines").delete().eq("id", fig.id);

            // Supprime l'image du storage (optionnel mais propre)
            await supabase.storage.from("figurines").remove([fig.image_url]);

            await fetchFigurines();
            renderFigurines();
        });

        container.appendChild(card);
    });
}

// Récupère le nom de la marque
async function fetchMarqueName() {
    const { data, error } = await supabase
        .from("marques")
        .select("nom")
        .eq("id", marqueId)
        .single();

    if (!error && data) {
        titreMarque.textContent = data.nom;
    }
}

// Initialisation
await fetchMarqueName();
await fetchFigurines();
renderFigurines();

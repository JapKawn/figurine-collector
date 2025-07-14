import { supabase } from './supabaseClient.js';

const params = new URLSearchParams(window.location.search);
const marqueId = parseInt(params.get("id"));

// Retour à l'accueil
document.getElementById("btnAccueil").addEventListener("click", () => {
    window.location.href = "index.html";
});

// Toggle formulaire
document.getElementById("toggleForm").addEventListener("click", () => {
    const section = document.getElementById("figurineFormSection");
    section.classList.toggle("hidden");

    const btn = document.getElementById("toggleForm");
    btn.textContent = section.classList.contains("hidden") ? "Ajouter une figurine" : "Fermer";
});

// Resize et compression image
function resizeImage(file, maxWidth, maxHeight, maxSizeKB) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => (img.src = e.target.result);
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            let { width, height } = img;

            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }
            if (height > maxHeight) {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            const resizedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
            const imageSizeKB = resizedDataUrl.length * 3 / 4 / 1024;

            if (imageSizeKB > maxSizeKB) {
                reject(new Error("L'image est trop lourde après compression."));
            } else {
                resolve(resizedDataUrl);
            }
        };

        img.onerror = () => reject(new Error("Erreur chargement image"));
        reader.onerror = () => reject(new Error("Erreur lecture fichier"));
        reader.readAsDataURL(file);
    });
}

// Soumission formulaire
document.getElementById("figurineForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nom = document.getElementById("nom").value.trim();
    const imageInput = document.getElementById("image");
    const imageFile = imageInput.files[0];

    if (!nom || !imageFile) {
        alert("Merci de remplir tous les champs.");
        return;
    }

    if (!["image/png", "image/jpeg", "image/jpg"].includes(imageFile.type)) {
        alert("Seuls les fichiers PNG et JPG sont acceptés.");
        return;
    }

    // Redimensionne l'image
    let resizedDataUrl;
    try {
        resizedDataUrl = await resizeImage(imageFile, 400, 400, 200);
    } catch (err) {
        alert(err.message);
        return;
    }

    // Convertir base64 → blob pour upload
    const base64 = resizedDataUrl.split(',')[1];
    const blob = await fetch(resizedDataUrl).then(res => res.blob());

    const fileName = `${Date.now()}-${nom.replace(/\s+/g, "_")}.jpg`;

    // Upload dans Supabase Storage
    const { error: uploadError } = await supabase.storage
        .from('figurines')
        .upload(fileName, blob, {
            contentType: 'image/jpeg',
            upsert: true
        });

    if (uploadError) {
        alert("Erreur upload image : " + uploadError.message);
        return;
    }

    // URL publique
    const { data: publicUrlData } = supabase.storage
        .from('figurines')
        .getPublicUrl(fileName);
    const imageUrl = publicUrlData.publicUrl;

    // Enregistre la figurine en BDD
    const { error } = await supabase.from('figurines').insert([
        { nom, image_url: imageUrl, marque_id: marqueId }
    ]);

    if (error) {
        alert("Erreur ajout figurine : " + error.message);
        return;
    }

    e.target.reset();
    renderFigurines();
});

// Affiche les figurines d'une marque
async function renderFigurines(filter = "") {
    const container = document.getElementById("figurinesContainer");
    container.innerHTML = "";

    const { data, error } = await supabase
        .from('figurines')
        .select('*')
        .eq('marque_id', marqueId)
        .order('id', { ascending: false });

    if (error) {
        container.innerHTML = "<p>Erreur lors du chargement.</p>";
        return;
    }

    const filtered = data.filter(fig =>
        fig.nom.toLowerCase().includes(filter.toLowerCase())
    );

    if (filtered.length === 0) {
        container.innerHTML = "<p>Aucune figurine pour cette marque.</p>";
        return;
    }

    filtered.forEach((fig) => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${fig.image_url}" alt="${fig.nom}" />
            <div class="card-info">
                <h3>${fig.nom}</h3>
                <button class="btn btn-danger btn-delete-figurine" data-id="${fig.id}">X</button>
            </div>
        `;
        container.appendChild(card);
    });

    // Bouton suppression
    document.querySelectorAll(".btn-delete-figurine").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            const id = parseInt(e.target.dataset.id);

            if (!confirm("Supprimer cette figurine ?")) return;

            const { error } = await supabase.from('figurines').delete().eq('id', id);
            if (error) alert("Erreur suppression : " + error.message);
            renderFigurines(document.getElementById("searchFigurines").value);
        });
    });
}

// Recherche en live
document.getElementById("searchFigurines").addEventListener("input", (e) => {
    renderFigurines(e.target.value);
});

// Chargement initial
renderFigurines();

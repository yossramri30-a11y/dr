const rights = window.DROITO_RIGHTS || [];
const sourceCatalog = window.DROITO_SOURCES || [];

const rightsPreviewGrid = document.querySelector("#rights-preview-grid");
const sourcesList = document.querySelector("#sources-list");

function uniqueSources(items) {
  const seen = new Set();

  return items.filter((item) => {
    if (seen.has(item.url)) {
      return false;
    }

    seen.add(item.url);
    return true;
  });
}

function formatTag(tag) {
  const labels = {
    all: "Tout",
    brand: "Marque",
    contract: "Contrat",
    copyright: "Droit d'auteur",
    dispute: "Litige",
    employee: "Salarié",
    freelance: "Freelance",
    product: "Produit",
    social: "CNSS"
  };

  return labels[tag] || tag;
}

function renderRightsPreview() {
  if (!rightsPreviewGrid) {
    return;
  }

  const featured = rights.filter((item) => item.featured).slice(0, 3);
  const cards = featured.map(
    (item, index) => `
      <a class="rights-preview-card rights-preview-card-${index + 1}" href="droits.html#${item.id}" style="animation-delay: ${index * 60}ms">
        <div class="rights-preview-photo">
          <img src="${item.image}" alt="${item.imageAlt}" loading="lazy" />
        </div>
        <div class="rights-preview-caption">
          <span>${formatTag(item.tags[0])}</span>
          <strong>${item.title}</strong>
        </div>
      </a>
    `
  );

  rightsPreviewGrid.innerHTML = [
    cards[0] || "",
    `
      <a class="rights-preview-cta-card" href="droits.html">
        <span>VOIR</span>
        <span>TOUS</span>
        <span>LES DROITS</span>
      </a>
    `,
    cards[1] || "",
    cards[2] || ""
  ].join("");
}

function renderSources() {
  if (!sourcesList) {
    return;
  }

  const items = uniqueSources(sourceCatalog);

  sourcesList.innerHTML = items
    .map(
      (item) => `
        <li>
          <strong>${item.title}</strong><br />
          <span class="source-note">${item.note}</span><br />
          <a href="${item.url}" target="_blank" rel="noreferrer">${item.url}</a>
        </li>
      `
    )
    .join("");
}

renderRightsPreview();
renderSources();

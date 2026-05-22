const rights = window.DROITO_RIGHTS || [];
const sourceCatalog = window.DROITO_SOURCES || [];

const rightsGrid = document.querySelector("#rights-grid");
const searchInput = document.querySelector("#search");
const filterButtons = document.querySelectorAll(".filter-chip");
const emptyState = document.querySelector("#empty-state");
const sourcesList = document.querySelector("#sources-list");

let activeFilter = "all";
let isFirstRender = true;

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

function setActiveFilter(nextFilter) {
  activeFilter = nextFilter;

  filterButtons.forEach((chip) => {
    chip.classList.toggle("is-active", chip.dataset.filter === nextFilter);
  });
}

function renderRights() {
  if (!rightsGrid || !searchInput) {
    return;
  }

  const query = searchInput.value.trim().toLowerCase();

  const filtered = rights.filter((item) => {
    const matchesFilter = activeFilter === "all" || item.tags.includes(activeFilter);
    if (!matchesFilter) {
      return false;
    }

    if (!query) {
      return true;
    }

    const haystack = [
      item.title,
      item.summary,
      item.law,
      item.action,
      item.tags.join(" "),
      item.points.join(" ")
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });

  rightsGrid.innerHTML = filtered
    .map(
      (item, index) => `
        <article class="right-card right-card-detailed" id="${item.id}" style="animation-delay: ${index * 40}ms">
          <div class="right-card-media">
            <img class="right-card-image" src="${item.image}" alt="${item.imageAlt}" loading="lazy" />
          </div>

          <div class="card-top">
            <div>
              <h3>${item.title}</h3>
            </div>
            <div class="tag-list">
              ${item.tags
                .map((tag) => `<span class="tag">${formatTag(tag)}</span>`)
                .join("")}
            </div>
          </div>

          <p>${item.summary}</p>

          <section class="detail-group">
            <strong>Ce que cela change pour vous</strong>
            <ul class="detail-list">
              ${item.points.map((point) => `<li>${point}</li>`).join("")}
            </ul>
          </section>

          <section class="detail-group">
            <strong>Bon réflexe</strong>
            <p>${item.action}</p>
          </section>

          <footer class="card-footer">
            <span class="law-label">${item.law}</span>
            <div class="source-links">
              ${item.sources
                .map(
                  (source) =>
                    `<a href="${source.url}" target="_blank" rel="noreferrer">${source.label}</a>`
                )
                .join("")}
            </div>
          </footer>
        </article>
      `
    )
    .join("");

  if (emptyState) {
    emptyState.hidden = filtered.length !== 0;
  }

  highlightHashCard(isFirstRender && Boolean(window.location.hash));
  isFirstRender = false;
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

function highlightHashCard(shouldScroll) {
  const nextId = decodeURIComponent(window.location.hash.replace(/^#/, ""));

  document.querySelectorAll(".right-card.is-targeted").forEach((card) => {
    card.classList.remove("is-targeted");
  });

  if (!nextId) {
    return;
  }

  const targetCard = document.getElementById(nextId);
  if (!targetCard) {
    return;
  }

  targetCard.classList.add("is-targeted");

  if (shouldScroll) {
    targetCard.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveFilter(button.dataset.filter || "all");
    renderRights();
  });
});

searchInput?.addEventListener("input", renderRights);

document.addEventListener("click", (event) => {
  const resetButton = event.target.closest("[data-reset-search]");
  if (!resetButton || !searchInput) {
    return;
  }

  searchInput.value = "";
  setActiveFilter("all");
  renderRights();
});

window.addEventListener("hashchange", () => {
  highlightHashCard(true);
});

renderRights();
renderSources();

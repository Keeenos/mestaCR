// Inicializace mapy – střed ČR
const mapa = L.map("mapa").setView([49.8, 15.5], 7);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; přispěvatelé <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>"
}).addTo(mapa);

// Ochrana proti vložení HTML z dat do popupu
function escapeHtml(text) {
  const el = document.createElement("div");
  el.textContent = text;
  return el.innerHTML;
}

function zobrazChybu(zprava) {
  const el = document.createElement("div");
  el.className = "chyba";
  el.textContent = zprava;
  document.body.appendChild(el);
}

// Načtení bodů z GeoJSONu
fetch("body.geojson")
  .then((odpoved) => {
    if (!odpoved.ok) throw new Error("HTTP " + odpoved.status);
    return odpoved.json();
  })
  .then((data) => {
    const vrstva = L.geoJSON(data, {
      onEachFeature: (feature, layer) => {
        const { nazev, popisek } = feature.properties;
        layer.bindPopup(
          `<div class="popup"><h2>${escapeHtml(nazev)}</h2><p>${escapeHtml(popisek)}</p></div>`
        );
        layer.bindTooltip(nazev);
      }
    }).addTo(mapa);

    mapa.fitBounds(vrstva.getBounds(), { padding: [60, 60] });
  })
  .catch((chyba) => {
    console.error(chyba);
    zobrazChybu(
      "Nepodařilo se načíst body.geojson. Spusťte stránku přes lokální server (viz readme), ne přímo ze souboru."
    );
  });

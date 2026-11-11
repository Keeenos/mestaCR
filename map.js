// Inicializace mapy – střed ČR
const mapa = L.map("mapa").setView([49.8, 15.5], 7);

// Podkladová vrstva: OpenTopoMap (turistická / terénní)
L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
  maxZoom: 17,
  subdomains: "abc",
  attribution:
    'Data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, ' +
    'SRTM | Styl: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> ' +
    '(<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(mapa);

// Další možnosti (nahraďte blok výše):
//
// Světlá minimalistická (CARTO Positron):
// L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
//   maxZoom: 20,
//   subdomains: "abcd",
//   attribution: '&copy; OpenStreetMap, &copy; <a href="https://carto.com/attributions">CARTO</a>'
// }).addTo(mapa);
//
// Tmavá (CARTO Dark Matter):
// L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
//   maxZoom: 20,
//   subdomains: "abcd",
//   attribution: '&copy; OpenStreetMap, &copy; <a href="https://carto.com/attributions">CARTO</a>'
// }).addTo(mapa);

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
# Mapa měst ČR (Leaflet)

Jednoduchá webová mapa s městy v ČR. Body se načítají ze souboru GeoJSON.

## Struktura

| Soubor          | Účel                                             |
|-----------------|--------------------------------------------------|
| `index.html`    | Stránka, načítá Leaflet, styly a skript          |
| `map.js`        | Inicializace mapy, načtení a vykreslení bodů     |
| `styl.css`      | Vzhled stránky a popupů                          |
| `body.geojson`  | Data měst (`id`, `nazev`, `popisek`)             |
| `readme.md`     | Tento návod                                      |

## Spuštění

Prohlížeče blokují `fetch` ze souboru otevřeného přes `file://`, proto je potřeba lokální server:

```bash
cd mapa-cr
python -m http.server 8000
```

Poté otevřete <http://localhost:8000>.

Leaflet i dlaždice OpenStreetMap se načítají z internetu.

## Přidání dalšího města

V `body.geojson` přidejte do pole `features` další objekt. Pozor: GeoJSON používá pořadí souřadnic **[délka, šířka]** (lon, lat).

```json
{
  "type": "Feature",
  "properties": {
    "id": 3,
    "nazev": "Brno",
    "popisek": "Druhé největší město ČR."
  },
  "geometry": { "type": "Point", "coordinates": [16.6068, 49.1951] }
}
```

Mapa se po načtení automaticky přiblíží tak, aby byly vidět všechny body.

## Atributy

- `id` – číslo, unikátní identifikátor bodu
- `nazev` – název města (zobrazí se v tooltipu a v popupu)
- `popisek` – krátký popis (zobrazí se v popupu)

"""Injecte la liste des pictogrammes (snippets/okb-cododo-icon.liquid) dans les
schémas des sections OKB · fiche produit, à la place du marqueur __ICONS__."""
import json, pathlib

ICONS = [
    ("aucun", "Aucun"),
    ("hauteur", "Hauteur réglable"),
    ("roue_frein", "Roue + frein"),
    ("bercement", "Mode bercement"),
    ("mode_fixe", "Mode fixe"),
    ("selecteur", "Sélecteur"),
    ("maille", "Maille respirante"),
    ("moustiquaire", "Moustiquaire / protection"),
    ("panier", "Panier de rangement"),
    ("pliable", "Pliable"),
    ("compact", "Compact"),
    ("transport", "Rangement / transport"),
    ("structure", "Structure triangulaire"),
    ("rotation", "Rotation 360°"),
    ("frein", "Frein"),
    ("silence", "Silencieux"),
    ("acier", "Acier"),
    ("raccord", "Raccord renforcé"),
    ("finition", "Finition / anti-corrosion"),
    ("textile", "Textile"),
    ("demontable", "Démontable"),
    ("lavable", "Lavable"),
    ("lune", "Lune / nuit"),
    ("coeur", "Cœur"),
    ("livraison", "Livraison"),
    ("cadenas", "Paiement sécurisé"),
    ("retour", "Retour"),
    ("stock", "Colis / stock"),
    ("check", "Coche"),
]

root = pathlib.Path(__file__).resolve().parent.parent
options = json.dumps([{"value": v, "label": l} for v, l in ICONS], ensure_ascii=False)
for path in sorted((root / "sections").glob("okb-pdp-*.liquid")):
    text = path.read_text()
    if "__ICONS__" in text:
        path.write_text(text.replace("__ICONS__", options))
        print("icônes injectées :", path.name)

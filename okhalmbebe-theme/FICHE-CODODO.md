# Fiche produit « Lit cododo » — O Khalm Bébé

Boutique : **okhalmbebe.com** · thème publié : **o khalm bebe** (`#206757626195`).
Le thème publié ne peut pas être modifié par l'API : les fichiers ont été ajoutés à une
**copie** du thème publié, **« o khalm bebe – fiche cododo (à publier) »**, à prévisualiser puis publier.

Ce dossier contient les fichiers ajoutés, plus les fichiers existants du thème qui ont servi de référence
(`okb-home.css`, `okb-image-texte`, `okb-trio`, `main-product`, `product.json`, etc.).

## Fichiers ajoutés (aucun fichier existant modifié)

| Fichier | Rôle |
|---|---|
| `templates/product.cododo.json` | Modèle de page « cododo » à associer au produit |
| `sections/okb-pdp-reassurance.liquid` | Bandeau 4 icônes (2 × 2 sur mobile) |
| `sections/okb-pdp-feature.liquid` | Bloc photo + texte (+ caractéristiques, étapes, note) — utilisé 6 fois |
| `sections/okb-pdp-cards.liquid` | 3 cartes confort (défilement horizontal sur mobile) |
| `sections/okb-pdp-specs.liquid` | Caractéristiques complètes « Libellé : Valeur » |
| `sections/okb-pdp-accordions.liquid` | Accordéons Description / Pourquoi / Spécifications / Entretien |
| `sections/okb-pdp-reviews-head.liquid` | En-tête « ★★★★★ 4,8/5 — X avis » (lu dans Loox) |
| `snippets/okb-cododo-icon.liquid` | Famille de pictogrammes (trait fin arrondi, prune) |
| `snippets/okb-cododo-buybox.liquid` | Accroche + 4 bénéfices, et réassurance sous le bouton |
| `assets/okb-cododo.css` | Styles, basés sur les variables de la charte (`--okb-plum`, `--okb-gold`…) |

La FAQ réutilise la section existante **OKB · Questions** (`okb-faq`, avec données structurées FAQ).

## Parcours de la page

Produit + photos + prix + CTA → 4 bénéfices → Tout près de vous la nuit → Chambre → salon →
Mode fixe / bercement → Maille + moustiquaire + panier → Pliable → Structure → Entretien →
Caractéristiques → Accordéons → FAQ → Avis → Produits complémentaires (+ bandeau newsletter).

## Points à compléter

- **Photos** : chaque bloc affiche un visuel de remplacement lavande tant qu'aucune image n'est déposée.
- **Matelas** : retiré des caractéristiques ; question FAQ et accordéon « Contenu du colis »
  ajoutés mais **masqués** (à activer une fois l'information confirmée).
- **Premier écran** : les textes de l'accroche, des 4 bénéfices et des lignes de réassurance sont modifiables
  dans les blocs « Custom Liquid » de la section produit.

## Régénérer

```
python3 tools/build_icons.py      # (uniquement si le marqueur __ICONS__ est présent)
python3 tools/build_template.py   # régénère templates/product.cododo.json
```

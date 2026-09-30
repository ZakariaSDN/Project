O Khalm Bébé vend des essentiels du sommeil pour les tout-petits. Une seule spécialité : les nuits des tout-petits. La boutique parle à de jeunes parents fatigués et prudents : elle rassure par des faits vérifiables, jamais par des promesses.

## Voix et rédaction

- Vouvoyer le lecteur (« Gardez bébé près de vous »). Phrases courtes, verbes d'action.
- Décrire ce que le produit permet, pas ce qu'il garantit. Écrire « aide à protéger l'espace de bébé des moustiques », jamais « protège bébé ». Jamais « endort bébé en quelques secondes » ni « le lit le plus stable du marché ».
- Attribuer les données techniques : « annoncé par le fabricant », « âge indiqué par le fabricant : 0–24 mois ». Une information non confirmée (le matelas) ne s'affiche pas.
- Typographie française : apostrophe courbe ’, guillemets « », espace avant « : », « € » après le montant (120,00 €), virgule décimale (4,8/5).
- Pas d'emoji dans l'interface ; les coches et pictogrammes les remplacent.
- Chaque section a une seule mission : le premier écran vend l'essentiel, les blocs photo montrent les bénéfices, la fiche technique donne les faits, la FAQ répond aux objections, les avis apportent la preuve.

Exemples réels :
> Tout près de vous pendant la nuit
> La nuit dans votre chambre. La sieste dans le salon.
> Livraison offerte dès 150 € · Paiement sécurisé · Retour sous 14 jours

## Couleurs

- Fond de page `white`. Texte et titres en `ink` ; titre produit, prix et liens en `ink-soft`.
- `plum` est la couleur d'action et d'identité : bouton « Ajouter au panier », pictogrammes, titres de groupes. Survol : `plum-light`.
- `gold` est un accent, jamais un texte courant : sur-titres en capitales, prix barré, étoiles, coches, flèches. Il n'atteint que 2,9:1 sur `white`.
- Alterner les fonds de section `sand` et `lavender` pour rythmer la page ; une carte posée sur l'un d'eux est `white`.
- `muted` pour le texte secondaire sur `white` et `sand`. Sur `lavender`, garder `ink` pour les petits textes.
- `success` ne sert qu'à « En stock ». `line` ne porte jamais d'information seule.
- Note : le modèle produit publié règle aussi le texte secondaire des sections OKB sur `ink` (#120918) ; la valeur `muted` (#726a75) est celle du thème par défaut et des nouvelles sections cododo.

## Typographie

Une seule famille, Nunito Sans (Google Fonts), en 400 pour le texte et 700 pour les titres. Titres en `section-title` centrés, `feature-title` alignés à gauche dans les blocs photo, `card-title` dans les cartes. L'accroche du premier écran est en `lead` prune. Les sur-titres utilisent `eyebrow` en capitales dorées. Sous 750px, tous les titres de section passent en `section-title-mobile`.

## Espacements et formes

- Contenu limité à `container`, marges `gutter` (ordinateur) et `space-4` (mobile). Sections séparées de `section-y` / `section-y-mobile`.
- Formes douces : `radius-lg` pour les panneaux, cartes et photos, `radius-md` pour les éléments posés dedans, `radius-sm` pour les boutons, `radius-pill` pour les pastilles.
- Les panneaux se distinguent par leur fond `sand` ou `lavender`, pas par une ombre. `shadow-soft` reste exceptionnelle.

## Pictogrammes

Une seule famille maison (groupe « Pictogrammes ») : grille 24 × 24, trait de 1,6, bouts et angles arrondis, monochrome `plum`. Dans l'interface, chaque pictogramme est posé dans une pastille ronde `lavender` de 44px (40px dans les caractéristiques, 34px dans les étiquettes), et devient `white` sur un fond `lavender`. Les coches de réassurance sont en `gold`, « En stock » en `success`. Au premier écran, montrer quatre pictogrammes au maximum. Dans le thème, ils sont rendus par l'extrait `okb-cododo-icon` avec `currentColor` ; les fichiers de ce groupe sont figés en prune.

## Photos

Photos lifestyle réelles du produit (chambre, salon, gros plans structure et textile), au format 4:5 dans les blocs bénéfice, 4:3 dans les cartes, recadrées en `radius-md` ou `radius-lg`. Tant qu'une photo manque, la section affiche un visuel de remplacement sur fond `lavender`.

## Logo

Le logo de la boutique est un fichier image réglé dans le thème (En-tête) ; il n'est pas repris ici. Dans cette charte, le nom s'écrit « O Khalm Bébé » en Nunito Sans 700.

## Page produit « Lit cododo »

Modèle `product.cododo`, dans cet ordre :
1. Premier écran : titre produit, accroche `lead` et 4 bénéfices (`BenefitList`), prix (`Price`), note Loox, couleurs, quantité, bouton `Button`, puis `TrustLine`.
2. `ReassuranceBand` : 4 caractéristiques, 2 × 2 sur mobile.
3. `FeatureBlock` « Tout près de vous pendant la nuit » (fond `sand`).
4. `FeatureBlock` « La nuit dans votre chambre. La sieste dans le salon. » (fond `white`, 2 caractéristiques + note).
5. `FeatureBlock` mode bercement avec schéma en 3 étapes (fond `lavender`).
6. Trois `ComfortCard` : maille, moustiquaire, panier.
7. `FeatureBlock` pliage, structure, entretien.
8. `SpecTable` « Toutes les caractéristiques en un coup d'œil ».
9. `Accordion` : Description, Pourquoi choisir ce produit ?, Spécifications, Entretien & utilisation.
10. FAQ (même style d'accordéon), puis `RatingHeader` et les avis Loox, puis « Vous pourriez aussi aimer ».

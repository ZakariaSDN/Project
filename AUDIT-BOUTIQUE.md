# Audit de la boutique Shopify « couleursafran » – 30/09/2026

Boutique analysée : `couleursafran-rs0qngin.myshopify.com` (plan **Development**, protégée par mot de passe).
Thème en ligne : **couleursafran** (`#189740810620`, thème personnalisé). Le dossier `theme/` contient une copie complète du thème ; le premier commit est l'état d'origine, le second contient les corrections.

> ⚠️ Cette boutique a été créée le 30/09/2026 à 02:08 UTC (produits importés à 02:08, thème importé à 02:31).
> Si votre vraie boutique est une autre adresse, les corrections du thème s'appliquent de la même façon, mais la partie « Contenu manquant » ne concerne que cette boutique.

---

## 0. 🔴 Cause du blocage de Chrome/Edge sur la page produit

Le script « ATC INSTANT v3 » (`sections/main-product-section.liquid`, thème en ligne) observe le formulaire produit avec un `MutationObserver` et **réécrit le texte du bouton dès qu'il « ressemble à de l'anglais »** (`add to cart`).
Or la langue principale de la boutique est **l'anglais** (`shopLocales` : `en` uniquement) : le bouton affiche « Add to cart ».
Le script le remplace par… « Add to cart » (sa valeur « par défaut » est lue sur le bouton lui-même). Chaque remplacement déclenche de nouveau l'observateur → **boucle infinie de micro-tâches** : le navigateur ne peut plus rien afficher ni répondre, l'onglet se fige.

Reproduit dans Chromium avec le script d'origine : bouton « Ajouter au panier » → page réactive ; bouton « Add to cart » → page bloquée (aucune réponse après 5 s).
La version corrigée (script supprimé, voir #3 plus bas) reste réactive avec « Add to cart ».

➡️ **Le blocage disparaîtra dès la publication du thème corrigé.** Il est aussi recommandé d'ajouter le français dans *Paramètres → Langues* et d'en faire la langue par défaut (boutique destinée à la France).

## 1. Page produit – bugs trouvés et corrigés dans le code

| # | Problème | Effet pour le client | Fichier | Statut |
|---|----------|----------------------|---------|--------|
| 1 | Le CSS « coverflow » rendait **toutes les images invisibles** (`opacity: 0`) tant que Swiper (235 Ko) et `theme.js` (118 Ko) n'étaient pas chargés et exécutés. | La galerie reste **vide / blanche** pendant le chargement, surtout sur mobile → « ça ne charge pas ». | `sections/main-product-section.liquid` | ✅ Corrigé : la 1re image s'affiche immédiatement ; les autres ne sont masquées qu'après l'initialisation du slider. |
| 2 | La 1re image produit était en `loading="lazy"`. | L'image principale (élément le plus grand) démarre en retard (mauvais LCP / Core Web Vitals). | `snippets/media-gallery.liquid` | ✅ Corrigé : `loading="eager"` + `fetchpriority="high"` sur la 1re image uniquement. |
| 3 | Script « ATC INSTANT v3 » : réactivait **de force** le bouton « Ajouter au panier » (y compris pour une variante épuisée), en rafales de 12 passages toutes les 120 ms à chaque changement + un `MutationObserver`, et un CSS forçant l'affichage des boutons avec `!important`. Il combattait le JavaScript du thème. | Boutons qui clignotent/changent de libellé, clics possibles sur une variante épuisée, page qui « rame » quand on change d'option. | `sections/main-product-section.liquid` | ✅ Supprimé ; la vraie cause (textes anglais) est corrigée en #4. |
| 4 | Le sélecteur de variantes écrivait en dur **« Add to Cart », « Soldout », « Unavailable »** (anglais) dans le bouton. | Texte anglais sur une boutique française (c'est ce que le script #3 essayait de masquer). | `assets/theme.js` | ✅ Corrigé : utilise les traductions du thème (« Ajouter au panier », « Épuisé », « Indisponible »). |
| 5 | `variantStrings.unavailable` pointait vers la traduction « Épuisé ». | Mauvais message pour une combinaison inexistante. | `snippets/theme-variables.liquid` | ✅ Corrigé (« Indisponible »). |
| 6 | Barre produit collante (sticky) : l'identifiant du prix ne correspondait pas à celui attendu par le JS. | Le prix de la barre collante **ne se met pas à jour** quand on change de variante (ex. Douceur de linge 20 € / 22 €). | `snippets/sticky-product.liquid`, `assets/theme.js` | ✅ Corrigé. |
| 7 | Barre sticky : la variante sélectionnée n'était jamais marquée « active » (variable `option` inexistante). | Aucune option sélectionnée visuellement dans la barre collante. | `snippets/sticky-product.liquid` | ✅ Corrigé. |
| 8 | `featured-product.css` chargé **2 fois**. | CSS téléchargé/analysé en double. | `sections/main-product-section.liquid` | ✅ Corrigé. |
| 9 | Sélecteur sans JavaScript (`<noscript>`) : bouclait sur les options au lieu des variantes. | Liste de variantes vide/invalide sans JS. | `snippets/product-variants.liquid` | ✅ Corrigé. |
| 10 | Badge promo : filtre Liquid inexistant `to_string`. | Risque d'erreur Liquid en haut de la page produit. | `templates/product.json` | ✅ Corrigé (`.value`). |
| 11 | Section « Hot spots » : produit réglé sur le texte `{{ product }}` (pas un vrai produit). | Point chaud cassé / vide. | `templates/product.json` | ✅ Réinitialisé (à re-choisir dans l'éditeur si besoin). |

## 2. Ensemble du site – corrigé dans le code

| Problème | Effet | Fichier | Statut |
|----------|-------|---------|--------|
| **Toutes les feuilles de style chargées 2 fois** sur chaque page (8 fichiers : `base.css`, `theme.css`, `swiper.css`…). | Rendu plus lent sur toutes les pages. | `snippets/theme-variables.liquid` | ✅ Corrigé (ordre de cascade conservé → aucun changement visuel). |
| `model-viewer-ui.css` (3D) chargé sur toutes les pages produit alors qu'aucun produit n'a de modèle 3D (la section le charge déjà quand c'est nécessaire). | Requête inutile. | `snippets/theme-variables.liquid` | ✅ Supprimé. |
| Barre « livraison offerte » : `shipping_rate` vide → division par zéro. | Calcul faux (barre à 100 %). | `assets/theme.js` | ✅ Protégé. |
| `const shippingStatus ={{ settings.show_shipping }};` : si le réglage est vide, erreur de syntaxe JS qui casse `window.routes` → ajout au panier cassé. | Risque de panne totale du panier. | `snippets/theme-variables.liquid` | ✅ Sécurisé (`| json`). |

## 3. Contenu manquant dans cette boutique (à faire dans l'admin Shopify – non modifié)

Le thème a été importé depuis une autre boutique, mais **son contenu n'a pas suivi** :

- **Collections** : il n'existe qu'une seule collection (« Home page »). Le thème et ses 16 modèles `collection.*.json` renvoient vers : `nos-diffuseurs-de-parfum`, `nos-bougies-de-parfum`, `nos-eaux-de-parfum`, `eaux-de-toilette`, `nos-parfums-d-interieur`, `nos-parfums-de-peau`, `nos-coffrets-et-bons-cadeaux`, `nos-coffrets-cadeaux`, `recharge-diffuseur-parfum`, `collection-french-riviera`, `nouveautes`, `nos-offres-speciales`, `coups-de-coeur`, `👗-douceur-de-linge`, `🎟-bons-cadeaux`, `🌿-eaux-de-parfum` → **liens en 404 et sections vides** sur l'accueil et la page produit.
- **Pages** : seule « Contact » existe. Manquent : `qui-sommes-nous`, `professionnels`, `personnalisation`, `espace-revendeurs`, `entreprise-ce` (+ modèles `faq`, `livraison-retours`, `notre-histoire`).
- **Menus** : « Main menu » est le menu par défaut en anglais (Home / Catalog / Contact). Les menus `menu-pied-de-page` et `lien-externe` utilisés par le thème n'existent pas.
- **Métachamps / métaobjets** : aucune définition. Les accordéons **« Détails de la senteur »** et **« Pictogrammes »** de la page produit (`custom.senteur`, `custom.pictogrammes`) et le badge promo (`custom.promo`) restent donc **vides/masqués**.
- **Applications** : Judge.me (avis) et Avada SEO ne sont pas installées ; leurs extraits restent dans le thème mais n'affichent rien.
- **Stock** : aucun produit ne suit le stock (tous « disponibles », quantité 0). Normal si vous ne gérez pas le stock, sinon à configurer.
- **Réglage thème** : `shipping_rate` / `shipping_text` vides → la barre « livraison offerte » du panier est désactivée.

## 4. Points signalés, non modifiés (risque faible)

- `sections/ss-scrolling-announcement-bar-2.liquid` pèse 152 Ko ; `photoswipe.js` + `vimeo-player.js` sont chargés sur toutes les pages.
- `snippets/cart-drawer.liquid` ligne ~607 : un `</div>` en trop dans la branche « panier non vide » (signalé par Theme Check), à vérifier visuellement.
- 5 extraits orphelins (`booster-seo`, `avada-defer-css`, `icons`, `image`, `carousal-arrows`) et filtres `img_url` obsolètes.

## Comment appliquer

Le thème en ligne (MAIN) ne peut pas être modifié directement par l'API. Les corrections sont à appliquer sur **une copie non publiée** du thème, à prévisualiser, puis à publier depuis *Boutique en ligne → Thèmes*.

## Incident de déploiement (30/09, 03:20)

La première copie corrigée (`#189740908924`) a été publiée, mais Shopify était encore en train de dupliquer le thème quand les corrections ont été envoyées : la fin de la duplication (02:48:08) a **réécrit 6 des 7 fichiers corrigés avec leur version d'origine** (seul `templates/product.json` a gardé la correction). Le script « ATC INSTANT v3 » est donc resté en ligne et le blocage a continué.

Correctif : les 7 fichiers ont été renvoyés sur le thème `#189740810620`, renommé « ✅ couleursafran – CORRIGÉ (à publier) ». Vérification faite **après** la fin du traitement (`processing: false`) : les 7 empreintes MD5 correspondent au commit `11423e6`, et les autres fichiers contrôlés sont identiques à la version testée.
Le thème `#189740908924` a été renommé « ⚠️ ancien – contient le bug (ne pas utiliser) ».

Test local (Chromium, vrai Liquid rendu, vrais JS/CSS, Swiper 11.0.7 identique à celui du thème, produit à 100 variantes, images 1600 px, processeur ralenti ×4) : ancienne version → navigateur figé ; version corrigée → page réactive au chargement, au défilement et aux changements de variante.

---

# Page d'accueil – audit du 01/10/2026

Méthode : rendu local de `templates/index.json` (13 sections + en-tête, pied de page, overlays) avec le vrai Liquid/JS/CSS du thème, dans Chromium, en reproduisant les contenus réellement absents de la boutique (vérifiés via l'API Admin). Tests : chargement, défilement complet, CPU ralenti ×4, clics sur onglets et flèches.

**Résultat performance** : pas de blocage ; chargement ~2 s (CPU ×4), défilement fluide.

## Bug corrigé dans le code
| Problème | Effet | Fichier | Statut |
|---|---|---|---|
| Flèches et onglets de « Choisissez un art de vivre » branchés deux fois (`onclick` + écouteur JS) | Un clic sur « › » sautait de « Parfum d'intérieur » à « Coffrets & bons cadeaux » ; l'onglet **« Parfums de Peau » était inaccessible** via les flèches | `sections/tabs-collections.liquid` | ✅ Corrigé (testé : 1 → 2 → 3 → 2) |

## Contenu manquant (à faire dans l'admin – aucune modification du code nécessaire)
- ~~**Images** : 36 des 37 images semblaient absentes~~ — **constat retiré le 01/10** : l'API Fichiers ne les liste pas, mais une capture de la boutique montre le logo et les visuels bien affichés. Ce contrôle n'était pas fiable.
- **Collections** : la section « Nouveautés / Coup de ❤️ / Coffrets & idées cadeaux / Nos promotions » affiche **16 faux produits « Example product – €18.99 »** car les collections `nouveautes`, `coups-de-coeur`, `nos-coffrets-et-bons-cadeaux`, `nos-offres-speciales` n'existent pas. Même cause pour les cartes des onglets « Parfum d'intérieur / Parfums de Peau / Coffrets » (8 collections manquantes).
- **Blog** : la section « Suivez l'actualité Couleur Safran » pointe vers le blog `news`, qui a **0 article** → section vide.
- **Menus du pied de page** (« Liens utiles », « Notre sélection ») : vides, menus inexistants.

## Points mineurs (non modifiés)
- `ss-counter` charge `flip.min.js` depuis un CDN externe (unpkg.com) : dépendance tierce, à rapatrier dans les assets du thème si possible.
- `slideshow` : un `MutationObserver` recalcule la position des flèches à chaque changement de style des slides (léger coût pendant les transitions, sans blocage).

## Corrections du 01/10 (suite à une capture mobile)
| Problème | Effet | Fichier | Statut |
|---|---|---|---|
| Section « Hot spots » : le 2e point n'était relié à aucun produit | La bulle affichait « Produit exemple – €18,99 » | `templates/product.json` | ✅ Relié à « Coffrets Diffuseurs de Parfums Artisanaux » |
| Diaporama de citations : fondu croisé, les deux citations visibles en même temps | Textes superposés pendant le changement (jusqu'à 41 % d'opacité chacune) | `sections/citation-diaporama.liquid` | ✅ La nouvelle citation n'apparaît qu'après la disparition de l'ancienne (chevauchement mesuré : 0) |

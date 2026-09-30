"""Génère templates/product.cododo.json (fiche « Lit cododo ») à partir des
réglages du modèle produit actuel (templates/product.json) : même section de
réglages de charte, même section produit (galerie, formulaire, Loox), puis
les nouvelles sections OKB dans l'ordre du parcours validé."""
import json, pathlib

root = pathlib.Path(__file__).resolve().parent.parent
src = (root / "templates/product.json").read_text()
base = json.loads(src[src.index("{"):])
S = base["sections"]

# --------------------------------------------------------------------------
# 1. Premier écran — section produit
# --------------------------------------------------------------------------
main = json.loads(json.dumps(S["main"]))
b = main["blocks"]

intro = (
    "{% render 'okb-cododo-buybox', part: 'intro',\n"
    "  accroche: 'Gardez bébé près de vous, de la nuit à la sieste.',\n"
    "  texte: 'Réglable en hauteur, mobile et pliable, ce berceau accompagne bébé dans son propre espace de repos, près de votre lit comme dans les autres pièces de la maison.',\n"
    "  i1: 'hauteur', b1: '3 hauteurs réglables',\n"
    "  i2: 'roue_frein', b2: 'Roulettes 360° avec freins',\n"
    "  i3: 'bercement', b3: 'Mode fixe ou bercement',\n"
    "  i4: 'pliable', b4: 'Pliable + grand rangement'\n"
    "%}"
)
trust = (
    "{% render 'okb-cododo-buybox', part: 'trust', product: product,\n"
    "  l1: 'Livraison offerte dès 150 €',\n"
    "  l2: 'Paiement sécurisé',\n"
    "  l3: 'Retour sous 14 jours'\n"
    "%}"
)

b["okb_cd_intro"] = {"type": "custom_liquid", "settings": {"custom_liquid": intro}}
b["okb_cd_trust"] = {"type": "custom_liquid", "settings": {"custom_liquid": trust}}

# Étoiles Loox aux couleurs de la maison (doré) au lieu du vert par défaut
b["loox_reviews_loox_rating_hNbwLC"]["settings"]["starColor"] = "#aa9666"

# Ordre demandé : titre → accroche + 4 bénéfices → prix → avis → variantes,
# quantité, bouton → réassurance → moyens de paiement.
# Retirés du premier écran : carrousel d'avis Loox, texte CRO, liste de points,
# estimation de livraison et onglets (déplacés en accordéons plus bas).
for key in [
    "loox_reviews_loox_snippets_widget_gaYmMK",
    "zayor_product_description",
    "text_BtxENh",
    "order_j7w4Me",
    "tab_des_KwB3yV",
    "tab_html_QPJ3MY",
    "tab_html_yVNCcz",
]:
    b.pop(key)

main["block_order"] = [
    "title",
    "okb_cd_intro",
    "price_review",
    "loox_reviews_loox_rating_hNbwLC",
    "form",
    "okb_cd_trust",
    "img_qVeyxV",
]
# Le bloc « Produits fréquemment achetés ensemble » reste actif tel quel.

# --------------------------------------------------------------------------
# 2 → 9. Sections OKB
# --------------------------------------------------------------------------
def chip(icon, title, text=""):
    return {"type": "chip", "settings": {"icon": icon, "title": title, "text": text}}

def step(icon, label):
    return {"type": "step", "settings": {"icon": icon, "label": label}}

def note(text):
    return {"type": "note", "settings": {"text": text}}

def feature(settings, blocks=()):
    base_settings = {
        "image_source": "image",
        "image_index": 1,
        "image_alt": "",
        "image_ratio": "4_5",
        "reverse": False,
        "eyebrow": "",
        "heading": "",
        "text": "",
        "meta": "",
        "style": "sable",
        "chip_cols": "2",
    }
    base_settings.update(settings)
    out = {"type": "okb-pdp-feature", "settings": base_settings}
    if blocks:
        ids = [f"b{i + 1}" for i in range(len(blocks))]
        out["blocks"] = dict(zip(ids, blocks))
        out["block_order"] = ids
    return out

def with_blocks(section_type, settings, blocks):
    ids = [f"b{i + 1}" for i in range(len(blocks))]
    return {
        "type": section_type,
        "settings": settings,
        "blocks": dict(zip(ids, blocks)),
        "block_order": ids,
    }

reassurance = with_blocks("okb-pdp-reassurance", {"heading": "", "style": "sable"}, [
    {"type": "item", "settings": {"icon": "hauteur", "title": "3 niveaux de hauteur", "text": "S’adapte plus facilement à votre environnement."}},
    {"type": "item", "settings": {"icon": "roue_frein", "title": "Roues 360° avec freins", "text": "Facile à déplacer puis à immobiliser."}},
    {"type": "item", "settings": {"icon": "bercement", "title": "Mode bercement", "text": "Passez du mode fixe à un balancement doux."}},
    {"type": "item", "settings": {"icon": "moustiquaire", "title": "Moustiquaire intégrée", "text": "Une protection pratique contre les moustiques et petits insectes."}},
])

nuit = feature({
    "image_alt": "Berceau cododo O Khalm Bébé placé contre le lit parental",
    "eyebrow": "La nuit",
    "heading": "Tout près de vous pendant la nuit",
    "text": "<p>Grâce à ses <strong>trois niveaux de hauteur</strong>, le berceau peut être positionné à proximité de votre lit tout en laissant bébé dans son propre espace de repos. Une configuration pratique lors des réveils nocturnes, des biberons ou de l’allaitement.</p>",
    "meta": "3 positions de hauteur • Réglage par boutons de verrouillage",
    "style": "sable",
})

mobilite = feature({
    "image_alt": "Berceau cododo sur roulettes dans le salon",
    "eyebrow": "Chambre → salon",
    "heading": "La nuit dans votre chambre. La sieste dans le salon.",
    "text": "<p>Les <strong>roulettes multidirectionnelles à 360°</strong> permettent de déplacer facilement le berceau d’une pièce à l’autre. Une fois à la bonne place, <strong>les freins</strong> permettent de l’immobiliser.</p>",
    "reverse": True,
    "style": "blanc",
}, [
    chip("rotation", "360°", "Rotation multidirectionnelle"),
    chip("frein", "Freins intégrés", "Pour immobiliser le berceau"),
    note("Roulement annoncé silencieux par le fabricant."),
])

bercement = feature({
    "image_alt": "Sélecteur latéral du mode bercement",
    "eyebrow": "Mode fixe ou bercement",
    "heading": "Un berceau fixe quand vous le souhaitez, un bercement doux quand vous en avez besoin",
    "text": "<p>Un <strong>sélecteur latéral</strong> permet de passer du mode fixe au mode bercement. Activez le mouvement lorsque vous souhaitez bercer doucement bébé, puis revenez au mode fixe en quelques gestes.</p>",
    "style": "lavande",
}, [
    step("mode_fixe", "Mode fixe"),
    step("selecteur", "Tourner le sélecteur"),
    step("bercement", "Mode bercement"),
])

cartes = with_blocks("okb-pdp-cards", {"eyebrow": "Au quotidien", "heading": "Pensé pour le confort du quotidien"}, [
    {"type": "card", "settings": {
        "image_source": "image", "image_index": 1, "image_alt": "Panneaux en maille respirante du berceau",
        "icon": "maille", "label": "Maille respirante",
        "title": "Vous le voyez. L’air continue de circuler.",
        "text": "<p>Les larges panneaux en maille favorisent la circulation de l’air tout en vous permettant de garder facilement un œil sur bébé.</p>",
    }},
    {"type": "card", "settings": {
        "image_source": "image", "image_index": 1, "image_alt": "Moustiquaire intégrée déployée sur le berceau",
        "icon": "moustiquaire", "label": "Moustiquaire",
        "title": "Une moustiquaire déjà intégrée",
        "text": "<p>Déployez-la lorsque vous en avez besoin pour aider à protéger l’espace de bébé des moustiques et petits insectes. Sa partie plus couvrante aide également à atténuer une lumière directe.</p>",
    }},
    {"type": "card", "settings": {
        "image_source": "image", "image_index": 1, "image_alt": "Grand panier de rangement sous le berceau",
        "icon": "panier", "label": "Panier",
        "title": "Les essentiels juste en dessous",
        "text": "<p>Couches, langes, pyjama de rechange et petits accessoires restent organisés dans le grand panier inférieur, toujours à portée de main.</p>",
    }},
])

pliage = feature({
    "image_alt": "Berceau cododo replié",
    "eyebrow": "Rangement",
    "heading": "Plié lorsque vous avez besoin de place",
    "text": "<p>Le berceau peut être replié afin de réduire son encombrement lorsqu’il n’est pas utilisé. Pratique pour le rangement à la maison ou lors de déplacements ponctuels.</p>",
    "reverse": True,
    "style": "sable",
    "chip_cols": "3",
}, [
    chip("pliable", "Pliable"),
    chip("compact", "Compact une fois replié"),
    chip("transport", "Plus simple à ranger et transporter"),
])

structure = feature({
    "image_alt": "Gros plan sur la structure et les raccords du berceau",
    "eyebrow": "Qualité & structure",
    "heading": "Une structure conçue pour rester stable",
    "text": "<p>Le châssis associe une <strong>structure en acier carbone</strong>, des tubes robustes, des connexions renforcées et une <strong>base triangulaire élargie</strong> pensée pour offrir une bonne stabilité au quotidien.</p>",
    "style": "blanc",
}, [
    chip("acier", "Acier carbone", "Structure principale"),
    chip("structure", "Base triangulaire", "Conception élargie"),
    chip("raccord", "Raccords renforcés", "Assemblage robuste"),
    chip("finition", "Finition mate", "Conception annoncée résistante à la corrosion"),
])

entretien = feature({
    "image_alt": "Gros plan sur la matière textile du berceau",
    "eyebrow": "Entretien",
    "heading": "Pensé aussi pour les petits accidents du quotidien",
    "text": "<p>Le berceau utilise un revêtement en <strong>fibre polyester</strong> avec des zones en maille respirante et certaines parties en conception double couche. Les éléments textiles sont annoncés par le fabricant comme <strong>démontables et lavables</strong>.</p>",
    "image_ratio": "1_1",
    "reverse": True,
    "style": "lavande",
    "chip_cols": "3",
}, [
    chip("textile", "Polyester"),
    chip("demontable", "Textiles démontables"),
    chip("lavable", "Éléments lavables"),
])

# --------------------------------------------------------------------------
# 10. Caractéristiques complètes
# --------------------------------------------------------------------------
def group(icon, title, lines):
    return {"type": "group", "settings": {"icon": icon, "title": title, "lines": "\n".join(lines)}}

specs = with_blocks("okb-pdp-specs", {
    "eyebrow": "Fiche technique",
    "heading": "Toutes les caractéristiques en un coup d’œil",
    "footnote": "Informations indiquées par le fabricant. Respectez la notice et les limites d’utilisation du produit.",
}, [
    group("hauteur", "Dimensions & utilisation", [
        "Dimensions indiquées : 94 × 52 cm",
        "Âge indiqué par le fabricant : 0–24 mois",
        "Hauteur : réglable sur 3 niveaux",
        "Utilisation : berceau indépendant ou placé à proximité du lit parental",
        "Mode fixe : oui",
        "Mode bercement : oui",
        "Inclinaison mécanique : jusqu’à environ 5° selon configuration",
    ]),
    group("structure", "Structure & mobilité", [
        "Structure : acier carbone",
        "Base : structure triangulaire élargie",
        "Roulettes : pivotantes à 360°",
        "Freins : oui",
        "Roulement : annoncé silencieux par le fabricant",
        "Pliage : oui",
    ]),
    group("textile", "Textile & accessoires", [
        "Revêtement : fibre polyester",
        "Parois : maille respirante",
        "Double couche : présente sur certaines zones",
        "Moustiquaire : intégrée",
        "Rangement : grand panier inférieur",
        "Entretien : textiles annoncés démontables et lavables",
    ]),
    group("lune", "Matelas", [
        "Matelas : à confirmer selon la configuration choisie",
    ]),
])

# --------------------------------------------------------------------------
# 11. Accordéons
# --------------------------------------------------------------------------
def acc(title, content, icon="aucun", use_description=False, disabled=False):
    out = {"type": "item", "settings": {
        "icon": icon, "title": title, "content": content,
        "use_description": use_description, "open": False,
    }}
    if disabled:
        out["disabled"] = True
    return out

accordeons = with_blocks("okb-pdp-accordions", {"heading": ""}, [
    acc("Description",
        "<p>Le lit cododo O Khalm Bébé garde bébé tout près de vous, dans son propre espace de repos. Réglable sur trois hauteurs, il se place à côté du lit parental ou s’utilise comme berceau indépendant.</p>"
        "<p>Monté sur des roulettes pivotantes à 360° avec freins, il vous suit de la chambre au salon. Un sélecteur latéral permet de passer du mode fixe au mode bercement.</p>"
        "<p>Parois en maille respirante, moustiquaire intégrée, grand panier de rangement et structure pliable : l’essentiel pour les nuits comme pour les siestes.</p>"),
    acc("Pourquoi choisir ce produit ?",
        "<ul>"
        "<li><strong>Bébé tout près de vous</strong> grâce aux 3 hauteurs réglables</li>"
        "<li><strong>Mobile</strong> : roulettes 360° et freins pour passer d’une pièce à l’autre</li>"
        "<li><strong>Deux usages</strong> : mode fixe ou bercement doux</li>"
        "<li><strong>Maille respirante</strong> pour garder un œil sur bébé</li>"
        "<li><strong>Moustiquaire intégrée</strong>, prête à être déployée</li>"
        "<li><strong>Grand panier</strong> pour les essentiels de la nuit</li>"
        "<li><strong>Pliable</strong> pour gagner de la place</li>"
        "</ul>"),
    acc("Spécifications",
        "<ul>"
        "<li><strong>Dimensions indiquées :</strong> 94 × 52 cm</li>"
        "<li><strong>Âge indiqué par le fabricant :</strong> 0–24 mois</li>"
        "<li><strong>Hauteur :</strong> 3 niveaux</li>"
        "<li><strong>Structure :</strong> acier carbone, base triangulaire élargie</li>"
        "<li><strong>Roulettes :</strong> pivotantes à 360° avec freins</li>"
        "<li><strong>Modes :</strong> fixe ou bercement (inclinaison jusqu’à environ 5° selon configuration)</li>"
        "<li><strong>Revêtement :</strong> fibre polyester, parois en maille respirante</li>"
        "<li><strong>Accessoires intégrés :</strong> moustiquaire, grand panier inférieur</li>"
        "<li><strong>Pliable :</strong> oui</li>"
        "</ul>"),
    acc("Entretien & utilisation",
        "<p><strong>Hauteur :</strong> choisissez l’un des trois niveaux puis vérifiez que les boutons de verrouillage sont bien enclenchés.</p>"
        "<p><strong>Freins :</strong> une fois le berceau à sa place, bloquez les freins des roulettes avant d’y installer bébé.</p>"
        "<p><strong>Mode bercement :</strong> tournez le sélecteur latéral pour passer du mode fixe au mode bercement, puis revenez au mode fixe de la même façon.</p>"
        "<p><strong>Pliage :</strong> repliez le berceau en suivant les étapes de la notice fournie.</p>"
        "<p><strong>Nettoyage :</strong> retirez les éléments textiles démontables et lavez-les en suivant les indications de leur étiquette.</p>"
        "<p>Respectez toujours la notice du fabricant et les limites d’utilisation prévues pour le produit.</p>"),
    acc("Contenu du colis",
        "<p>À compléter une fois le contenu exact confirmé avec le fournisseur.</p>",
        disabled=True),
])

# --------------------------------------------------------------------------
# 12. FAQ (section existante « OKB · Questions »)
# --------------------------------------------------------------------------
def q(question, answer, disabled=False):
    out = {"type": "question", "settings": {"question": question, "answer": answer, "open": False}}
    if disabled:
        out["disabled"] = True
    return out

faq = with_blocks("okb-faq", {
    "eyebrow": "Questions fréquentes",
    "heading": "<p>Tout ce que vous voulez savoir avant de l’adopter</p>",
    "text": "<p>Une autre question ? Notre équipe vous répond avec plaisir.</p>",
    "link_label": "",
    "link": "",
    "enable_schema_markup": True,
}, [
    q("Le berceau peut-il être placé près du lit parental ?",
      "<p>Oui. Ses trois niveaux de hauteur permettent d’adapter plus facilement sa position à proximité du lit. Il reste toutefois un berceau indépendant, sauf indication contraire confirmée par le fabricant.</p>"),
    q("Les roulettes ont-elles des freins ?",
      "<p>Oui, les roulettes sont pivotantes à 360° et disposent d’un système de frein.</p>"),
    q("Peut-on utiliser le berceau sans le mode bercement ?",
      "<p>Oui. Il peut être utilisé en mode fixe ou en mode bercement.</p>"),
    q("Le produit est-il pliable ?",
      "<p>Oui, sa conception permet de réduire son encombrement pour faciliter son rangement.</p>"),
    q("Les textiles peuvent-ils être lavés ?",
      "<p>Le fabricant indique que les éléments textiles sont démontables et lavables.</p>"),
    q("La moustiquaire est-elle intégrée ?",
      "<p>Oui, elle est directement intégrée au berceau.</p>"),
    q("Jusqu’à quel âge peut-il être utilisé ?",
      "<p>Le fabricant indique une utilisation de 0 à 24 mois. Il faut toutefois respecter la notice et les limites d’utilisation prévues pour le produit.</p>"),
    q("Le matelas est-il fourni ?",
      "<p>À compléter une fois ce point confirmé avec le fournisseur.</p>",
      disabled=True),
])

# --------------------------------------------------------------------------
# 13. Avis clients
# --------------------------------------------------------------------------
avis_head = {"type": "okb-pdp-reviews-head", "settings": {
    "eyebrow": "Avis vérifiés",
    "heading": "Ce qu’en disent les parents",
}}
avis = json.loads(json.dumps(S["1788892822689f5ffc"]))
loox = avis["blocks"]["loox_reviews_loox_dynamic_section_nWqQif"]["settings"]
loox["limit"] = 8  # 8 avis visibles, le reste via « voir plus » du widget Loox

# --------------------------------------------------------------------------
# 14. Produits complémentaires
# --------------------------------------------------------------------------
reco = json.loads(json.dumps(S["product-recommendations"]))
reco["settings"]["top_heading"] = "Vous pourriez aussi aimer"

template = {
    "sections": {
        "okb_styles_pr": S["okb_styles_pr"],
        "main": main,
        "okb_cd_reassurance": reassurance,
        "okb_cd_nuit": nuit,
        "okb_cd_mobilite": mobilite,
        "okb_cd_bercement": bercement,
        "okb_cd_confort": cartes,
        "okb_cd_pliage": pliage,
        "okb_cd_structure": structure,
        "okb_cd_entretien": entretien,
        "okb_cd_specs": specs,
        "okb_cd_accordeons": accordeons,
        "okb_cd_faq": faq,
        "okb_cd_avis_titre": avis_head,
        "okb_cd_avis": avis,
        "product-recommendations": reco,
        "okb_club": S["okb_club_ziThP8"],
    },
    "order": [
        "okb_styles_pr",
        "main",
        "okb_cd_reassurance",
        "okb_cd_nuit",
        "okb_cd_mobilite",
        "okb_cd_bercement",
        "okb_cd_confort",
        "okb_cd_pliage",
        "okb_cd_structure",
        "okb_cd_entretien",
        "okb_cd_specs",
        "okb_cd_accordeons",
        "okb_cd_faq",
        "okb_cd_avis_titre",
        "okb_cd_avis",
        "product-recommendations",
        "okb_club",
    ],
}

out = root / "templates/product.cododo.json"
out.write_text(json.dumps(template, ensure_ascii=False, indent=2) + "\n")
print("écrit :", out.relative_to(root), f"({len(template['order'])} sections)")

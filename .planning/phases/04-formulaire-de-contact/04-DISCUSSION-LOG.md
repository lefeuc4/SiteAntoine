# Phase 4: Formulaire de Contact - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-03
**Phase:** 04-formulaire-de-contact
**Areas discussed:** Page layout, WhatsApp integration, Confirmation UX, Anti-spam

---

## Page Layout

### Structure de la page /contact

| Option | Description | Selected |
|--------|-------------|----------|
| Formulaire + WhatsApp cote a cote | Formulaire a gauche, WhatsApp a droite sur desktop. Empile sur mobile. | |
| Formulaire central seul | Formulaire centre pleine largeur, WhatsApp en dessous. | ✓ |
| Hero + formulaire | Mini hero en haut, puis formulaire et WhatsApp en dessous. | |

**User's choice:** Formulaire central seul
**Notes:** None

### Infos supplementaires

| Option | Description | Selected |
|--------|-------------|----------|
| Juste formulaire + WhatsApp | Page epuree, zero distraction. | |
| Ajouter delai de reponse | Mention type 'Je vous reponds sous 24h'. | |
| Ajouter coordonnees | Email direct, telephone, ville. | |

**User's choice:** Other — ajouter les reseaux sociaux par des icones simples en dessous de la partie WhatsApp
**Notes:** User wants social media icons (not coordinates or response time)

### Reseaux sociaux

| Option | Description | Selected |
|--------|-------------|----------|
| Instagram + Facebook | Les plus courants pour un coach bien-etre. Liens configurables admin. | ✓ |
| Instagram + Facebook + YouTube | Si chaine YouTube existante. | |
| You decide | Claude choisit. | |

**User's choice:** Instagram + Facebook, configurables depuis l'admin
**Notes:** None

---

## WhatsApp Integration

### Mode d'integration

| Option | Description | Selected |
|--------|-------------|----------|
| Lien sur la page contact uniquement | Bouton dans le bloc sous le formulaire. | |
| Bouton flottant sur tout le site | Icone fixe en bas a droite, visible partout. | |
| Les deux | Page contact + bouton flottant. | ✓ |

**User's choice:** Les deux — lien sur page contact ET bouton flottant sur tout le site
**Notes:** None

### Configuration du message

| Option | Description | Selected |
|--------|-------------|----------|
| Oui, configurable | Numero + message editables depuis Global Payload. | ✓ |
| Code en dur | Message et numero fixes dans le code. | |

**User's choice:** Configurable depuis l'admin
**Notes:** None

---

## Confirmation UX

### Apres envoi du formulaire

| Option | Description | Selected |
|--------|-------------|----------|
| Message de succes inline | Formulaire remplace par message 'Merci'. | ✓ |
| Page de confirmation separee | Redirect vers /contact/merci. | |
| You decide | Claude choisit. | |

**User's choice:** Message de succes inline
**Notes:** None

### Email de confirmation au visiteur

| Option | Description | Selected |
|--------|-------------|----------|
| Non, juste le message inline | Seul Antoine recoit l'email. | ✓ |
| Oui, accuse de reception | Visiteur recoit aussi un email. | |

**User's choice:** Non — seul Antoine recoit l'email
**Notes:** None

---

## Anti-spam

### Strategie

| Option | Description | Selected |
|--------|-------------|----------|
| Honeypot seul | Champ invisible. Zero friction. Suffisant pour faible trafic. | ✓ |
| Honeypot + rate limiting | Honeypot + limite par IP. | |
| Honeypot + reCAPTCHA v3 | Honeypot + Google invisible. Dependance Google + RGPD. | |

**User's choice:** Honeypot seul
**Notes:** None

---

## Claude's Discretion

- Design exact du bouton WhatsApp flottant (taille, position, animation)
- Style des icones reseaux sociaux
- Textes placeholder du formulaire et message de succes exact
- Implementation technique du Global Payload

## Deferred Ideas

None — discussion stayed within phase scope

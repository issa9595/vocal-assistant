# Prompt — Refonte du design de l'app Lumia (avec phase de proposition)

> À copier-coller dans Claude Code, à la racine du projet `vocal-assistant`.

---

## 0. Skill de design

Le skill `ui-ux-pro-max` est déjà installé. Garde-le **actif pendant toute la tâche** : génération de design system, guidelines stack (Next.js / React / Tailwind v4), et pre-delivery checklist.

---

## ⚠️ Règle n°1 : tu proposes AVANT de réaliser

**Ne modifie aucun fichier tant que je n'ai pas validé.** Le travail se fait en deux temps :

1. **Phase PROPOSITION** (d'abord) : tu m'analyses l'existant et tu me présentes des **options et recommandations** que je dois approuver.
2. **Phase RÉALISATION** (ensuite, seulement après mon « ok ») : tu implémentes ce que j'ai validé, écran par écran.

Pendant la phase proposition : aucune écriture de code, aucun fichier touché. Tu peux lire les fichiers et lancer le skill, c'est tout. À la fin de la proposition, tu **t'arrêtes et tu attends ma décision**.

---

## 1. Contexte produit

**Lumia** est un assistant **vocal-first** qui réduit la charge mentale : l'utilisateur parle, l'IA comprend, ajoute les rendez-vous au calendrier et anticipe les étapes cachées (courses, préparation, déplacements). Stack : Next.js 16 / React 19 / **Tailwind v4** (thème dans `src/app/globals.css`, pas de `tailwind.config`).

**Périmètre de cette tâche = l'app web uniquement** (pas le site vitrine `src/app/accueil/`) :
- `src/app/app/page.tsx` — dashboard (header sticky, calendrier, sélecteur de vue, FAB IA, modale IA)
- `src/components/` — `DailyCalendar`, `WeekView`, `MonthView`, `YearView`, `ViewSelector`, `AiFabButton`, `AiModal`, `LumiaLogo`, `LumiaMarkLogo`
- `src/components/calendar/` — `EventCard`, `DayEventsSummary`
- `src/components/chat/` — `MessageBubble`, `MicrophoneButton`, `StatusIndicator`, `SuggestionChip` (UI vocale dans la modale)
- `src/app/auth/page.tsx` — connexion / inscription

L'app utilise **déjà** un système visuel abouti **« Liquid Glass + Aurora »** (`.aurora-bg`, `.glass`, `.glass-panel`, `.glass-pink`, `.glass-teal`, `.glass-grain`, `.glass-highlight`). L'objectif n'est donc pas de tout réinventer mais d'**élever et harmoniser** : cohérence, hiérarchie, lisibilité, micro-interactions, ergonomie vocale, responsive.

---

## 2. Charte graphique (source de vérité : `src/app/globals.css`)

N'introduis **aucune** couleur, police, ombre ou radius hors charte. Réutilise les tokens existants.

**Palette Lumia** : blanc `#fdf8f8` (fond) · noir `#3d3d3d` (texte) · rose `#f4b4c8` · saumon `#f6b9ae` · pêche `#fcecd3` · lavande `#c5a6cf` · bleu `#96b6dd` · teal `#9dc0bc`. Dégradé brand `135deg #f4b4c8 → #fcecd3`. Texte accessible `#515151` / `#636363`.

**Typo** : `proxima-nova`, titres `font-bold tracking-tight`, corps `font-light leading-relaxed`.

**Système glass + aurora, animations** (`animate-fade-in-up`, `animate-slide-up`, `animate-pulse-ring`, `aurora-drift`) et utilitaires : déjà définis dans `globals.css`, à réutiliser. Anti-patterns à proscrire : dégradés AI violet/néon, dark mode, animations brusques, ombres dures, emojis-icônes.

---

## 3. Ce que j'attends de la PHASE PROPOSITION

Lis d'abord `globals.css` en entier, puis tous les fichiers du périmètre § 1. Lance le générateur de design system du skill pour cadrer les bonnes pratiques d'un produit vocal/productivité :

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "voice-first AI assistant calendar productivity dashboard" --design-system -p "Lumia" -f markdown
```

Puis présente-moi, en Markdown structuré et **sans toucher au code** :

1. **Audit rapide de l'existant** — ce qui marche, et les faiblesses UX/UI par zone (header, vues calendrier, EventCard, FAB, modale IA, UI vocale, auth, responsive, accessibilité).
2. **2 à 3 directions de design** au choix (ex. « affiner l'existant », « refonte plus marquée des vues calendrier », « repenser l'expérience vocale en premier »), avec pour chacune : intention, ce qui change, effort, risque.
3. **Recommandations zone par zone** : pour chaque composant, ce que tu proposes concrètement (layout, glass à utiliser, hiérarchie, micro-interactions), formulé comme des options que je peux accepter/refuser une par une.
4. **Quick wins vs gros chantiers** clairement séparés.
5. **Questions ouvertes** si quelque chose est ambigu (priorité mobile vs desktop, densité d'information, etc.).

Termine par : *« Dis-moi ce que tu valides et je passe à la réalisation. »* Puis **arrête-toi**.

---

## 4. PHASE RÉALISATION (seulement après mon accord)

- Implémente uniquement ce que j'ai validé, **un écran/composant à la fois**, en me montrant un diff ou un aperçu après chaque pièce significative avant d'enchaîner.
- Réutilise les classes `.glass*`, `.aurora-bg`, les variables `--color-brand-*` plutôt que des valeurs en dur. Tailwind v4 : tout nouveau token/utilitaire va dans `@theme` de `globals.css`.
- **Ne change ni la logique, ni l'état (zustand store), ni les appels Supabase/API, ni les routes.** Refonte visuelle/markup uniquement. Si une amélioration UX impose un changement de logique, propose-le d'abord, ne l'implémente pas d'office.
- Icônes : SVG (Lucide/Heroicons) uniquement, jamais d'emoji.
- Responsive : vérifier 375 / 768 / 1024 / 1440px. Le dashboard est mobile-first (colonne unique) puis desktop.
- Accessibilité : contraste ≥ 4.5:1, focus clavier visibles (`--focus-ring`), `aria-label` conservés, `prefers-reduced-motion` respecté, modale IA navigable au clavier (focus trap, échap pour fermer).
- Soigne particulièrement l'**expérience vocale** (bouton micro, états d'écoute/réflexion/réponse, feedback animé via `animate-pulse-ring`) — c'est le cœur du produit.
- Le build doit rester vert : `npm run build` doit passer.

**Pre-delivery checklist** : pas d'emoji-icônes · `cursor-pointer` sur tout cliquable · transitions 150–300ms · contraste ≥ 4.5:1 · focus visibles · `prefers-reduced-motion` · responsive 375/768/1024/1440 · cohérence glass+aurora.

---

Commence par la **phase proposition** (§ 3). Ne touche à aucun fichier avant ma validation.

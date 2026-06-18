# Prompt — Refonte du design du site vitrine Lumia

> À copier-coller dans Claude Code, à la racine du projet `vocal-assistant`.

---

## 0. Skill de design

Le skill `ui-ux-pro-max` est déjà installé. Garde-le **actif pendant toute la tâche**. Tu t'en serviras pour :
- générer un design system tiré du produit (reasoning engine, styles, palettes, typo, anti-patterns) ;
- valider chaque écran contre sa **pre-delivery checklist** ;
- récupérer les guidelines stack-spécifiques (Next.js / React / Tailwind v4).

---

## 1. Contexte produit

**Lumia** est un assistant **vocal-first** qui réduit la charge mentale : l'utilisateur parle, l'IA comprend, ajoute les rendez-vous au calendrier et anticipe les étapes cachées (courses, préparation, déplacements). Le projet est un Next.js 16 / React 19 / **Tailwind v4** (config dans `src/app/globals.css`, pas de `tailwind.config`).

Le repo contient deux surfaces :
- **L'appli web** : `src/app/app/` + `src/components/` (calendrier + assistant IA). Elle utilise déjà un système visuel abouti **« Liquid Glass + Aurora »**.
- **Le site vitrine / landing** : `src/app/accueil/` avec des sections modulaires dans `src/app/accueil/_sections/`.

**Problème** : le site vitrine est resté en aplat simple (fond plat, dégradé de texte basique, cartes basiques) alors que l'appli a évolué vers le liquid glass + aurora. Les deux ne sont plus cohérents.

**Objectif** : refondre le design du **site vitrine uniquement** pour qu'il soit visuellement et émotionnellement cohérent avec l'appli web, en respectant à 100 % la charte graphique Lumia. **Niveau de refonte : refonte cohérente** — tu peux repenser la mise en page et les composants de chaque section avec plus d'ambition, mais tu restes strictement dans la charte et dans le langage visuel de l'app. Ne touche pas à l'appli (`src/app/app/`, `src/components/`) ni à la logique métier.

---

## 2. Charte graphique (source de vérité : `src/app/globals.css`)

N'introduis **aucune** couleur, police, ombre ou radius hors charte. Réutilise les tokens CSS existants plutôt que des valeurs en dur.

**Palette Lumia**
- Blanc `--color-brand-white` `#fdf8f8` (fond) · Noir `--color-brand-black` `#3d3d3d` (texte)
- Rose `#f4b4c8` · Saumon `#f6b9ae` · Pêche `#fcecd3` · Lavande `#c5a6cf` · Bleu `#96b6dd` · Teal `#9dc0bc`
- Dégradé brand : `linear-gradient(135deg, #f4b4c8 0%, #fcecd3 100%)`
- Texte secondaire accessible `#515151`, muted accessible `#636363`

**Typographie** : `proxima-nova` (sans-serif), fallback Helvetica Neue / system-ui. Titres en `font-bold tracking-tight leading-[1.1]`, corps en `font-light leading-relaxed`.

**Système Liquid Glass + Aurora (déjà défini, à réutiliser)** :
- `.aurora-bg` — fond aurore boréale multi-radiale (rose/lavande/bleu/teal/saumon)
- `.glass`, `.glass-panel` — surfaces translucides (backdrop-blur + saturate + ombres douces + reflet interne)
- `.glass-pink`, `.glass-teal` — variantes teintées
- `.glass-grain` (grain subtil), `.glass-highlight` (reflet spéculaire haut)
- Utilitaires landing : `.landing-card`, `.landing-gradient-text`, `.landing-muted`, `.landing-subtle`, `.landing-link`
- Animations : `animate-fade-in-up`, `animate-slide-up`, `animate-pulse-ring`, `aurora-drift`

**Radius** : généreux et arrondis (`rounded-full` pour CTA, `rounded-2xl`/`1rem` pour cartes).
**Focus** : `outline: 3px solid var(--focus-ring)` — ne pas casser l'accessibilité clavier.

---

## 3. Style cible (à confirmer via le skill)

Le produit est un assistant vocal, apaisant, premium et bienveillant. Lance le générateur de design system du skill pour cadrer la direction, puis aligne-toi sur l'app :

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "voice-first AI assistant calming premium productivity" --design-system --persist -p "Lumia" -f markdown
```

Direction attendue (styles du skill) : **Soft UI Evolution / Liquid Glass / Aurora UI / Organic-Biophilic / Voice-First Multimodal**. Mood : doux, organique, lumineux, sans agressivité.

**Anti-patterns à proscrire** : dégradés AI violet/néon génériques, dark mode, animations brusques, ombres dures, coins droits secs, contrastes criards, emojis utilisés comme icônes.

Persiste le résultat dans `design-system/MASTER.md` pour les sessions suivantes, en y consignant la charte Lumia ci-dessus comme source de vérité (les tokens de `globals.css` priment sur toute reco du skill en cas de conflit).

---

## 4. Périmètre : sections à refondre

Toutes dans `src/app/accueil/_sections/`. Conserve la structure narrative et le contenu FR existant, mais repense layout, hiérarchie et composants pour chacune :

1. `Header.tsx` — sticky, passer en `.glass-panel` (header translucide cohérent avec l'app)
2. `Hero.tsx` — hero immersif voice-first sur `.aurora-bg`, titre + dégradé brand, CTA `→ /app`, idéalement un visuel/preview en glass
3. `ProblemMentalLoad.tsx` — la charge mentale
4. `WhatLumiaDoes.tsx` — ce que fait Lumia
5. `AgentNotChat.tsx` — agent, pas un chat
6. `Benefits.tsx` — bénéfices concrets (cartes en glass)
7. `HowItWorks.tsx` — étapes (ancre `#comment-ca-marche`)
8. `ForWho.tsx` — pour qui
9. `DataAndImpact.tsx` — données & impact
10. `FinalCTA.tsx` — CTA final
11. `Footer.tsx`

L'orchestration reste dans `src/app/accueil/page.tsx`.

---

## 5. Contraintes techniques

- **Tailwind v4** : pas de `tailwind.config.js`. Le thème vit dans `@theme` de `globals.css`. Si tu ajoutes des tokens/utilitaires, fais-le là.
- **Réutilise** les classes `.glass*`, `.aurora-bg`, `.landing-*` et les variables `--color-brand-*` plutôt que des valeurs en dur.
- **Icônes** : SVG uniquement (Lucide ou Heroicons), jamais d'emoji. Vérifie d'abord si une lib d'icônes est déjà installée (`package.json`) ; sinon, propose-la ou inline les SVG.
- **Responsive** : mobile-first, vérifier à 375px, 768px, 1024px, 1440px.
- **Accessibilité** : contraste texte ≥ 4.5:1 (utilise les variantes `-accessible`), focus visibles, `prefers-reduced-motion` respecté, structure de titres sémantique.
- **Interactions** : `cursor-pointer` sur tout élément cliquable, transitions douces 150–300ms, hover states subtils.
- Ne modifie **ni** la logique, **ni** les routes, **ni** l'appli web. Refonte purement visuelle/markup du dossier `_sections/`.
- Le build doit rester vert : `npm run build` doit passer après la refonte.

---

## 6. Déroulé attendu

1. Lis `src/app/globals.css` en entier + parcours `src/app/app/page.tsx` et `src/components/` pour t'imprégner du langage visuel de l'app (glass, aurora, espacements, rythme).
2. Génère et persiste le design system via le skill (commande § 3).
3. Lis chaque section de `_sections/` pour comprendre le contenu actuel.
4. Refonds section par section, en commençant par `Header` + `Hero`, puis le reste. Montre-moi un aperçu/diff après le Hero avant de continuer.
5. Lance la **pre-delivery checklist** du skill et corrige.
6. `npm run build` pour valider, puis résume les changements.

**Pre-delivery checklist (rappel)** : pas d'emoji-icônes · `cursor-pointer` partout · hover transitions 150–300ms · contraste ≥ 4.5:1 · focus clavier visibles · `prefers-reduced-motion` respecté · responsive 375/768/1024/1440 · cohérence glass+aurora avec l'app.

Commence par l'étape 1.

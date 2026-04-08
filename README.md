# Simulateur impôt non-résidents

Prototype HTML pour tests utilisateurs et accessibilité. Deux variantes de formulaire à comparer.
⚠️ Attention ce simulateur n'est pas fonctionnel pour les calculs de l'imposition. Ceci est uniquement un prototype de tests UX.

## Installation

```bash
npm install
```

## Lancer

```bash
npm start
# → http://localhost:3000/src/
```

Cliquer sur le logo Marianne dans le header du site permet de retourner à la proposition entre les deux variantes A et B.

## Structure

```
src/
├── index.html          # Accueil — choix de variante
├── variant-a/          # Variante A du formulaire
├── variant-b/          # Variante B du formulaire
└── shared/base.html    # Fragments en-tête / pied de page
```

/**
 * Accesseurs centralisés pour l'état global du formulaire.
 * Les modules de formulaire importent d'ici plutôt que d'interroger le DOM directement,
 * ce qui isole les dépendances inter-formulaires en un seul endroit.
 */

export const getSituationFamiliale = () =>
  document.querySelector('input[name="situation-familiale"]:checked')?.value ?? null;

export const estMariagePacs = () => getSituationFamiliale() === 'mariage-pacs';

export const estCelibatOuDivorce = () => getSituationFamiliale() === 'celibat-divorce';

// Au moins un bien foncier a été ajouté (indépendamment de la validation finale
// du hub) : c'est ce qui détermine s'il y a des revenus fonciers à ventiler
// pour la CSG-CRDS.
export const hasFonciersOuverts = () =>
  document.querySelectorAll('.sim-tuile-ouvert[data-tile="fonciersBien"]').length > 0;

// Scopé à #vue-ensemble : le résumé partiel du hub réutilise le même
// data-tile="fonciers" pour son propre bouton Modifier.
function valeursGeneralFonciers() {
  const panelB = document.querySelector('#vue-ensemble .sim-tuile-wrapper[data-tile="fonciers"] .sim-tuile-ouvert--b');
  if (!panelB?.dataset.formValues) return {};
  return JSON.parse(panelB.dataset.formValues);
}

export const estFonciersRegimeReel = () =>
  valeursGeneralFonciers()['fo-regime'] === 'oui';

// Au moins un logement en location meublée a été ajouté (indépendamment de la
// validation finale du hub) : c'est ce qui détermine s'il y a des revenus
// de locations meublées à ventiler pour la CSG-CRDS.
export const hasLocationsMeubleesOuverts = () =>
  document.querySelectorAll('.sim-tuile-ouvert[data-tile="locationsMeubleesLogement"]').length > 0;

// Scopé à #vue-ensemble : le résumé partiel du hub réutilise le même
// data-tile="locationsMeublees" pour son propre bouton Modifier.
function valeursGeneralLocationsMeublees() {
  const panelB = document.querySelector('#vue-ensemble .sim-tuile-wrapper[data-tile="locationsMeublees"] .sim-tuile-ouvert--b');
  if (!panelB?.dataset.formValues) return {};
  return JSON.parse(panelB.dataset.formValues);
}

export const estLocationsMeubleesRegimeReel = () =>
  valeursGeneralLocationsMeublees()['lm-regime'] === 'oui';

export const estLocationsMeubleesCategorieLmnp = () =>
  valeursGeneralLocationsMeublees()['lm-categorie'] === 'lmnp';

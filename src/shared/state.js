/**
 * Accesseurs centralisés pour l'état global du formulaire.
 * Les modules de formulaire importent d'ici plutôt que d'interroger le DOM directement,
 * ce qui isole les dépendances inter-formulaires en un seul endroit.
 */

export const getSituationFamiliale = () =>
  document.querySelector('input[name="situation-familiale"]:checked')?.value ?? null;

export const estMariagePacs = () => getSituationFamiliale() === 'mariage-pacs';

export const estCelibatOuDivorce = () => getSituationFamiliale() === 'celibat-divorce';

export const hasFonciersOuverts = () =>
  !!document.querySelector('.sim-tuile-wrapper[data-tile="fonciers"] .sim-tuile[hidden]');

export const hasLmnpOuverts = () =>
  !!document.querySelector('.sim-tuile-wrapper[data-tile="lmnp"] .sim-tuile[hidden]');

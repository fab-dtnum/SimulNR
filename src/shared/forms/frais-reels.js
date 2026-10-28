import { initBlurValidation } from '../validation.js';

// ── Messages d'erreur ────────────────────────────────────────────────────────
// Un champ par personne ayant au moins un salaire : les clés (frais-<personne>)
// sont donc ajoutées dynamiquement par init() à chaque génération des lignes.
export const messages = {};

export function template() {
  return /* html */`
    <fieldset class="fr-fieldset" id="frais-groupe" aria-labelledby="frais-groupe-legend">
      <legend class="fr-fieldset__legend fr-text--regular" id="frais-groupe-legend">
        Montant des frais réels
        <span class="fr-hint-text">Indiquez le montant total annuel de l'ensemble des frais pour chaque personne concernée.</span>
      </legend>
      <div class="fr-fieldset__content" data-frais-liste></div>
    </fieldset>
  `;
}

function echapperHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Personnes du foyer dont au moins un salaire a été ajouté (sections visibles
// du hub Salaires : Vous, Conjoint si marié(e)/pacsé(e), Personnes à charge).
function personnesAvecSalaire() {
  return [...document.querySelectorAll('.sim-sous-formulaire[data-tile="salaires"] [data-personne-section]')]
    .filter(section => !section.hidden)
    .filter(section => document.querySelector(
      `.sim-tuile-ouvert[data-tile="salaire"][data-personne="${section.dataset.personneSection}"]`
    ))
    .map(section => ({
      id: section.dataset.personneSection,
      nom: section.querySelector('.sim-entete-personne__nom')?.textContent.trim() || 'Personne à charge',
    }));
}

function ligne({ id, nom }) {
  return /* html */`
    <div class="fr-input-group">
      <label class="fr-label" for="frais-${id}">${echapperHtml(nom)}</label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="frais-${id}" name="frais-${id}"
               min="0" required
               data-resume-label="${echapperHtml(nom)}">
      </div>
    </div>
  `;
}

export function init(container) {
  const liste = container.querySelector('[data-frais-liste]');
  let premiereGeneration = true;

  // Régénère une ligne par personne concernée, en conservant les montants déjà
  // saisis pour celles qui restent.
  function majPersonnes() {
    if (!liste) return;
    const personnes = personnesAvecSalaire();
    const cle = personnes.map(p => `${p.id}:${p.nom}`).join('|');
    if (liste.dataset.cle === cle) return;

    const valeurs = {};
    liste.querySelectorAll('input').forEach(inp => { valeurs[inp.name] = inp.value; });

    liste.innerHTML = personnes.map(ligne).join('');
    liste.dataset.cle = cle;

    personnes.forEach(({ id, nom }) => {
      const name = `frais-${id}`;
      messages[name] = {
        valueMissing: `Veuillez indiquer le montant des frais réels pour ${nom}.`,
      };
      const input = liste.querySelector(`#${name}`);
      if (input && valeurs[name] !== undefined) input.value = valeurs[name];
    });

    // La première génération est couverte par l'initBlurValidation de tiles.js
    // (appelé juste après init) ; les suivantes créent de nouveaux champs.
    if (!premiereGeneration) initBlurValidation(liste, messages);
    premiereGeneration = false;
  }

  majPersonnes();

  // Re-vérifie à chaque réouverture du sous-formulaire (salaires ajoutés ou
  // supprimés entre-temps).
  const panel = container.closest('.sim-sous-formulaire');
  if (panel) {
    new MutationObserver(() => {
      if (!panel.hidden) majPersonnes();
    }).observe(panel, { attributes: true, attributeFilter: ['hidden'] });
  }
}

import { estFonciersRegimeReel } from '../state.js';

// ── Messages d'erreur ────────────────────────────────────────────────────────
export const messages = {
  'fo-bien-nom': {
    valueMissing: 'Veuillez indiquer un nom pour ce bien.',
  },
  'fo-bien-lieu': {
    valueMissing: 'Veuillez indiquer où est situé ce bien.',
  },
  'fo-bien-loyers': {
    valueMissing: 'Le montant des loyers est obligatoire.',
  },
  'fo-bien-charges': {
    valueMissing: 'Le montant des charges déductibles est obligatoire.',
  },
};

export function template() {
  return /* html */`
    <div class="fr-input-group">
      <label class="fr-label" for="fo-bien-nom">
        Nom pour ce bien
        <span class="fr-hint-text">Ce nom permet d'identifier ce bien dans le simulateur.</span>
      </label>
      <input class="fr-input" type="text" id="fo-bien-nom" name="fo-bien-nom" required>
    </div>

    <fieldset class="fr-fieldset" id="fo-bien-lieu" aria-labelledby="fo-bien-lieu-legend"
              data-resume-label="Lieu">
      <legend class="fr-fieldset__legend fr-text--regular" id="fo-bien-lieu-legend">
        Où est situé ce bien ?
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-radio-group">
          <input type="radio" id="fo-bien-lieu-france" name="fo-bien-lieu" value="france"
                 data-resume-value="En France" required>
          <label class="fr-label" for="fo-bien-lieu-france">En France</label>
        </div>
        <div class="fr-radio-group">
          <input type="radio" id="fo-bien-lieu-horsfrance" name="fo-bien-lieu" value="hors-france"
                 data-resume-value="Hors de France">
          <label class="fr-label" for="fo-bien-lieu-horsfrance">Hors de France</label>
        </div>
      </div>
    </fieldset>

    <div class="fr-input-group">
      <label class="fr-label" for="fo-bien-loyers">
        Montant brut des loyers pour ce bien, hors charges locatives
        <span class="fr-hint-text">Indiquez le montant total sur l'année. Exemple : 6000</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="fo-bien-loyers" name="fo-bien-loyers"
               min="0" required
               data-resume-label="Loyers bruts">
      </div>
    </div>

    <!-- Champs affichés uniquement si le régime réel a été choisi à l'étape Général -->
    <div class="fr-input-group" data-fo-bien-regime-field hidden>
      <label class="fr-label" for="fo-bien-travaux">
        Montant des dépenses des travaux de rénovation énergétique, permettant à un logement de passer d'une classe énergétique E, F ou G, à une classe A, B, C ou D, payés en 2025 <em>(optionnel)</em>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="fo-bien-travaux" name="fo-bien-travaux"
               min="0"
               data-resume-label="Travaux de rénovation énergétique">
      </div>
    </div>

    <div class="fr-input-group" data-fo-bien-regime-field hidden>
      <label class="fr-label" for="fo-bien-charges">
        Montant de vos charges déductibles pour ce bien, hors intérêts d'emprunt
        <span class="fr-hint-text">Indiquez le montant total sur l'année, en incluant les éventuelles dépenses des travaux de rénovation énergétique. Exemple : 4000</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="fo-bien-charges" name="fo-bien-charges"
               min="0"
               data-resume-label="Charges déductibles" data-required-when-reel>
      </div>
    </div>

    <div class="fr-input-group" data-fo-bien-regime-field hidden>
      <label class="fr-label" for="fo-bien-interets">
        Montant de vos intérêts d'emprunt pour ce bien <em>(optionnel)</em>
        <span class="fr-hint-text">Indiquez le montant total sur l'année. Exemple : 2500</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="fo-bien-interets" name="fo-bien-interets"
               min="0"
               data-resume-label="Intérêts d'emprunt">
      </div>
    </div>

    <div class="fr-checkbox-group">
      <input type="checkbox" id="fo-bien-outremer" name="fo-bien-outremer">
      <label class="fr-label" for="fo-bien-outremer">
        Le bien est situé dans un département ou région d'Outre-mer.
        <span class="fr-hint-text">Cochez cette case si cette situation vous concerne.</span>
      </label>
    </div>
  `;
}

export function init(container) {
  const regimeFields = [...container.querySelectorAll('[data-fo-bien-regime-field]')];

  function updateRegime() {
    const isReel = estFonciersRegimeReel();
    regimeFields.forEach(field => {
      field.hidden = !isReel;
      field.querySelectorAll('[data-required-when-reel]').forEach(inp => {
        inp.required = isReel;
      });
    });
  }

  updateRegime();
}

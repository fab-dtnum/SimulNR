// ── Messages d'erreur ────────────────────────────────────────────────────────
export const messages = {
  'fonciers-loyers': {
    valueMissing:   'Le montant des loyers est obligatoire.',
    rangeUnderflow: 'Le montant ne peut pas être négatif.',
  },
  'fonciers-regime': {
    valueMissing: 'Veuillez indiquer si vous avez opté pour le régime réel.',
  },
  'fonciers-travaux': {
    valueMissing: 'Veuillez indiquer si vous avez réalisé des travaux de rénovation énergétique.',
  },
};

export function template() {
  return /* html */`
    <div class="fr-input-group">
      <label class="fr-label" for="fonciers-loyers">
        Montant brut des loyers, hors charges locatives
        <span class="fr-hint-text">Indiquez le montant total sur l'année perçu par votre foyer. Exemple : 7000</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="fonciers-loyers" name="fonciers-loyers"
               min="0"
               data-resume-label="Loyers annuels bruts" required>
      </div>
    </div>

    <fieldset class="fr-fieldset" id="fonciers-regime" aria-labelledby="fonciers-regime-legend"
              data-resume-label="Régime">
      <legend class="fr-fieldset__legend fr-text--regular" id="fonciers-regime-legend">
        Avez-vous opté, ou optez-vous pour le régime réel ?
        <span class="fr-hint-text">C'est-à-dire que vous déduisez vos charges des revenus locatifs.</span>
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-radio-group">
          <input type="radio" id="fonciers-regime-oui" name="fonciers-regime" value="oui" required>
          <label class="fr-label" for="fonciers-regime-oui">Oui</label>
        </div>
        <div class="fr-radio-group">
          <input type="radio" id="fonciers-regime-non" name="fonciers-regime" value="non">
          <label class="fr-label" for="fonciers-regime-non">Non</label>
        </div>
      </div>
    </fieldset>

    <!-- Champs affichés uniquement en régime réel -->
    <div class="fr-input-group" data-fonciers-regime-field hidden>
      <label class="fr-label" for="fonciers-charges">
        Montant de vos charges déductibles, hors intérêts d'emprunt
        <span class="fr-hint-text">Indiquez le montant total sur l'année. Exemple : 4000</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="fonciers-charges" name="fonciers-charges"
               min="0"
               data-resume-label="Charges déductibles">
      </div>
    </div>

    <div class="fr-input-group" data-fonciers-regime-field hidden>
      <label class="fr-label" for="fonciers-interets">
        Montant de vos intérêts d'emprunt
        <span class="fr-hint-text">Indiquez le montant total sur l'année. Exemple : 2500</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="fonciers-interets" name="fonciers-interets"
               min="0"
               data-resume-label="Intérêts d'emprunt">
      </div>
    </div>

    <fieldset class="fr-fieldset" id="fonciers-travaux" aria-labelledby="fonciers-travaux-legend"
              data-resume-label="Travaux de rénovation énergétique"
              data-fonciers-regime-field hidden>
      <legend class="fr-fieldset__legend fr-text--regular" id="fonciers-travaux-legend">
        Avez-vous réalisé des travaux de rénovation énergétique, permettant à un logement de passer d'une classe énergétique E, F ou G, à une classe A, B, C ou D, payés entre 2023 et 2025 ?
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-radio-group">
          <input type="radio" id="fonciers-travaux-oui" name="fonciers-travaux" value="oui"
                 data-required-when-reel>
          <label class="fr-label" for="fonciers-travaux-oui">Oui</label>
        </div>
        <div class="fr-radio-group">
          <input type="radio" id="fonciers-travaux-non" name="fonciers-travaux" value="non">
          <label class="fr-label" for="fonciers-travaux-non">Non</label>
        </div>
      </div>
    </fieldset>

    <div class="fr-input-group">
      <label class="fr-label" for="fonciers-deficits">
        Si vous en avez, quel est le montant des <strong>déficits fonciers</strong> restants des années précédentes ? (optionnel)
        <span class="fr-hint-text">Les déficits restants des années précédentes sont indiqués à la fin de votre dernier avis d'imposition. Si les déficits concernent plusieurs années sur votre avis d'imposition, additionnez-les et indiquez le total. Exemple : 1500</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="fonciers-deficits" name="fonciers-deficits"
               min="0"
               data-resume-label="Déficits fonciers">
      </div>
    </div>
  `;
}

export function init(container) {
  const regimeFieldset = container.querySelector('[name="fonciers-regime"]')?.closest('fieldset');
  if (!regimeFieldset) return;

  regimeFieldset.addEventListener('change', (e) => {
    const isReel = e.target.value === 'oui';
    container.querySelectorAll('[data-fonciers-regime-field]').forEach((field) => {
      field.hidden = !isReel;
      field.querySelectorAll('[data-required-when-reel]').forEach((inp) => {
        inp.required = isReel;
      });
    });
  });
}

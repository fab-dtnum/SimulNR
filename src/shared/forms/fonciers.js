export const messages = {
  'fonciers-loyers': {
    valueMissing:   'Le montant des loyers est obligatoire.',
    rangeUnderflow: 'Le montant ne peut pas être négatif.',
  },
  'fonciers-regime': {
    valueMissing: 'Veuillez indiquer si vous êtes au régime réel.',
  },
  'fonciers-travaux': {
    valueMissing: 'Veuillez indiquer si vous avez réalisé des travaux de rénovation énergétique.',
  },
};

export function template() {
  return /* html */`
    <div class="fr-input-group">
      <label class="fr-label" for="fonciers-loyers">
        Montant annuel brut des loyers
        <span class="fr-hint-text">En euros. Loyers perçus par votre foyer, hors charges locatives.</span>
      </label>
      <input class="fr-input" type="number" id="fonciers-loyers" name="fonciers-loyers"
             min="0" placeholder="Ex : 12 000"
             data-resume-label="Loyers annuels bruts" required>
    </div>

    <fieldset class="fr-fieldset" id="fonciers-regime" aria-labelledby="fonciers-regime-legend"
              data-resume-label="Régime">
      <legend class="fr-fieldset__legend fr-text--regular" id="fonciers-regime-legend">
        Avez-vous opté pour le régime réel ?
        <span class="fr-hint-text">C'est-à-dire que vous déduisez vos charges des revenus locatifs.</span>
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-radio-group">
          <input type="radio" id="fonciers-regime-oui" name="fonciers-regime" value="oui" required>
          <label class="fr-label" for="fonciers-regime-oui">Oui — régime réel</label>
        </div>
        <div class="fr-radio-group">
          <input type="radio" id="fonciers-regime-non" name="fonciers-regime" value="non">
          <label class="fr-label" for="fonciers-regime-non">Non — régime micro</label>
        </div>
      </div>
    </fieldset>

    <!-- Champs affichés uniquement en régime réel -->
    <div class="fr-input-group" data-fonciers-regime-field hidden>
      <label class="fr-label" for="fonciers-charges">
        Charges déductibles annuelles
        <span class="fr-hint-text">En euros. Hors intérêts d'emprunt.</span>
      </label>
      <input class="fr-input" type="number" id="fonciers-charges" name="fonciers-charges"
             min="0" placeholder="Ex : 3 000"
             data-resume-label="Charges déductibles annuelles">
    </div>

    <div class="fr-input-group" data-fonciers-regime-field hidden>
      <label class="fr-label" for="fonciers-interets">
        Intérêts d'emprunt annuels
        <span class="fr-hint-text">En euros</span>
      </label>
      <input class="fr-input" type="number" id="fonciers-interets" name="fonciers-interets"
             min="0" placeholder="Ex : 6 400"
             data-resume-label="Intérêts d'emprunt annuels">
    </div>

    <fieldset class="fr-fieldset" id="fonciers-travaux" aria-labelledby="fonciers-travaux-legend"
              data-resume-label="Travaux de rénovation énergétique"
              data-fonciers-regime-field hidden>
      <legend class="fr-fieldset__legend fr-text--regular" id="fonciers-travaux-legend">
        Avez-vous réalisé des travaux de rénovation énergétique ?
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
        Déficits fonciers des années antérieures
        <span class="fr-hint-text">Facultatif. En euros.</span>
      </label>
      <input class="fr-input" type="number" id="fonciers-deficits" name="fonciers-deficits"
             min="0" placeholder="Ex : 1 500">
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

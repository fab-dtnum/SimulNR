// ── Messages d'erreur ────────────────────────────────────────────────────────
export const messages = {
  'pe-nom': {
    valueMissing: 'Veuillez indiquer un nom pour cette pension.',
  },
  'pe-lieu-imposition': {
    valueMissing: 'Veuillez indiquer où est imposée cette pension.',
  },
  'pe-montant': {
    valueMissing: 'Le montant de la pension est obligatoire.',
  },
  'pe-retenue': {
    valueMissing: 'Le montant de la retenue à la source est obligatoire.',
  },
};

export function template() {
  return /* html */`
    <div class="fr-input-group">
      <label class="fr-label" for="pe-nom">
        Nom pour cette pension
        <span class="fr-hint-text">Ce nom permet d'identifier cette pension dans le simulateur.</span>
      </label>
      <input class="fr-input" type="text" id="pe-nom" name="pe-nom" required>
    </div>

    <fieldset class="fr-fieldset" id="pe-lieu-imposition" aria-labelledby="pe-lieu-imposition-legend"
              data-resume-label="Imposition">
      <legend class="fr-fieldset__legend fr-text--regular" id="pe-lieu-imposition-legend">
        Où est imposée cette pension ?
        <span class="fr-hint-text">
          Les revenus imposés en France dépendent de la convention fiscale conclue avec votre État de résidence.
          <a href="https://www.impots.gouv.fr/international-particulier/je-suis-non-residents-quels-sont-les-principaux-revenus-declarer"
             class="fr-link fr-link--sm" target="_blank" rel="noopener noreferrer">Connaitre les revenus imposés en France<span class="fr-sr-only"> (nouvelle fenêtre)</span></a>
        </span>
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-radio-group">
          <input type="radio" id="pe-lieu-imposition-france" name="pe-lieu-imposition" value="france"
                 data-resume-value="En France" required>
          <label class="fr-label" for="pe-lieu-imposition-france">En France</label>
        </div>
        <div class="fr-radio-group">
          <input type="radio" id="pe-lieu-imposition-horsfrance" name="pe-lieu-imposition" value="hors-france"
                 data-resume-value="Hors de France">
          <label class="fr-label" for="pe-lieu-imposition-horsfrance">Hors de France</label>
        </div>
      </div>
    </fieldset>

    <div class="fr-input-group">
      <label class="fr-label" for="pe-montant">
        Montant de la pension
        <span class="fr-hint-text">Indiquez le montant total perçu dans l'année pour cette pension. Exemple : 23000</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="pe-montant" name="pe-montant"
               min="0" required
               data-resume-label="Montant">
      </div>
    </div>

    <!-- Champs affichés uniquement si la pension est imposée en France -->
    <div class="fr-input-group" data-pe-france-field hidden>
      <label class="fr-label" for="pe-retenue">
        Montant de la retenue à la source
        <span class="fr-hint-text">Lorsqu'il y a un prélèvement de retenue à la source, elle est indiquée sur votre bulletin de pension. Indiquer le montant pour l'année. Exemple : 800</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="pe-retenue" name="pe-retenue"
               min="0"
               data-resume-label="Retenue à la source">
      </div>
      <div class="fr-messages-group">
        <p class="fr-message fr-message--info">En l'absence de prélèvement de retenue à la source sur votre pension, indiquer 0.</p>
      </div>
    </div>

    <hr class="fr-hr">

    <div class="fr-checkbox-group sim-checkbox-group--espacee" data-pe-france-field hidden>
      <input type="checkbox" id="pe-polynesie" name="pe-polynesie">
      <label class="fr-label" for="pe-polynesie">
        Vous résidez en Polynésie française ou à Wallis et Futuna.
        <span class="fr-hint-text">Cochez cette case si cette situation vous concerne.</span>
      </label>
    </div>

    <hr class="fr-hr">
  `;
}

export function init(container) {
  const lieuInputs = [...container.querySelectorAll('input[name="pe-lieu-imposition"]')];
  const franceFields = [...container.querySelectorAll('[data-pe-france-field]')];
  const retenueInput = container.querySelector('#pe-retenue');

  function updateLieu() {
    const estFrance = lieuInputs.find(inp => inp.checked)?.value === 'france';
    franceFields.forEach(field => { field.hidden = !estFrance; });
    if (retenueInput) retenueInput.required = estFrance;
  }

  lieuInputs.forEach(inp => inp.addEventListener('change', updateLieu));
  updateLieu();
}

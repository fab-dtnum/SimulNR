// ── Messages d'erreur ────────────────────────────────────────────────────────
export const messages = {
  'pe-nom': {
    valueMissing: 'Veuillez indiquer un nom pour cette pension ou cette rente viagère.',
  },
  'pe-rente-viagere': {
    valueMissing: 'Veuillez indiquer s\'il s\'agit d\'une rente viagère à titre onéreux.',
  },
  'pe-lieu-imposition': {
    valueMissing: 'Veuillez indiquer où est imposée cette pension ou cette rente viagère.',
  },
  'pe-rente-annee': {
    valueMissing: 'Veuillez indiquer la première année de versement de la rente viagère.',
  },
  'pe-montant': {
    valueMissing: 'Le montant de la pension ou de la rente viagère est obligatoire.',
  },
  'pe-retenue': {
    valueMissing: 'Le montant de la retenue à la source est obligatoire.',
  },
};

export function template() {
  return /* html */`
    <div class="fr-input-group">
      <label class="fr-label" for="pe-nom">
        Nom pour cette pension ou cette rente viagère
        <span class="fr-hint-text">Ce nom permet d'identifier cette pension ou cette rente dans le simulateur.</span>
      </label>
      <input class="fr-input" type="text" id="pe-nom" name="pe-nom" required>
    </div>

    <div class="sim-champ-avec-infobulle">
      <fieldset class="fr-fieldset" id="pe-rente-viagere" aria-labelledby="pe-rente-viagere-legend">
        <legend class="fr-fieldset__legend fr-text--regular" id="pe-rente-viagere-legend">
          Est-ce une rente viagère à titre onéreux ?
        </legend>
        <div class="fr-fieldset__content">
          <div class="fr-radio-group">
            <input type="radio" id="pe-rente-viagere-oui" name="pe-rente-viagere" value="oui" required>
            <label class="fr-label" for="pe-rente-viagere-oui">Oui</label>
          </div>
          <div class="fr-radio-group">
            <input type="radio" id="pe-rente-viagere-non" name="pe-rente-viagere" value="non">
            <label class="fr-label" for="pe-rente-viagere-non">Non</label>
          </div>
        </div>
      </fieldset>
      <button class="fr-btn fr-btn--tooltip" id="pe-rente-viagere-btn" aria-describedby="pe-rente-viagere-tooltip" type="button">
        Informations sur la rente viagère à titre onéreux
      </button>
      <span class="fr-tooltip fr-placement" id="pe-rente-viagere-tooltip" role="tooltip">
        Une rente viagère à titre onéreux est un revenu régulier versé en contrepartie de la vente d'un bien (un logement par exemple) ou d'un capital. Le versement, effectué pendant toute la durée de la vie du bénéficiaire de la rente, s'interrompt à son décès.
      </span>
    </div>

    <fieldset class="fr-fieldset" id="pe-lieu-imposition" aria-labelledby="pe-lieu-imposition-legend"
              data-resume-label="Imposition">
      <legend class="fr-fieldset__legend fr-text--regular" id="pe-lieu-imposition-legend">
        Où est imposée cette pension ou cette rente viagère ?
        <span class="fr-hint-text">
          Les revenus imposés en France dépendent de la convention fiscale conclue avec votre État de résidence.
          <a href="https://www.impots.gouv.fr/international-particulier/je-suis-non-residents-quels-sont-les-principaux-revenus-declarer"
              target="_blank" rel="noopener noreferrer">Connaitre les revenus imposés en France<span class="fr-sr-only"> (nouvelle fenêtre)</span></a>
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

    <!-- Champ affiché uniquement si rente viagère imposée en France -->
    <div class="fr-input-group" data-pe-rente-field hidden>
      <label class="fr-label" for="pe-rente-annee">
        Première année de versement de la rente viagère
        <span class="fr-hint-text">Exemple : 2024</span>
      </label>
      <input class="fr-input" type="number" id="pe-rente-annee" name="pe-rente-annee"
             min="1900" max="2026"
             data-resume-type="annee" data-resume-label="Depuis">
    </div>

    <div class="fr-input-group">
      <label class="fr-label" for="pe-montant">
        Montant de la pension ou de la rente viagère
        <span class="fr-hint-text">Indiquez le montant total perçu dans l'année. Exemple : 23000</span>
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
        <span class="fr-hint-text">Lorsqu’il y a un prélèvement de retenue à la source, elle est précisée sur votre bulletin de pension ou rente. Dans le cas contraire, indiquez 0. Inscrivez le montant pour l'année. Exemple : 800</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="pe-retenue" name="pe-retenue"
               min="0"
               data-resume-label="Retenue à la source">
      </div>
    </div>

    <!-- Case affichée uniquement pour une pension (hors rente viagère) imposée en France -->
    <hr class="fr-hr" data-pe-pension-field hidden>

    <div class="fr-checkbox-group sim-checkbox-group--espacee" data-pe-pension-field hidden>
      <input type="checkbox" id="pe-polynesie" name="pe-polynesie">
      <label class="fr-label" for="pe-polynesie">
        Vous résidez en Polynésie française ou à Wallis et Futuna.
        <span class="fr-hint-text">Cochez cette case si cette situation vous concerne.</span>
      </label>
    </div>

    <hr class="fr-hr" data-pe-pension-field hidden>
  `;
}

export function init(container) {
  const lieuInputs = [...container.querySelectorAll('input[name="pe-lieu-imposition"]')];
  const renteInputs = [...container.querySelectorAll('input[name="pe-rente-viagere"]')];
  const franceFields = [...container.querySelectorAll('[data-pe-france-field]')];
  const renteFields = [...container.querySelectorAll('[data-pe-rente-field]')];
  const pensionFields = [...container.querySelectorAll('[data-pe-pension-field]')];
  const retenueInput = container.querySelector('#pe-retenue');
  const anneeInput = container.querySelector('#pe-rente-annee');
  const polynesieInput = container.querySelector('#pe-polynesie');

  function update() {
    const estFrance = lieuInputs.find(inp => inp.checked)?.value === 'france';
    const rente = renteInputs.find(inp => inp.checked)?.value;
    const afficherAnnee = estFrance && rente === 'oui';
    const afficherPolynesie = estFrance && rente === 'non';

    franceFields.forEach(field => { field.hidden = !estFrance; });
    renteFields.forEach(field => { field.hidden = !afficherAnnee; });
    pensionFields.forEach(field => { field.hidden = !afficherPolynesie; });

    if (retenueInput) retenueInput.required = estFrance;
    if (anneeInput) anneeInput.required = afficherAnnee;
    // Une case masquée ne doit pas garder une valeur cochée en mémoire.
    if (polynesieInput && !afficherPolynesie) polynesieInput.checked = false;
  }

  [...lieuInputs, ...renteInputs].forEach(inp => inp.addEventListener('change', update));
  update();
}

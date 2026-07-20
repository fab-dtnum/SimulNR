// ── Messages d'erreur ────────────────────────────────────────────────────────
export const messages = {
  'sa-nom': {
    valueMissing: 'Veuillez indiquer un nom pour ce salaire.',
  },
  'sa-lieu-activite': {
    valueMissing: 'Veuillez indiquer où est exercée l\'activité pour ce salaire.',
  },
  'sa-lieu-imposition': {
    valueMissing: 'Veuillez indiquer où est imposé ce salaire.',
  },
  'sa-montant': {
    valueMissing: 'Le montant de la rémunération est obligatoire.',
  },
  'sa-retenue': {
    valueMissing: 'Le montant de la retenue à la source est obligatoire.',
  },
  'sa-date-debut': {
    valueMissing: 'Veuillez indiquer la date de début d\'activité.',
  },
  'sa-date-fin': {
    valueMissing: 'Veuillez indiquer la date de fin d\'activité.',
  },
};

export function template() {
  return /* html */`
    <div class="fr-input-group">
      <label class="fr-label" for="sa-nom">
        Nom pour ce salaire
        <span class="fr-hint-text">Ce nom permet d'identifier ce salaire dans le simulateur.</span>
      </label>
      <input class="fr-input" type="text" id="sa-nom" name="sa-nom" required>
    </div>

    <fieldset class="fr-fieldset" id="sa-lieu-activite" aria-labelledby="sa-lieu-activite-legend"
              data-resume-label="Lieu d'activité">
      <legend class="fr-fieldset__legend fr-text--regular" id="sa-lieu-activite-legend">
        Où est exercée l'activité pour ce salaire ?
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-radio-group">
          <input type="radio" id="sa-lieu-activite-france" name="sa-lieu-activite" value="france"
                 data-resume-value="En France" required>
          <label class="fr-label" for="sa-lieu-activite-france">En France</label>
        </div>
        <div class="fr-radio-group">
          <input type="radio" id="sa-lieu-activite-horsfrance" name="sa-lieu-activite" value="hors-france"
                 data-resume-value="Hors de France">
          <label class="fr-label" for="sa-lieu-activite-horsfrance">Hors de France</label>
        </div>
      </div>
    </fieldset>

    <fieldset class="fr-fieldset" id="sa-lieu-imposition" aria-labelledby="sa-lieu-imposition-legend"
              data-resume-label="Imposition">
      <legend class="fr-fieldset__legend fr-text--regular" id="sa-lieu-imposition-legend">
        Où est imposé ce salaire ?
        <span class="fr-hint-text">
          Les revenus imposés en France dépendent de la convention fiscale conclue avec votre État de résidence.
          <a href="https://www.impots.gouv.fr/international-particulier/je-suis-non-residents-quels-sont-les-principaux-revenus-declarer"
             class="fr-link fr-link--sm" target="_blank" rel="noopener noreferrer">Connaitre les revenus imposés en France<span class="fr-sr-only"> (nouvelle fenêtre)</span></a>
        </span>
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-radio-group">
          <input type="radio" id="sa-lieu-imposition-france" name="sa-lieu-imposition" value="france"
                 data-resume-value="En France" required>
          <label class="fr-label" for="sa-lieu-imposition-france">En France</label>
        </div>
        <div class="fr-radio-group">
          <input type="radio" id="sa-lieu-imposition-horsfrance" name="sa-lieu-imposition" value="hors-france"
                 data-resume-value="Hors de France">
          <label class="fr-label" for="sa-lieu-imposition-horsfrance">Hors de France</label>
        </div>
      </div>
    </fieldset>

    <div class="fr-input-group">
      <label class="fr-label" for="sa-montant">
        Montant de la rémunération
        <span class="fr-hint-text">Indiquez le montant total perçu dans l'année pour cette activité. Exemple : 35000</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="sa-montant" name="sa-montant"
               min="0" required
               data-resume-label="Montant">
      </div>
    </div>

    <div class="fr-input-group">
      <label class="fr-label" for="sa-retenue">
        Montant de la retenue à la source
        <span class="fr-hint-text">Lorsqu'il y a une retenue à la source, elle est indiquée sur votre bulletin de salaire. Indiquer le montant pour l'année. Exemple : 1500.</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="sa-retenue" name="sa-retenue"
               min="0" required
               data-resume-label="Retenue à la source">
      </div>
      <div class="fr-messages-group">
        <p class="fr-message fr-message--info">En l'absence de prélèvement de retenue à la source sur votre salaire, indiquez 0.</p>
      </div>
    </div>

    <hr class="fr-hr">

    <div class="fr-checkbox-group sim-checkbox-group--espacee">
      <input type="checkbox" id="sa-annee-partielle" name="sa-annee-partielle">
      <label class="fr-label" for="sa-annee-partielle">
        L'activité n'est pas exercée toute l'année.
        <span class="fr-hint-text">Cochez cette case si cette situation vous concerne.</span>
      </label>
    </div>

    <div class="sim-double-champs" data-sa-dates hidden>
      <div class="fr-input-group">
        <label class="fr-label" for="sa-date-debut">Date de début d'activité</label>
        <input class="fr-input" type="date" id="sa-date-debut" name="sa-date-debut"
               data-resume-label="Début d'activité">
      </div>
      <div class="fr-input-group">
        <label class="fr-label" for="sa-date-fin">Date de fin d'activité</label>
        <input class="fr-input" type="date" id="sa-date-fin" name="sa-date-fin"
               data-resume-label="Fin d'activité">
      </div>
    </div>

    <hr class="fr-hr">

    <div class="fr-checkbox-group sim-checkbox-group--espacee">
      <input type="checkbox" id="sa-outremer" name="sa-outremer">
      <label class="fr-label" for="sa-outremer">
        L'activité est exercée dans un département ou région d'Outre-mer.
        <span class="fr-hint-text">Cochez cette case si cette situation vous concerne.</span>
      </label>
    </div>

    <hr class="fr-hr">
  `;
}

export function init(container) {
  const checkbox = container.querySelector('#sa-annee-partielle');
  const dates = container.querySelector('[data-sa-dates]');
  const dateInputs = dates?.querySelectorAll('input') ?? [];

  function updateDates() {
    const isPartielle = checkbox?.checked ?? false;
    if (dates) dates.hidden = !isPartielle;
    dateInputs.forEach(inp => { inp.required = isPartielle; });
  }

  checkbox?.addEventListener('change', updateDates);
  updateDates();
}

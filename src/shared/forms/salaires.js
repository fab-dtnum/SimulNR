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
             target="_blank" rel="noopener noreferrer">Connaitre les revenus imposés en France<span class="fr-sr-only"> (nouvelle fenêtre)</span></a>
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

    <!-- Champ affiché uniquement si le salaire est exercé et imposé en France -->
    <div class="fr-input-group" data-sa-france-field hidden>
      <label class="fr-label" for="sa-retenue">
        Montant de la retenue à la source
        <span class="fr-hint-text">Lorsqu’il y a une retenue à la source, elle est précisée sur votre bulletin de salaire. Dans le cas contraire, indiquez 0. Inscrivez le montant pour l'année. Exemple : 1500.</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="sa-retenue" name="sa-retenue"
               min="0"
               data-resume-label="Retenue à la source">
      </div>
    </div>

    <hr class="fr-hr" data-sa-france-field hidden>

    <!-- Groupe affiché uniquement si le salaire est exercé et imposé en France -->
    <fieldset class="fr-fieldset" id="sa-situation" aria-labelledby="sa-situation-legend" data-sa-france-field hidden>
      <legend class="fr-fieldset__legend fr-text--regular" id="sa-situation-legend">
        Cochez la case ou les cases qui correspondent à votre situation : (optionnel)
      </legend>
      <div class="fr-fieldset__element">
        <div class="fr-checkbox-group">
          <input type="checkbox" id="sa-annee-partielle" name="sa-annee-partielle">
          <label class="fr-label" for="sa-annee-partielle">L'activité n'est pas exercée toute l'année.</label>
        </div>
      </div>
      <div class="fr-fieldset__element">
        <div class="fr-checkbox-group">
          <input type="checkbox" id="sa-gerant" name="sa-gerant">
          <label class="fr-label" for="sa-gerant">Vous êtes gérant majoritaire de la société qui vous verse cette rémunération.</label>
        </div>
      </div>
      <div class="fr-fieldset__element">
        <div class="sim-champ-avec-infobulle">
          <div class="fr-checkbox-group">
            <input type="checkbox" id="sa-artiste" name="sa-artiste">
            <label class="fr-label" for="sa-artiste">L'activité correspond à une activité d'artiste.</label>
          </div>
          <button class="fr-btn fr-btn--tooltip" id="sa-artiste-btn" aria-describedby="sa-artiste-tooltip" type="button">
            Informations sur les activités d'artiste
          </button>
          <span class="fr-tooltip fr-placement" id="sa-artiste-tooltip" role="tooltip">
            Par artistes, il convient d'entendre notamment les acteurs de cinéma, les artistes lyriques, les artistes dramatiques, les artistes chorégraphiques, les artistes de variété, les musiciens-interprètes, les chansonniers, les artistes de complément, les chefs d’orchestre, les arrangeurs-orchestrateurs et, pour l’exécution matérielle de leur conception artistique, les metteurs en scène, etc.<br><br>
            Les artistes plasticiens dont les œuvres sont normalement destinées à la vente (peintres, sculpteurs, etc.) ne sont pas concernés. Leurs revenus relèvent des dispositions relatives aux professions libérales (revenus BNC).
          </span>
        </div>
      </div>
      <div class="fr-fieldset__element">
        <div class="sim-champ-avec-infobulle">
          <div class="fr-checkbox-group">
            <input type="checkbox" id="sa-sportif" name="sa-sportif">
            <label class="fr-label" for="sa-sportif">L'activité correspond à une activité sportive.</label>
          </div>
          <button class="fr-btn fr-btn--tooltip" id="sa-sportif-btn" aria-describedby="sa-sportif-tooltip" type="button">
            Informations sur les activités sportives
          </button>
          <span class="fr-tooltip fr-placement" id="sa-sportif-tooltip" role="tooltip">
            Le terme d'activités sportives est entendu au sens large : athlètes (course, saut, lancer, etc.) et autres sportifs tels que les joueurs de football, de golf, de tennis, les jockeys, les boxeurs, les coureurs cyclistes et les pilotes de course.
          </span>
        </div>
      </div>
      <div class="fr-fieldset__element">
        <div class="fr-checkbox-group">
          <input type="checkbox" id="sa-outremer" name="sa-outremer">
          <label class="fr-label" for="sa-outremer">L'activité est exercée dans un département ou région d'Outre-mer.</label>
        </div>
      </div>
    </fieldset>

    <div data-sa-dates hidden>
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
  `;
}

export function init(container) {
  const checkbox = container.querySelector('#sa-annee-partielle');
  const dates = container.querySelector('[data-sa-dates]');
  const dateInputs = dates?.querySelectorAll('input') ?? [];

  const activiteInputs = [...container.querySelectorAll('input[name="sa-lieu-activite"]')];
  const impositionInputs = [...container.querySelectorAll('input[name="sa-lieu-imposition"]')];
  const franceFields = [...container.querySelectorAll('[data-sa-france-field]')];
  const retenueInput = container.querySelector('#sa-retenue');

  function estFrance() {
    const estActiviteFrance = activiteInputs.find(inp => inp.checked)?.value === 'france';
    const estImpositionFrance = impositionInputs.find(inp => inp.checked)?.value === 'france';
    return estActiviteFrance && estImpositionFrance;
  }

  function update() {
    const france = estFrance();
    franceFields.forEach(field => { field.hidden = !france; });
    if (retenueInput) retenueInput.required = france;

    const isPartielle = france && (checkbox?.checked ?? false);
    if (dates) dates.hidden = !isPartielle;
    dateInputs.forEach(inp => { inp.required = isPartielle; });
  }

  activiteInputs.forEach(inp => inp.addEventListener('change', update));
  impositionInputs.forEach(inp => inp.addEventListener('change', update));
  checkbox?.addEventListener('change', update);
  update();
}

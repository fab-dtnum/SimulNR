import { estBncDeclarationControlee } from '../state.js';

// ── Messages d'erreur ────────────────────────────────────────────────────────
export const messages = {
  'bnc-act-nom': {
    valueMissing: 'Veuillez indiquer un nom pour cette activité.',
  },
  'bnc-act-lieu': {
    valueMissing: 'Veuillez indiquer où est imposée cette activité.',
  },
  'bnc-act-recettes': {
    valueMissing: 'Le montant des recettes est obligatoire.',
  },
  'bnc-act-charges': {
    valueMissing: 'Le montant des charges déductibles est obligatoire.',
  },
};

export function template() {
  return /* html */`
    <div class="fr-input-group">
      <label class="fr-label" for="bnc-act-nom">
        Nom pour cette activité
        <span class="fr-hint-text">Ce nom permet d'identifier cette activité dans le simulateur.</span>
      </label>
      <input class="fr-input" type="text" id="bnc-act-nom" name="bnc-act-nom" required>
    </div>

    <fieldset class="fr-fieldset" id="bnc-act-lieu" aria-labelledby="bnc-act-lieu-legend"
              data-resume-label="Imposition">
      <legend class="fr-fieldset__legend fr-text--regular" id="bnc-act-lieu-legend">
        Où est imposée cette activité ?
        <span class="fr-hint-text">
          Les revenus imposés en France dépendent de la convention fiscale conclue avec votre État de résidence.
          <a href="https://www.impots.gouv.fr/international-particulier/je-suis-non-residents-quels-sont-les-principaux-revenus-declarer"
             target="_blank" rel="noopener noreferrer">Connaitre les revenus imposés en France<span class="fr-sr-only"> (nouvelle fenêtre)</span></a>
        </span>
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-radio-group">
          <input type="radio" id="bnc-act-lieu-france" name="bnc-act-lieu" value="france"
                 data-resume-value="En France" required>
          <label class="fr-label" for="bnc-act-lieu-france">En France</label>
        </div>
        <div class="fr-radio-group">
          <input type="radio" id="bnc-act-lieu-horsfrance" name="bnc-act-lieu" value="hors-france"
                 data-resume-value="Hors de France">
          <label class="fr-label" for="bnc-act-lieu-horsfrance">Hors de France</label>
        </div>
      </div>
    </fieldset>

    <div class="fr-input-group">
      <label class="fr-label" for="bnc-act-recettes">
        Montant des recettes pour cette activité
        <span class="fr-hint-text">Indiquez le montant total perçu dans l'année pour cette activité. Exemple : 23000</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="bnc-act-recettes" name="bnc-act-recettes"
               min="0" required
               data-resume-label="Recettes">
      </div>
    </div>

    <!-- Champ affiché uniquement si déclaration contrôlée -->
    <div class="fr-input-group" data-bnc-controlee-field hidden>
      <label class="fr-label" for="bnc-act-charges">
        Montant des charges déductibles pour cette activité
        <span class="fr-hint-text">Indiquez le montant total sur l'année. Exemple : 3000</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="bnc-act-charges" name="bnc-act-charges"
               min="0"
               data-resume-label="Charges déductibles">
      </div>
    </div>

    <!-- Groupe affiché uniquement si l'activité est imposée en France -->
    <fieldset class="fr-fieldset" id="bnc-act-situation" aria-labelledby="bnc-act-situation-legend" data-bnc-france-field hidden>
      <legend class="fr-fieldset__legend fr-text--regular" id="bnc-act-situation-legend">
        Cochez la case ou les cases qui correspondent à votre situation : (optionnel)
      </legend>
      <div class="fr-fieldset__element">
        <div class="fr-checkbox-group">
          <input type="checkbox" id="bnc-act-gerant" name="bnc-act-gerant">
          <label class="fr-label" for="bnc-act-gerant">Vous êtes gérant majoritaire de la société qui vous verse cette rémunération.</label>
        </div>
      </div>
      <div class="fr-fieldset__element">
        <div class="sim-champ-avec-infobulle">
          <div class="fr-checkbox-group">
            <input type="checkbox" id="bnc-act-artiste" name="bnc-act-artiste">
            <label class="fr-label" for="bnc-act-artiste">L'activité correspond à une activité d'artiste.</label>
          </div>
          <button class="fr-btn fr-btn--tooltip" id="bnc-act-artiste-btn" aria-describedby="bnc-act-artiste-tooltip" type="button">
            Informations sur les activités d'artiste
          </button>
          <span class="fr-tooltip fr-placement" id="bnc-act-artiste-tooltip" role="tooltip">
            Par artistes, il convient d'entendre notamment les acteurs de cinéma, les artistes lyriques, les artistes dramatiques, les artistes chorégraphiques, les artistes de variété, les musiciens-interprètes, les chansonniers, les artistes de complément, les chefs d’orchestre, les arrangeurs-orchestrateurs et, pour l’exécution matérielle de leur conception artistique, les metteurs en scène, etc.<br><br>
            Les artistes plasticiens dont les œuvres sont normalement destinées à la vente (peintres, sculpteurs, etc.) ne sont pas concernés. Leurs revenus relèvent des dispositions relatives aux professions libérales (revenus BNC).
          </span>
        </div>
      </div>
      <div class="fr-fieldset__element">
        <div class="sim-champ-avec-infobulle">
          <div class="fr-checkbox-group">
            <input type="checkbox" id="bnc-act-sportif" name="bnc-act-sportif">
            <label class="fr-label" for="bnc-act-sportif">L'activité correspond à une activité sportive.</label>
          </div>
          <button class="fr-btn fr-btn--tooltip" id="bnc-act-sportif-btn" aria-describedby="bnc-act-sportif-tooltip" type="button">
            Informations sur les activités sportives
          </button>
          <span class="fr-tooltip fr-placement" id="bnc-act-sportif-tooltip" role="tooltip">
            Le terme d'activités sportives est entendu au sens large : athlètes (course, saut, lancer, etc.) et autres sportifs tels que les joueurs de football, de golf, de tennis, les jockeys, les boxeurs, les coureurs cyclistes et les pilotes de course.
          </span>
        </div>
      </div>
      <div class="fr-fieldset__element">
        <div class="fr-checkbox-group">
          <input type="checkbox" id="bnc-act-outremer" name="bnc-act-outremer">
          <label class="fr-label" for="bnc-act-outremer">L'activité est exercée dans un département ou région d'Outre-mer.</label>
        </div>
      </div>
    </fieldset>
  `;
}

export function init(container) {
  const lieuInputs = [...container.querySelectorAll('input[name="bnc-act-lieu"]')];
  const franceFields = [...container.querySelectorAll('[data-bnc-france-field]')];
  const controleeFields = [...container.querySelectorAll('[data-bnc-controlee-field]')];
  const chargesInput = container.querySelector('#bnc-act-charges');

  function update() {
    const estFrance = lieuInputs.find(inp => inp.checked)?.value === 'france';
    const controlee = estBncDeclarationControlee();

    franceFields.forEach(field => {
      field.hidden = !estFrance;
      // Des cases masquées ne doivent pas rester cochées en mémoire.
      if (!estFrance) field.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    });
    controleeFields.forEach(field => { field.hidden = !controlee; });
    if (chargesInput) {
      chargesInput.required = controlee;
      if (!controlee) chargesInput.value = '';
    }
  }

  lieuInputs.forEach(inp => inp.addEventListener('change', update));
  update();

  // Le régime peut avoir été modifié dans le formulaire général depuis la
  // dernière ouverture : on re-vérifie à chaque réaffichage.
  const panel = container.closest('.sim-sous-formulaire');
  if (panel) {
    new MutationObserver(() => {
      if (!panel.hidden) update();
    }).observe(panel, { attributes: true, attributeFilter: ['hidden'] });
  }
}

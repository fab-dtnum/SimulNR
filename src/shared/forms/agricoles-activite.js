import { estAgricolesRegimeReel } from '../state.js';

// ── Messages d'erreur ────────────────────────────────────────────────────────
export const messages = {
  'agri-act-nom': {
    valueMissing: 'Veuillez indiquer un nom pour cette activité.',
  },
  'agri-act-lieu': {
    valueMissing: 'Veuillez indiquer où est imposée cette activité.',
  },
  'agri-act-recettes': {
    valueMissing: 'Le montant des recettes est obligatoire.',
  },
  'agri-act-charges': {
    valueMissing: 'Le montant des charges déductibles est obligatoire.',
  },
  'agri-act-recettes-2025': {
    valueMissing: 'Le montant des recettes 2025 est obligatoire.',
  },
  'agri-act-recettes-2024': {
    valueMissing: 'Le montant des recettes 2024 est obligatoire.',
  },
  'agri-act-recettes-2023': {
    valueMissing: 'Le montant des recettes 2023 est obligatoire.',
  },
};

// Années des recettes demandées en micro-BA (les trois dernières années).
const ANNEES_MICRO = [2025, 2024, 2023];

export function template() {
  return /* html */`
    <div class="fr-input-group">
      <label class="fr-label" for="agri-act-nom">
        Nom pour cette activité
        <span class="fr-hint-text">Ce nom permet d'identifier cette activité dans le simulateur.</span>
      </label>
      <input class="fr-input" type="text" id="agri-act-nom" name="agri-act-nom" required>
    </div>

    <fieldset class="fr-fieldset" id="agri-act-lieu" aria-labelledby="agri-act-lieu-legend"
              data-resume-label="Lieu">
      <legend class="fr-fieldset__legend fr-text--regular" id="agri-act-lieu-legend">
        Où est imposée cette activité ?
        <span class="fr-hint-text">
          Les revenus imposés en France dépendent de la convention fiscale conclue avec votre État de résidence.
          <a href="https://www.impots.gouv.fr/international-particulier/je-suis-non-residents-quels-sont-les-principaux-revenus-declarer"
             target="_blank" rel="noopener noreferrer">Connaitre les revenus imposés en France<span class="fr-sr-only"> (nouvelle fenêtre)</span></a>
        </span>
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-radio-group">
          <input type="radio" id="agri-act-lieu-france" name="agri-act-lieu" value="france"
                 data-resume-value="En France" required>
          <label class="fr-label" for="agri-act-lieu-france">En France</label>
        </div>
        <div class="fr-radio-group">
          <input type="radio" id="agri-act-lieu-horsfrance" name="agri-act-lieu" value="hors-france"
                 data-resume-value="Hors de France">
          <label class="fr-label" for="agri-act-lieu-horsfrance">Hors de France</label>
        </div>
      </div>
    </fieldset>

    <!-- Champs affichés uniquement au régime réel -->
    <div class="fr-input-group" data-agri-reel-field hidden>
      <label class="fr-label" for="agri-act-recettes">
        Montant des recettes pour cette activité
        <span class="fr-hint-text">Indiquez le montant total perçu dans l'année pour cette activité. Exemple : 23000</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="agri-act-recettes" name="agri-act-recettes"
               min="0"
               data-resume-label="Recettes">
      </div>
    </div>

    <div class="fr-input-group" data-agri-reel-field hidden>
      <label class="fr-label" for="agri-act-charges">
        Montant des charges déductibles pour cette activité
        <span class="fr-hint-text">Indiquez le montant total sur l'année. Exemple : 3000</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="agri-act-charges" name="agri-act-charges"
               min="0"
               data-resume-label="Charges déductibles">
      </div>
    </div>

    <!-- Champs affichés uniquement en micro-BA -->
    <fieldset class="fr-fieldset" id="agri-act-recettes-annees" aria-labelledby="agri-act-recettes-annees-legend" data-agri-micro-field hidden>
      <legend class="fr-fieldset__legend fr-text--regular" id="agri-act-recettes-annees-legend">
        Montant des recettes de ces trois dernières années pour cette activité
        <span class="fr-hint-text">Indiquez le montant total pour chaque année. Exemple : 23000</span>
      </legend>
      <div class="fr-fieldset__content">
        ${ANNEES_MICRO.map(annee => /* html */`
        <div class="fr-input-group">
          <label class="fr-label" for="agri-act-recettes-${annee}">Recettes ${annee}</label>
          <div class="fr-input-wrap fr-icon-money-euro-circle-line">
            <input class="fr-input" type="number" id="agri-act-recettes-${annee}" name="agri-act-recettes-${annee}"
                   min="0"
                   data-resume-label="Recettes ${annee}">
          </div>
        </div>`).join('')}
      </div>
    </fieldset>
  `;
}

export function init(container) {
  const reelFields = [...container.querySelectorAll('[data-agri-reel-field]')];
  const microFields = [...container.querySelectorAll('[data-agri-micro-field]')];
  const reelInputs = reelFields.flatMap(f => [...f.querySelectorAll('input')]);
  const microInputs = microFields.flatMap(f => [...f.querySelectorAll('input')]);

  function update() {
    const reel = estAgricolesRegimeReel();
    reelFields.forEach(field => { field.hidden = !reel; });
    microFields.forEach(field => { field.hidden = reel; });
    reelInputs.forEach(inp => {
      inp.required = reel;
      if (!reel) inp.value = '';
    });
    microInputs.forEach(inp => {
      inp.required = !reel;
      if (reel) inp.value = '';
    });
  }

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

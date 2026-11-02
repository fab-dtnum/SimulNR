import { estBicRegimeReel } from '../state.js';

// ── Messages d'erreur ────────────────────────────────────────────────────────
export const messages = {
  'bic-act-nom': {
    valueMissing: 'Veuillez indiquer un nom pour cette activité.',
  },
  'bic-act-nature': {
    valueMissing: 'Veuillez indiquer la nature de cette activité.',
  },
  'bic-act-lieu': {
    valueMissing: 'Veuillez indiquer où est imposée cette activité.',
  },
  'bic-act-recettes': {
    valueMissing: 'Le montant des recettes est obligatoire.',
  },
  'bic-act-charges': {
    valueMissing: 'Le montant des charges déductibles est obligatoire.',
  },
};

export function template() {
  return /* html */`
    <div class="fr-input-group">
      <label class="fr-label" for="bic-act-nom">
        Nom pour cette activité
        <span class="fr-hint-text">Ce nom permet d'identifier cette activité dans le simulateur.</span>
      </label>
      <input class="fr-input" type="text" id="bic-act-nom" name="bic-act-nom" required>
    </div>

    <div class="sim-champ-avec-infobulle">
      <fieldset class="fr-fieldset" id="bic-act-nature" aria-labelledby="bic-act-nature-legend"
                data-resume-label="Catégorie">
        <legend class="fr-fieldset__legend fr-text--regular" id="bic-act-nature-legend">
          Quelle est la nature de cette activité
        </legend>
        <div class="fr-fieldset__content">
          <div class="fr-radio-group">
            <input type="radio" id="bic-act-nature-service" name="bic-act-nature" value="service"
                   data-resume-value="Prestations de service" required>
            <label class="fr-label" for="bic-act-nature-service">Prestations de service</label>
          </div>
          <div class="fr-radio-group">
            <input type="radio" id="bic-act-nature-vente" name="bic-act-nature" value="vente"
                   data-resume-value="Activités de vente">
            <label class="fr-label" for="bic-act-nature-vente">Activités de vente</label>
          </div>
        </div>
      </fieldset>
      <button class="fr-btn fr-btn--tooltip" id="bic-act-nature-btn" aria-describedby="bic-act-nature-tooltip" type="button">
        Informations sur la nature de l'activité
      </button>
      <span class="fr-tooltip fr-placement" id="bic-act-nature-tooltip" role="tooltip">
        Les prestations de service concernent les activités commerciales par assimilation, par exemple les opérations de marchand de biens, laboratoire d'analyses médicales, etc.<br><br>
        Les activités de vente sont par exemple la vente de marchandises, d'objets, de fournitures, vente de denrées à emporter ou à consommer sur place, etc.
      </span>
    </div>

    <fieldset class="fr-fieldset" id="bic-act-lieu" aria-labelledby="bic-act-lieu-legend"
              data-resume-label="Imposition">
      <legend class="fr-fieldset__legend fr-text--regular" id="bic-act-lieu-legend">
        Où est imposée cette activité ?
        <span class="fr-hint-text">
          Les revenus imposés en France dépendent de la convention fiscale conclue avec votre État de résidence.
          <a href="https://www.impots.gouv.fr/international-particulier/je-suis-non-residents-quels-sont-les-principaux-revenus-declarer"
             target="_blank" rel="noopener noreferrer">Connaitre les revenus imposés en France<span class="fr-sr-only"> (nouvelle fenêtre)</span></a>
        </span>
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-radio-group">
          <input type="radio" id="bic-act-lieu-france" name="bic-act-lieu" value="france"
                 data-resume-value="En France" required>
          <label class="fr-label" for="bic-act-lieu-france">En France</label>
        </div>
        <div class="fr-radio-group">
          <input type="radio" id="bic-act-lieu-horsfrance" name="bic-act-lieu" value="hors-france"
                 data-resume-value="Hors de France">
          <label class="fr-label" for="bic-act-lieu-horsfrance">Hors de France</label>
        </div>
      </div>
    </fieldset>

    <div class="fr-input-group">
      <label class="fr-label" for="bic-act-recettes">
        Montant des recettes pour cette activité
        <span class="fr-hint-text">Indiquez le montant total perçu dans l'année pour cette activité. Exemple : 23000</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="bic-act-recettes" name="bic-act-recettes"
               min="0" required
               data-resume-label="Recettes">
      </div>
    </div>

    <!-- Champ affiché uniquement si régime réel -->
    <div class="fr-input-group" data-bic-reel-field hidden>
      <label class="fr-label" for="bic-act-charges">
        Montant des charges déductibles pour cette activité
        <span class="fr-hint-text">Indiquez le montant total sur l'année. Exemple : 3000</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="bic-act-charges" name="bic-act-charges"
               min="0"
               data-resume-label="Charges déductibles">
      </div>
    </div>
  `;
}

export function init(container) {
  const reelFields = [...container.querySelectorAll('[data-bic-reel-field]')];
  const chargesInput = container.querySelector('#bic-act-charges');

  function update() {
    const reel = estBicRegimeReel();
    reelFields.forEach(field => { field.hidden = !reel; });
    if (chargesInput) {
      chargesInput.required = reel;
      if (!reel) chargesInput.value = '';
    }
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

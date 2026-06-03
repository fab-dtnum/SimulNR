// ── Messages d'erreur ────────────────────────────────────────────────────────
export const messages = {
  'pac-situation': {
    valueMissing: 'Veuillez indiquer la situation de cette personne.',
  },
  'pac-charge': {
    valueMissing: 'Veuillez indiquer la situation de votre enfant.',
  },
  'pac-invalidite': {
    valueMissing: "Veuillez indiquer si votre enfant a une carte d'invalidité.",
  },
};

export function template() {
  return /* html */`
    <div class="fr-select-group">
      <label class="fr-label" for="pac-situation">
        Quelle est la situation de cette personne ?
      </label>
      <select class="fr-select" id="pac-situation" name="pac-situation" required
              data-resume-label="Situation">
        <option value="" selected disabled hidden>Sélectionner une situation</option>
        <option value="enfant-mineur">Enfant mineur et non marié, ou enfant handicapé quel que soit l'âge</option>
        <option value="enfant-majeur-sans-enfant">Enfant majeur, sans enfant</option>
        <option value="enfant-majeur-marie">Enfant majeur marié ou pacsé</option>
        <option value="conjoint-enfant-marie">Conjoint ou conjointe de votre enfant majeur marié ou pacsé</option>
        <option value="enfant-majeur-avec-enfant">Enfant majeur non marié ou pacsé avec enfant</option>
        <option value="petit-enfant">Enfant de votre enfant majeur non marié ou pacsé</option>
        <option value="personne-invalide">Personne invalide vivant sous votre toit</option>
      </select>
      <div class="fr-messages-group">
        <p class="fr-message fr-message--info">En France, une personne est majeure à partir de 18 ans.</p>
      </div>
    </div>

    <div class="sim-fieldset-avec-infobulle" hidden>
      <fieldset class="fr-fieldset" id="pac-charge" aria-labelledby="pac-charge-legend"
                data-resume-label="Prise en charge">
        <legend class="fr-fieldset__legend fr-text--regular" id="pac-charge-legend">
          Comment cet enfant est-il pris en charge ?
        </legend>
        <div class="fr-fieldset__content">
          <div class="fr-radio-group">
            <input type="radio" id="pac-charge-entiere" name="pac-charge" value="entiere">
            <label class="fr-label" for="pac-charge-entiere">À votre charge</label>
          </div>
          <div class="fr-radio-group">
            <input type="radio" id="pac-charge-alternee" name="pac-charge" value="alternee">
            <label class="fr-label" for="pac-charge-alternee">En résidence alternée</label>
          </div>
        </div>
      </fieldset>
      <button class="fr-btn fr-btn--tooltip fr-btn--sm" id="pac-charge-tooltip-btn"
              aria-describedby="pac-charge-tooltip" type="button">
        Information contextuelle
      </button>
      <span class="fr-tooltip fr-placement" id="pac-charge-tooltip" role="tooltip" aria-hidden="true">
        Un enfant mineur est considéré à votre charge si vous assumez complètement ou principalement ses dépenses d'entretien et d'éducation (sans prendre en compte les pensions alimentaires perçues) et que sa résidence principale est chez vous.
      </span>
    </div>

    <fieldset class="fr-fieldset" id="pac-invalidite" aria-labelledby="pac-invalidite-legend"
              data-resume-label="Carte invalidité ou CMI-invalidité" hidden>
      <legend class="fr-fieldset__legend fr-text--regular" id="pac-invalidite-legend">
        Cet enfant a-t-il une carte d'invalidité ou de la CMI-invalidité ?
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-radio-group">
          <input type="radio" id="pac-invalidite-oui" name="pac-invalidite" value="oui">
          <label class="fr-label" for="pac-invalidite-oui">Oui</label>
        </div>
        <div class="fr-radio-group">
          <input type="radio" id="pac-invalidite-non" name="pac-invalidite" value="non">
          <label class="fr-label" for="pac-invalidite-non">Non</label>
        </div>
      </div>
    </fieldset>

    <div class="fr-input-group">
      <label class="fr-label" for="pac-intitule">
        Prénom (optionnel) <span class="fr-hint-text">Le prénom est uniquement utilisé pour vous aider à identifier cette personne dans la suite du formulaire.</span>
      </label>
      <input class="fr-input" type="text" id="pac-intitule" name="pac-intitule"
             data-resume-label="Prénom">
    </div>
  `;
}

export function init(container, suffix = null) {
  if (suffix !== null) {
    container.querySelectorAll('input[type="radio"]').forEach(input => {
      if (!input.name) return;
      input.dataset.originalName = input.name;
      input.name = `${input.name}-${suffix}`;
    });
  }

  const chargeFieldset    = container.querySelector('#pac-charge');
  const invaliditeFieldset = container.querySelector('#pac-invalidite');

  const select = container.querySelector('select[name="pac-situation"]');
  if (select) {
    select.addEventListener('change', () => {
      const isEnfantMineur = select.value === 'enfant-mineur';

      if (chargeFieldset) {
        const chargeContainer = chargeFieldset.closest('.sim-fieldset-avec-infobulle') ?? chargeFieldset;
        chargeContainer.hidden = !isEnfantMineur;
        chargeFieldset.querySelectorAll('input').forEach(inp => {
          inp.required = isEnfantMineur;
          if (!isEnfantMineur) inp.checked = false;
        });
      }

      if (invaliditeFieldset) {
        invaliditeFieldset.hidden = !isEnfantMineur;
        invaliditeFieldset.querySelectorAll('input').forEach(inp => {
          inp.required = isEnfantMineur;
          if (!isEnfantMineur) inp.checked = false;
        });
      }
    });
  }
}

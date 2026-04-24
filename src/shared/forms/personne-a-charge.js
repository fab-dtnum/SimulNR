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
  'pac-seul': {
    valueMissing: 'Veuillez indiquer si vous vivez seul avec vos enfants.',
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
        <option value="enfant-mineur">Enfant de moins de 18 ans et non marié, ou enfant handicapé quel que soit l'âge</option>
        <option value="enfant-majeur-sans-enfant">Enfant majeur, sans enfant</option>
        <option value="enfant-majeur-marie">Enfant majeur marié ou pacsé</option>
        <option value="conjoint-enfant-marie">Conjoint ou conjointe de votre enfant majeur marié ou pacsé</option>
        <option value="enfant-majeur-avec-enfant">Enfant majeur non marié ou pacsé avec enfant</option>
        <option value="petit-enfant">Enfant de votre enfant majeur non marié ou pacsé</option>
        <option value="personne-invalide">Personne invalide vivant sous votre toit</option>
      </select>
    </div>

    <fieldset class="fr-fieldset" id="pac-charge" aria-labelledby="pac-charge-legend" hidden>
      <legend class="fr-fieldset__legend fr-text--regular" id="pac-charge-legend">
        Comment cet enfant est-il pris en charge ?
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-radio-group">
          <input type="radio" id="pac-charge-entiere" name="pac-charge" value="entiere">
          <label class="fr-label" for="pac-charge-entiere">Entièrement à votre charge</label>
        </div>
        <div class="fr-radio-group">
          <input type="radio" id="pac-charge-alternee" name="pac-charge" value="alternee">
          <label class="fr-label" for="pac-charge-alternee">En résidence alternée</label>
        </div>
      </div>
    </fieldset>

    <fieldset class="fr-fieldset" id="pac-invalidite" aria-labelledby="pac-invalidite-legend" hidden>
      <legend class="fr-fieldset__legend fr-text--regular" id="pac-invalidite-legend">
        Votre enfant a-t-il une carte d'invalidité ou de la CMI-invalidité ?
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
        Intitulé pour la personne (optionnel) <span class="fr-hint-text">Cet intitulé est uniquement utilisé pour vous aider à identifier cette personne dans la suite du formulaire.</span>
      </label>
      <input class="fr-input" type="text" id="pac-intitule" name="pac-intitule"
             data-resume-label="Intitulé">
    </div>

    <fieldset class="fr-fieldset" id="pac-seul" aria-labelledby="pac-seul-legend" hidden>
      <legend class="fr-fieldset__legend fr-text--regular" id="pac-seul-legend">
        Vivez-vous seul avec vos enfants ou des personnes invalides recueillies sous votre toit ?
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-radio-group">
          <input type="radio" id="pac-seul-oui" name="pac-seul" value="oui">
          <label class="fr-label" for="pac-seul-oui">Oui</label>
        </div>
        <div class="fr-radio-group">
          <input type="radio" id="pac-seul-non" name="pac-seul" value="non">
          <label class="fr-label" for="pac-seul-non">Non</label>
        </div>
      </div>
    </fieldset>
  `;
}

export function init(container) {
  const chargeFieldset    = container.querySelector('#pac-charge');
  const invaliditeFieldset = container.querySelector('#pac-invalidite');
  const seulFieldset      = container.querySelector('#pac-seul');

  // Affiche "vivez-vous seul" uniquement si situation familiale = célibat/divorce
  const situationFamiliale = document.querySelector('input[name="situation-familiale"]:checked')?.value;
  if (seulFieldset && situationFamiliale === 'celibat-divorce') {
    seulFieldset.hidden = false;
    seulFieldset.querySelector('input').required = true;
  }

  const select = container.querySelector('select[name="pac-situation"]');
  if (select) {
    select.addEventListener('change', () => {
      const isEnfantMineur = select.value === 'enfant-mineur';

      if (chargeFieldset) {
        chargeFieldset.hidden = !isEnfantMineur;
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

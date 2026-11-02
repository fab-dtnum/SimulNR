// ── Messages d'erreur ────────────────────────────────────────────────────────
export const messages = {
  'bnc-categorie': {
    valueMissing: 'Veuillez indiquer si vos revenus non commerciaux sont professionnels ou non.',
  },
  'bnc-regime': {
    valueMissing: 'Veuillez indiquer si vous êtes à la déclaration contrôlée.',
  },
};

export function template() {
  return /* html */`
    <div class="sim-champ-avec-infobulle">
      <fieldset class="fr-fieldset" id="bnc-categorie" aria-labelledby="bnc-categorie-legend"
                data-resume-label="Catégorie">
        <legend class="fr-fieldset__legend fr-text--regular" id="bnc-categorie-legend">
          Vos revenus non commerciaux sont-ils ?
        </legend>
        <div class="fr-fieldset__content">
          <div class="fr-radio-group">
            <input type="radio" id="bnc-categorie-pro" name="bnc-categorie" value="pro"
                   data-resume-value="Professionnels" required>
            <label class="fr-label" for="bnc-categorie-pro">Professionnels</label>
          </div>
          <div class="fr-radio-group">
            <input type="radio" id="bnc-categorie-nonpro" name="bnc-categorie" value="non-pro"
                   data-resume-value="Non professionnels">
            <label class="fr-label" for="bnc-categorie-nonpro">Non Professionnels</label>
          </div>
        </div>
      </fieldset>
      <button class="fr-btn fr-btn--tooltip" id="bnc-categorie-btn" aria-describedby="bnc-categorie-tooltip" type="button">
        Informations sur les revenus non commerciaux non professionnels
      </button>
      <span class="fr-tooltip fr-placement" id="bnc-categorie-tooltip" role="tooltip">
        Vous êtes en revenus non professionnels si vous percevez des revenus d’une activité non commerciale ne résultant pas de l’exercice d’une profession libérale ou de charges et offices et si cette activité n’est pas exercée à titre habituel et constant et dans un but lucratif.
      </span>
    </div>

    <fieldset class="fr-fieldset" id="bnc-regime" aria-labelledby="bnc-regime-legend"
              data-resume-label="Régime">
      <legend class="fr-fieldset__legend fr-text--regular" id="bnc-regime-legend">
        Êtes-vous à la déclaration contrôlée pour vos revenus non commerciaux ?
        <span class="fr-hint-text">C'est-à-dire que vous déduisez vos charges des revenus non commerciaux.</span>
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-radio-group">
          <input type="radio" id="bnc-regime-oui" name="bnc-regime" value="oui"
                 data-resume-value="Déclaration contrôlée" required>
          <label class="fr-label" for="bnc-regime-oui">Oui</label>
        </div>
        <div class="fr-radio-group">
          <input type="radio" id="bnc-regime-non" name="bnc-regime" value="non"
                 data-resume-value="Déclaratif spécial ou micro-BNC">
          <label class="fr-label" for="bnc-regime-non">Non (régime déclaratif spécial ou micro-BNC)</label>
        </div>
      </div>
    </fieldset>

    <!-- Champ affiché uniquement si revenus non professionnels ET déclaration contrôlée -->
    <div class="fr-input-group" data-bnc-deficits hidden>
      <label class="fr-label" for="bnc-deficits">
        Si vous en avez, quel est le montant des <strong>déficits d'activités non commerciales non professionnelles</strong> restants des années précédentes ? <em>(optionnel)</em>
        <span class="fr-hint-text">Les déficits restants des années précédentes sont indiqués à la fin de votre dernier avis d'imposition. Si les déficits concernent plusieurs années sur votre avis d'imposition, additionnez-les et indiquez le total. Exemple : 400</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="bnc-deficits" name="bnc-deficits"
               min="0"
               data-resume-label="Déficits BNC précédents">
      </div>
    </div>
  `;
}

export function init(container) {
  const categorieInputs = [...container.querySelectorAll('input[name="bnc-categorie"]')];
  const regimeInputs = [...container.querySelectorAll('input[name="bnc-regime"]')];
  const deficitsGroup = container.querySelector('[data-bnc-deficits]');
  const deficitsInput = container.querySelector('#bnc-deficits');

  function updateDeficits() {
    const nonPro = categorieInputs.find(inp => inp.checked)?.value === 'non-pro';
    const controlee = regimeInputs.find(inp => inp.checked)?.value === 'oui';
    const afficher = nonPro && controlee;
    if (deficitsGroup) deficitsGroup.hidden = !afficher;
    // Un montant masqué ne doit pas rester en mémoire.
    if (!afficher && deficitsInput) deficitsInput.value = '';
  }

  [...categorieInputs, ...regimeInputs].forEach(inp => inp.addEventListener('change', updateDeficits));
  updateDeficits();
}

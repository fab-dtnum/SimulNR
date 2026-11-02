// ── Messages d'erreur ────────────────────────────────────────────────────────
export const messages = {
  'bic-categorie': {
    valueMissing: 'Veuillez indiquer si vos revenus industriels et commerciaux sont professionnels ou non.',
  },
  'bic-regime': {
    valueMissing: 'Veuillez indiquer si vous êtes au régime réel.',
  },
};

export function template() {
  return /* html */`
    <div class="sim-champ-avec-infobulle">
      <fieldset class="fr-fieldset" id="bic-categorie" aria-labelledby="bic-categorie-legend"
                data-resume-label="Catégorie">
        <legend class="fr-fieldset__legend fr-text--regular" id="bic-categorie-legend">
          Vos revenus industriels et commerciaux sont-ils ?
        </legend>
        <div class="fr-fieldset__content">
          <div class="fr-radio-group">
            <input type="radio" id="bic-categorie-pro" name="bic-categorie" value="pro"
                   data-resume-value="Professionnels" required>
            <label class="fr-label" for="bic-categorie-pro">Professionnels</label>
          </div>
          <div class="fr-radio-group">
            <input type="radio" id="bic-categorie-nonpro" name="bic-categorie" value="non-pro"
                   data-resume-value="Non professionnels">
            <label class="fr-label" for="bic-categorie-nonpro">Non Professionnels</label>
          </div>
        </div>
      </fieldset>
      <button class="fr-btn fr-btn--tooltip" id="bic-categorie-btn" aria-describedby="bic-categorie-tooltip" type="button">
        Informations sur les revenus industriels et commerciaux non professionnels
      </button>
      <span class="fr-tooltip fr-placement" id="bic-categorie-tooltip" role="tooltip">
        Les revenus industriels et commerciaux non professionnels proviennent des activités qui ne comportent pas la participation personnelle et directe de l’un des membres du foyer fiscal et qui n'y consacre pas une grande partie de son temps.
      </span>
    </div>

    <fieldset class="fr-fieldset" id="bic-regime" aria-labelledby="bic-regime-legend"
              data-resume-label="Régime">
      <legend class="fr-fieldset__legend fr-text--regular" id="bic-regime-legend">
        Êtes-vous au régime réel ?
        <span class="fr-hint-text">C'est-à-dire que vous déduisez vos charges des revenus industriels et commerciaux.</span>
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-radio-group">
          <input type="radio" id="bic-regime-oui" name="bic-regime" value="oui"
                 data-resume-value="Réel" required>
          <label class="fr-label" for="bic-regime-oui">Oui</label>
        </div>
        <div class="fr-radio-group">
          <input type="radio" id="bic-regime-non" name="bic-regime" value="non"
                 data-resume-value="Micro-BIC">
          <label class="fr-label" for="bic-regime-non">Non (micro-BIC)</label>
        </div>
      </div>
    </fieldset>

    <!-- Champ affiché uniquement si revenus non professionnels ET régime réel -->
    <div class="fr-input-group" data-bic-deficits hidden>
      <label class="fr-label" for="bic-deficits">
        Si vous en avez, quel est le montant des <strong>déficits d'activités industrielles et commerciales non professionnelles</strong> restants des années précédentes ? <em>(optionnel)</em>
        <span class="fr-hint-text">Les déficits restants des années précédentes sont indiqués à la fin de votre dernier avis d'imposition. Si les déficits concernent plusieurs années sur votre avis d'imposition, additionnez-les et indiquez le total. Exemple : 400</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="bic-deficits" name="bic-deficits"
               min="0"
               data-resume-label="Déficits BIC précédents">
      </div>
    </div>
  `;
}

export function init(container) {
  const categorieInputs = [...container.querySelectorAll('input[name="bic-categorie"]')];
  const regimeInputs = [...container.querySelectorAll('input[name="bic-regime"]')];
  const deficitsGroup = container.querySelector('[data-bic-deficits]');
  const deficitsInput = container.querySelector('#bic-deficits');

  function updateDeficits() {
    const nonPro = categorieInputs.find(inp => inp.checked)?.value === 'non-pro';
    const reel = regimeInputs.find(inp => inp.checked)?.value === 'oui';
    const afficher = nonPro && reel;
    if (deficitsGroup) deficitsGroup.hidden = !afficher;
    // Un montant masqué ne doit pas rester en mémoire.
    if (!afficher && deficitsInput) deficitsInput.value = '';
  }

  [...categorieInputs, ...regimeInputs].forEach(inp => inp.addEventListener('change', updateDeficits));
  updateDeficits();
}

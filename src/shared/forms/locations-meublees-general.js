// ── Messages d'erreur ────────────────────────────────────────────────────────
export const messages = {
  'lm-categorie': {
    valueMissing: 'Veuillez indiquer la catégorie de vos locations meublées.',
  },
  'lm-regime': {
    valueMissing: 'Veuillez indiquer si vous avez opté pour le régime réel.',
  },
};

export function template() {
  return /* html */`
    <fieldset class="fr-fieldset" id="lm-categorie" aria-labelledby="lm-categorie-legend"
              data-resume-label="Catégorie">
      <legend class="fr-fieldset__legend fr-text--regular" id="lm-categorie-legend">
        Vos locations meublées sont-elles ?
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-radio-group">
          <input type="radio" id="lm-categorie-lmnp" name="lm-categorie" value="lmnp"
                 data-resume-value="Non professionnelle (LMNP)" required>
          <label class="fr-label" for="lm-categorie-lmnp">Non Professionnelles (LMNP)</label>
        </div>
        <div class="fr-radio-group">
          <input type="radio" id="lm-categorie-lmp" name="lm-categorie" value="lmp"
                 data-resume-value="Professionnelle (LMP)">
          <label class="fr-label" for="lm-categorie-lmp">Professionnelles (LMP)</label>
        </div>
      </div>
    </fieldset>

    <fieldset class="fr-fieldset" id="lm-regime" aria-labelledby="lm-regime-legend"
              data-resume-label="Régime">
      <legend class="fr-fieldset__legend fr-text--regular" id="lm-regime-legend">
        Avez-vous opté, ou optez-vous pour le régime réel ?
        <span class="fr-hint-text">C'est-à-dire que vous déduisez vos charges des revenus locatifs.</span>
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-radio-group">
          <input type="radio" id="lm-regime-oui" name="lm-regime" value="oui"
                 data-resume-value="Réel" required>
          <label class="fr-label" for="lm-regime-oui">Oui</label>
        </div>
        <div class="fr-radio-group">
          <input type="radio" id="lm-regime-non" name="lm-regime" value="non"
                 data-resume-value="Micro-BIC">
          <label class="fr-label" for="lm-regime-non">Non (régime micro-BIC)</label>
        </div>
      </div>
    </fieldset>

    <!-- Champ affiché uniquement si la catégorie est LMNP -->
    <div class="fr-input-group" data-lm-deficits hidden>
      <label class="fr-label" for="lm-deficits">
        Si vous en avez, quel est le montant des <strong>déficits de locations meublées</strong> restants des années précédentes ? <em>(optionnel)</em>
        <span class="fr-hint-text">Les déficits restants des années précédentes sont indiqués à la fin de votre dernier avis d'imposition. Si les déficits concernent plusieurs années sur votre avis d'imposition, additionnez-les et indiquez le total. Exemple : 400</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="lm-deficits" name="lm-deficits"
               min="0"
               data-resume-label="Déficits LMNP précédents">
      </div>
    </div>
  `;
}

export function init(container) {
  const categorieFieldset = container.querySelector('#lm-categorie');
  const deficitsGroup     = container.querySelector('[data-lm-deficits]');

  function updateDeficits() {
    const isLmnp = categorieFieldset?.querySelector('input:checked')?.value === 'lmnp';
    if (deficitsGroup) deficitsGroup.hidden = !isLmnp;
  }

  categorieFieldset?.addEventListener('change', updateDeficits);
  updateDeficits();
}

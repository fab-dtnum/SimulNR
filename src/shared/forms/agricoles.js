// ── Messages d'erreur ────────────────────────────────────────────────────────
export const messages = {
  'agri-regime': {
    valueMissing: 'Veuillez indiquer si vous êtes au régime réel.',
  },
};

export function template() {
  return /* html */`
    <fieldset class="fr-fieldset" id="agri-regime" aria-labelledby="agri-regime-legend"
              data-resume-label="Régime">
      <legend class="fr-fieldset__legend fr-text--regular" id="agri-regime-legend">
        Êtes-vous au régime réel ?
        <span class="fr-hint-text">C'est-à-dire que vous déduisez vos charges des revenus agricoles.</span>
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-radio-group">
          <input type="radio" id="agri-regime-oui" name="agri-regime" value="oui"
                 data-resume-value="Réel" required>
          <label class="fr-label" for="agri-regime-oui">Oui</label>
        </div>
        <div class="fr-radio-group">
          <input type="radio" id="agri-regime-non" name="agri-regime" value="non"
                 data-resume-value="Micro-BA">
          <label class="fr-label" for="agri-regime-non">Non (micro-BA)</label>
        </div>
      </div>
    </fieldset>

    <div class="fr-input-group">
      <label class="fr-label" for="agri-deficits">
        Si vous en avez, quel est le montant des <strong>déficits d'activités agricoles</strong> restants des années précédentes ? <em>(optionnel)</em>
        <span class="fr-hint-text">Les déficits restants des années précédentes sont indiqués à la fin de votre dernier avis d'imposition. Si les déficits concernent plusieurs années sur votre avis d'imposition, additionnez-les et indiquez le total. Exemple : 400</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="agri-deficits" name="agri-deficits"
               min="0"
               data-resume-label="Déficits agricoles précédents">
      </div>
    </div>
  `;
}

// ── Messages d'erreur ────────────────────────────────────────────────────────
export const messages = {
  'fo-regime': {
    valueMissing: 'Veuillez indiquer si vous avez opté pour le régime réel.',
  },
};

export function template() {
  return /* html */`
    <div class="sim-champ-avec-infobulle">
      <fieldset class="fr-fieldset" id="fo-regime" aria-labelledby="fo-regime-legend"
                data-resume-label="Régime">
        <legend class="fr-fieldset__legend fr-text--regular" id="fo-regime-legend">
          Êtes-vous au régime réel pour vos locations non meublées ?
          <span class="fr-hint-text">C'est-à-dire que vous déduisez vos charges des revenus locatifs.</span>
        </legend>
        <div class="fr-fieldset__content">
          <div class="fr-radio-group">
            <input type="radio" id="fo-regime-oui" name="fo-regime" value="oui"
                   data-resume-value="Réel" required>
            <label class="fr-label" for="fo-regime-oui">Oui</label>
          </div>
          <div class="fr-radio-group">
            <input type="radio" id="fo-regime-non" name="fo-regime" value="non"
                   data-resume-value="Micro-foncier">
            <label class="fr-label" for="fo-regime-non">Non (régime micro-foncier)</label>
          </div>
        </div>
      </fieldset>
      <button class="fr-btn fr-btn--tooltip" aria-describedby="fo-regime-tooltip" type="button">
        En savoir plus sur le régime micro-foncier
      </button>
      <span class="fr-tooltip fr-placement" id="fo-regime-tooltip" role="tooltip">
        Vous êtes en régime micro-foncier si vos revenus fonciers sont inférieurs à <b>15 000 €</b> et que vous n'avez pas opté pour le régime réel. En régime micro, une déduction de 30% est appliquée sur les revenus fonciers bruts, pour obtenir les revenus fonciers nets. Cette déduction représente les charges.
      </span>
    </div>

    <div class="fr-input-group">
      <label class="fr-label" for="fo-deficits">
        Si vous en avez, quel est le montant des <strong>déficits fonciers</strong> restants des années précédentes ? <em>(optionnel)</em>
        <span class="fr-hint-text">Les déficits restants des années précédentes sont indiqués à la fin de votre dernier avis d'imposition. Si les déficits concernent plusieurs années sur votre avis d'imposition, additionnez-les et indiquez le total. Exemple : 1500</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="fo-deficits" name="fo-deficits"
               min="0"
               data-resume-label="Déficits fonciers précédents">
      </div>
    </div>
  `;
}

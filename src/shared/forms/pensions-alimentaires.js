// ── Messages d'erreur ────────────────────────────────────────────────────────
export const messages = {
  'pension-alimentaire-montant': {
    valueMissing: 'Le montant des pensions alimentaires versées est obligatoire.',
  },
};

export function template() {
  return /* html */`
    <div class="fr-input-group">
      <label class="fr-label" for="pension-alimentaire-montant">
        Montant des pensions alimentaires versées
        <span class="fr-hint-text">Indiquez le montant total versé dans l'année. Exemple : 2500</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="pension-alimentaire-montant" name="pension-alimentaire-montant"
               min="0" required
               data-resume-label="Montant">
      </div>
    </div>
  `;
}

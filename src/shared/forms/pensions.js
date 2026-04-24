// ── Messages d'erreur ────────────────────────────────────────────────────────
export const messages = {
  'pensions-montant': {
    valueMissing:   'Le montant annuel brut des pensions est obligatoire.',
    rangeUnderflow: 'Le montant ne peut pas être négatif.',
  },
};

export function template() {
  return /* html */`
    <div class="fr-input-group">
      <label class="fr-label" for="pensions-montant">
        Montant annuel brut des pensions
        <span class="fr-hint-text">En euros</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="pensions-montant" name="pensions-montant"
               min="0" placeholder="Ex : 18 000"
               data-resume-label="Montant annuel brut" required>
      </div>
    </div>
  `;
}

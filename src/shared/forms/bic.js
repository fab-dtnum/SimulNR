// ── Messages d'erreur ────────────────────────────────────────────────────────
export const messages = {
  'bic-montant': {
    valueMissing:   'Le montant des bénéfices industriels et commerciaux nets est obligatoire.',
    rangeUnderflow: 'Le montant ne peut pas être négatif.',
  },
};

export function template() {
  return /* html */`
    <div class="fr-input-group">
      <label class="fr-label" for="bic-montant">
        Montant net des bénéfices industriels et commerciaux
        <span class="fr-hint-text">En euros</span>
      </label>
      <input class="fr-input" type="number" id="bic-montant" name="bic-montant"
             min="0" placeholder="Ex : 20 000"
             data-resume-label="BIC nets" required>
    </div>

    <div class="fr-input-group">
      <label class="fr-label" for="bic-deficits">
        Déficits industriels et commerciaux non professionnels
        <span class="fr-hint-text">Facultatif. En euros.</span>
      </label>
      <input class="fr-input" type="number" id="bic-deficits" name="bic-deficits"
             min="0" placeholder="Ex : 800"
             data-resume-label="Déficits BIC">
    </div>
  `;
}

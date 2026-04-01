export function template() {
  return /* html */`
    <div class="fr-input-group">
      <label class="fr-label" for="pensions-montant">
        Montant annuel brut des pensions
        <span class="fr-hint-text">En euros</span>
      </label>
      <input class="fr-input" type="number" id="pensions-montant" name="pensions-montant"
             min="0" placeholder="Ex : 18 000"
             data-resume-label="Montant annuel brut" required>
    </div>
  `;
}

export function template() {
  return /* html */`
    <div class="fr-input-group">
      <label class="fr-label" for="bnc-montant">
        Montant net des bénéfices non commerciaux
        <span class="fr-hint-text">En euros</span>
      </label>
      <input class="fr-input" type="number" id="bnc-montant" name="bnc-montant"
             min="0" placeholder="Ex : 25 000"
             data-resume-label="BNC nets" required>
    </div>

    <div class="fr-input-group">
      <label class="fr-label" for="bnc-deficits">
        Déficits des activités non commerciales non professionnelles
        <span class="fr-hint-text">Facultatif. En euros.</span>
      </label>
      <input class="fr-input" type="number" id="bnc-deficits" name="bnc-deficits"
             min="0" placeholder="Ex : 1 000"
             data-resume-label="Déficits non commerciaux">
    </div>
  `;
}

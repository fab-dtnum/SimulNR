export function template() {
  return /* html */`
    <div class="fr-input-group">
      <label class="fr-label" for="agricoles-montant">
        Montant net des revenus agricoles
        <span class="fr-hint-text">En euros</span>
      </label>
      <input class="fr-input" type="number" id="agricoles-montant" name="agricoles-montant"
             min="0" placeholder="Ex : 30 000"
             data-resume-label="Revenus agricoles nets" required>
    </div>

    <div class="fr-input-group">
      <label class="fr-label" for="agricoles-deficits">
        Déficits agricoles des années antérieures
        <span class="fr-hint-text">Facultatif. En euros.</span>
      </label>
      <input class="fr-input" type="number" id="agricoles-deficits" name="agricoles-deficits"
             min="0" placeholder="Ex : 500"
             data-resume-label="Déficits agricoles">
    </div>
  `;
}

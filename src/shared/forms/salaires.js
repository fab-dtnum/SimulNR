export function template() {
  return `
    <div class="fr-input-group">
      <label class="fr-label" for="salaires-montant">
        Salaires et traitements nets imposables
        <span class="fr-hint-text">En euros</span>
      </label>
      <input class="fr-input" type="number" id="salaires-montant" name="salaires-montant"
             min="0" placeholder="Ex : 35 000"
             data-resume-label="Salaires nets imposables" required>
    </div>
  `;
}

// ── Messages d'erreur ────────────────────────────────────────────────────────
export const messages = {
  'deficits-montant': {
    rangeUnderflow: 'Le montant ne peut pas être négatif.',
  },
  'deficits-csg': {
    rangeUnderflow: 'Le montant ne peut pas être négatif.',
  },
};

export function template() {
  return /* html */`
    <div class="fr-input-group">
      <label class="fr-label" for="deficits-montant">
        Montant des déficits globaux restants des années précédentes
        <span class="fr-hint-text">Si des déficits globaux concernent plusieurs années sur votre avis d'imposition, additionnez-les et indiquez le total. Exemple : 1270</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="deficits-montant" name="deficits-montant"
               min="0"
               data-resume-label="Déficits globaux">
      </div>
    </div>

    <div class="fr-input-group">
      <label class="fr-label" for="deficits-csg">
        Montant de CSG déductible
        <span class="fr-hint-text">Ce montant figure sur votre avis d'imposition de l'année précédente. Exemple : 1140</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="deficits-csg" name="deficits-csg"
               min="0"
               data-resume-label="CSG déductible">
      </div>
    </div>
  `;
}

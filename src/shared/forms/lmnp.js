// ── Messages d'erreur ────────────────────────────────────────────────────────
export const messages = {
  'lmnp-regime': {
    valueMissing: 'Veuillez indiquer si vous avez opté pour le régime réel.',
  },
  'lmnp-non-classes': {
    valueMissing: 'Veuillez indiquer si vos locations sont des meublés de tourisme non classés.',
  },
  'lmnp-loyers': {
    valueMissing:   'Le montant des loyers est obligatoire.',
    rangeUnderflow: 'Le montant ne peut pas être négatif.',
  },
  'lmnp-revenus-nets': {
    valueMissing:   'Le montant des revenus nets locatifs est obligatoire.',
    rangeUnderflow: 'Le montant ne peut pas être négatif.',
  },
};

export function template() {
  return /* html */`
    <p class="fr-text--sm">
      Pour plus de détails sur les locations meublées, consultez les pages dédiées sur le site des impôts :
      <a href="https://www.impots.gouv.fr/particulier/les-locations-meublees"
         target="_blank" rel="noopener">locations meublées<span class="fr-sr-only"> (nouvelle fenêtre)</span></a>
      et <a href="https://www.impots.gouv.fr/international-particulier/questions/je-loue-un-bien-meuble-quelles-sont-mes-obligations-fiscales"
         target="_blank" rel="noopener">obligations fiscales d'un bien meublé<span class="fr-sr-only"> (nouvelle fenêtre)</span></a>.
    </p>

    <fieldset class="fr-fieldset" id="lmnp-regime" aria-labelledby="lmnp-regime-legend"
              data-resume-label="Régime">
      <legend class="fr-fieldset__legend fr-text--regular" id="lmnp-regime-legend">
        Avez-vous opté, ou optez-vous pour le régime réel ?
        <span class="fr-hint-text">C'est-à-dire que vous déduisez vos charges des revenus locatifs.</span>
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-radio-group">
          <input type="radio" id="lmnp-regime-oui" name="lmnp-regime" value="oui"
                 data-resume-value="Réel" required>
          <label class="fr-label" for="lmnp-regime-oui">Oui</label>
        </div>
        <div class="fr-radio-group">
          <input type="radio" id="lmnp-regime-non" name="lmnp-regime" value="non"
                 data-resume-value="Micro-BIC">
          <label class="fr-label" for="lmnp-regime-non">Non</label>
        </div>
      </div>
    </fieldset>

    <fieldset class="fr-fieldset" id="lmnp-non-classes" aria-labelledby="lmnp-non-classes-legend"
              data-resume-label="Meublés de tourisme non classés">
      <legend class="fr-fieldset__legend fr-text--regular" id="lmnp-non-classes-legend">
        Vos locations sont-elles des meublés de tourisme <strong>non classés</strong> ?
        <span class="fr-hint-text">Les définitions de ces types de locations sont précisées sur
          <a href="https://www.impots.gouv.fr/particulier/les-locations-meublees"
             target="_blank" rel="noopener">la page dédiée sur le site des impôts<span class="fr-sr-only"> (nouvelle fenêtre)</span></a>.</span>
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-radio-group">
          <input type="radio" id="lmnp-non-classes-oui" name="lmnp-non-classes" value="oui" required>
          <label class="fr-label" for="lmnp-non-classes-oui">Oui</label>
        </div>
        <div class="fr-radio-group">
          <input type="radio" id="lmnp-non-classes-non" name="lmnp-non-classes" value="non">
          <label class="fr-label" for="lmnp-non-classes-non">Non</label>
        </div>
      </div>
    </fieldset>

    <div class="fr-input-group" data-lmnp-micro-field hidden>
      <label class="fr-label" for="lmnp-loyers">
        Montant brut annuel des loyers perçus par votre foyer, en incluant les charges locatives
        <span class="fr-hint-text">Indiquez le montant total sur l'année. Exemple : 6000</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="lmnp-loyers" name="lmnp-loyers"
               min="0"
               data-resume-label="Loyers bruts" data-required-when-micro>
      </div>
    </div>

    <!-- Champ affiché uniquement en régime réel -->
    <div class="fr-input-group" data-lmnp-reel-field hidden>
      <label class="fr-label" for="lmnp-revenus-nets">
        Montant net des revenus locatifs
        <span class="fr-hint-text">L'ensemble de vos revenus locatifs moins vos charges, tel que déclaré auprès du service des impôts des entreprises. Indiquez le montant total sur l'année. Exemple : 4000</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="lmnp-revenus-nets" name="lmnp-revenus-nets"
               min="0"
               data-resume-label="Revenus locatifs nets" data-required-when-reel>
      </div>
    </div>

    <div class="fr-input-group">
      <label class="fr-label" for="lmnp-deficits">
        Si vous en avez, quel est le montant des <strong>déficits de locations meublées non professionnelles</strong> restants des années précédentes ? <em>(optionnel)</em>
        <span class="fr-hint-text">Les déficits restants des années précédentes sont indiqués à la fin de votre dernier avis d'imposition. Si les déficits concernent plusieurs années sur votre avis d'imposition, additionnez-les et indiquez le total. Exemple : 400</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="lmnp-deficits" name="lmnp-deficits"
               min="0"
               data-resume-label="Déficits LMNP précédents">
      </div>
    </div>
  `;
}

export function init(container) {
  const regimeFieldset = container.querySelector('fieldset#lmnp-regime');
  const microFields    = [...container.querySelectorAll('[data-lmnp-micro-field]')];
  const reelFields     = [...container.querySelectorAll('[data-lmnp-reel-field]')];

  function updateVisibility() {
    const isReel  = regimeFieldset?.querySelector('input:checked')?.value === 'oui';
    const isMicro = regimeFieldset?.querySelector('input:checked')?.value === 'non';

    microFields.forEach(field => {
      field.hidden = !isMicro;
      field.querySelectorAll('[data-required-when-micro]').forEach(inp => {
        inp.required = isMicro;
      });
    });

    reelFields.forEach(field => {
      field.hidden = !isReel;
      field.querySelectorAll('[data-required-when-reel]').forEach(inp => {
        inp.required = isReel;
      });
    });
  }

  regimeFieldset?.addEventListener('change', updateVisibility);
}


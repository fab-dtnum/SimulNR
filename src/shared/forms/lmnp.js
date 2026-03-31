export function template() {
  return `
    <p class="fr-text--sm">
      Vos recettes annuelles de locations meublées non professionnelles relèvent de la catégorie LMNP.
      <a href="https://www.impots.gouv.fr/international-particulier/je-suis-non-residents-quels-sont-les-principaux-revenus-declarer"
         target="_blank" rel="noopener">En savoir plus</a>
    </p>

    <fieldset class="fr-fieldset" id="lmnp-regime" aria-labelledby="lmnp-regime-legend"
              data-resume-label="Régime">
      <legend class="fr-fieldset__legend fr-text--regular" id="lmnp-regime-legend">
        Êtes-vous au régime réel ?
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-radio-group">
          <input type="radio" id="lmnp-regime-oui" name="lmnp-regime" value="oui" required>
          <label class="fr-label" for="lmnp-regime-oui">Oui</label>
        </div>
        <div class="fr-radio-group">
          <input type="radio" id="lmnp-regime-non" name="lmnp-regime" value="non">
          <label class="fr-label" for="lmnp-regime-non">Non</label>
        </div>
      </div>
    </fieldset>

    <fieldset class="fr-fieldset" id="lmnp-chambres" aria-labelledby="lmnp-chambres-legend"
              data-resume-label="Chambres d'hôtes ou meublés classés">
      <legend class="fr-fieldset__legend fr-text--regular" id="lmnp-chambres-legend">
        S'agit-il de chambres d'hôtes ou de meublés de tourisme classés ?
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-radio-group">
          <input type="radio" id="lmnp-chambres-oui" name="lmnp-chambres" value="oui" required>
          <label class="fr-label" for="lmnp-chambres-oui">Oui</label>
        </div>
        <div class="fr-radio-group">
          <input type="radio" id="lmnp-chambres-non" name="lmnp-chambres" value="non">
          <label class="fr-label" for="lmnp-chambres-non">Non</label>
        </div>
      </div>
    </fieldset>

    <div class="fr-input-group">
      <label class="fr-label" for="lmnp-loyers">
        Loyers annuels bruts
        <span class="fr-hint-text">En euros</span>
      </label>
      <input class="fr-input" type="number" id="lmnp-loyers" name="lmnp-loyers"
             min="0" placeholder="Ex : 15 000"
             data-resume-label="Loyers annuels bruts" required>
    </div>

    <div class="fr-input-group">
      <label class="fr-label" for="lmnp-revenus-nets">
        Revenus nets locatifs
        <span class="fr-hint-text">En euros</span>
      </label>
      <input class="fr-input" type="number" id="lmnp-revenus-nets" name="lmnp-revenus-nets"
             min="0" placeholder="Ex : 10 000"
             data-resume-label="Revenus nets locatifs" required>
    </div>

    <div class="fr-input-group">
      <label class="fr-label" for="lmnp-deficits">
        Déficits LMNP des années antérieures
        <span class="fr-hint-text">Facultatif. En euros.</span>
      </label>
      <input class="fr-input" type="number" id="lmnp-deficits" name="lmnp-deficits"
             min="0" placeholder="Ex : 2 000"
             data-resume-label="Déficits LMNP">
    </div>
  `;
}

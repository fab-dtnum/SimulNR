// ── Messages d'erreur ────────────────────────────────────────────────────────
export const messages = {
  'annee-naissance': {
    valueMissing:   'Veuillez préciser votre année de naissance.',
    rangeUnderflow: 'L\'année doit être comprise entre 1900 et 2026.',
    rangeOverflow:  'L\'année doit être comprise entre 1900 et 2026.',
  },
  'situation-familiale': {
    valueMissing: 'Veuillez sélectionner votre situation familiale.',
  },
  'annee-naissance-conjoint': {
    valueMissing:   'Veuillez préciser l\'année de naissance de votre conjoint(e).',
    rangeUnderflow: 'L\'année doit être comprise entre 1900 et 2026.',
    rangeOverflow:  'L\'année doit être comprise entre 1900 et 2026.',
  },
};

export function template() {
  return /* html */`
    <fieldset class="fr-fieldset" id="situation-familiale" aria-labelledby="situation-familiale-legend"
              data-resume-label="Situation familiale">
      <legend class="fr-fieldset__legend fr-text--regular" id="situation-familiale-legend">
        Quelle est votre situation familiale ?
        <span class="fr-hint-text">Si vous êtes en union libre et non veuf, sélectionner "célibat".</span>
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-radio-group">
          <input type="radio" id="sit-mariage" name="situation-familiale" value="mariage-pacs" required>
          <label class="fr-label" for="sit-mariage">Mariage ou pacs</label>
        </div>
        <div class="fr-radio-group">
          <input type="radio" id="sit-celibat" name="situation-familiale" value="celibat-divorce">
          <label class="fr-label" for="sit-celibat">Célibat ou divorce</label>
        </div>
        <div class="fr-radio-group">
          <input type="radio" id="sit-veuvage" name="situation-familiale" value="veuvage">
          <label class="fr-label" for="sit-veuvage">Veuvage (veuf ou veuve)</label>
        </div>
      </div>
    </fieldset>

    <div class="fr-input-group">
      <label class="fr-label" for="annee-naissance">
        Votre année de naissance
        <span class="fr-hint-text">Exemple : 1980</span>
      </label>
      <input class="fr-input" type="number" id="annee-naissance" name="annee-naissance"
             min="1900" max="2026"
             autocomplete="bday-year"
             data-resume-type="annee" data-resume-label="Année de naissance" required>
    </div>

    <div class="fr-input-group" id="conjoint-group" hidden>
      <label class="fr-label" for="annee-naissance-conjoint">
        Année de naissance de votre conjoint, conjointe ou partenaire de pacs
        <span class="fr-hint-text">Exemple : 1980</span>
      </label>
      <input class="fr-input" type="number" id="annee-naissance-conjoint" name="annee-naissance-conjoint"
             min="1900" max="2026"
             data-resume-type="annee" data-resume-label="Année de naissance partenaire">
    </div>

    <fieldset class="fr-fieldset" id="demi-parts" aria-labelledby="demi-parts-legend">
      <legend class="fr-fieldset__legend fr-text--regular" id="demi-parts-legend">
        Cochez la case ou les cases qui correspondent à votre situation :
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-checkbox-group" id="dp-solo-enfant-group" hidden>
          <input type="checkbox" id="dp-solo-enfant" name="demi-parts" value="solo-enfant">
          <label class="fr-label" for="dp-solo-enfant">
            Vous viviez seul(e) au 1er janvier 2025 et vous avez un enfant :
            <span class="fr-hint-text">
              - majeur ou marié/pacsé (ou mineur imposé en son nom propre) non rattaché à votre foyer ;<br>
              - décédé après l'âge de 16 ans ou par suite de faits de guerre ;<br>
              - vous avez élevé cet enfant pendant au moins cinq années au cours desquelles vous viviez seul.
            </span>
          </label>
        </div>
        <div class="fr-checkbox-group">
          <input type="checkbox" id="dp-invalidite" name="demi-parts" value="invalidite">
          <label class="fr-label" for="dp-invalidite">
            Pension (militaire, accident du travail) pour une invalidité d'au moins 40 % , carte invalidité ou carte mobilité inclusion mention invalidité (CMI)
          </label>
        </div>
        <div class="fr-checkbox-group">
          <input type="checkbox" id="dp-pension-guerre" name="demi-parts" value="pension-guerre">
          <label class="fr-label" for="dp-pension-guerre">
            Carte du combattant, pension militaire d'invalidité ou de victime de guerre.
          </label>
        </div>
        <div class="fr-checkbox-group">
          <input type="checkbox" id="dp-aucune" name="demi-parts" value="aucune">
          <label class="fr-label" for="dp-aucune">
            Aucune de ces situations ne me concerne.
          </label>
        </div>
      </div>
    </fieldset>
  `;
}

export function init(container) {
  const radios = container.querySelectorAll('input[name="situation-familiale"]');
  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      const value = radio.value;
      const isMarriage = value === 'mariage-pacs';
      const isSolo = value === 'celibat-divorce' || value === 'veuvage';

      const conjointGroup = container.querySelector('#conjoint-group');
      if (conjointGroup) {
        conjointGroup.hidden = !isMarriage;
        const input = conjointGroup.querySelector('input');
        if (input) input.required = isMarriage;
      }

      const soloGroup = container.querySelector('#dp-solo-enfant-group');
      if (soloGroup) {
        soloGroup.hidden = !isSolo;
        if (!isSolo) soloGroup.querySelector('input').checked = false;
      }
    });
  });
}

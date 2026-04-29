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
  'demi-parts': {
    valueMissing: 'Veuillez sélectionner au moins une situation, ou « Aucune de ces situations ne me concerne ».',
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

    <fieldset class="fr-fieldset" id="demi-parts" aria-labelledby="demi-parts-legend" data-required-group="demi-parts">
      <legend class="fr-fieldset__legend fr-text--regular" id="demi-parts-legend">
        Cochez la case ou les cases qui correspondent à votre situation :
      </legend>
      <div class="fr-fieldset__content">
        <div class="sim-checkbox-tiles">

          <!-- Solo + enfant (conditionnel : célibat/divorce ou veuvage) -->
          <div class="sim-checkbox-tile-wrapper" id="dp-solo-enfant-wrapper" hidden>
            <div class="sim-checkbox-tile">
              <div class="fr-checkbox-group">
                <input type="checkbox" id="dp-solo-enfant" name="dp-solo-enfant">
                <label class="fr-label" for="dp-solo-enfant">
                  Vous viviez seul(e) au 1er janvier 2025 et vous avez un enfant :
                  <span class="fr-hint-text">
                    — majeur ou marié/pacsé (ou mineur imposé en son nom propre) non rattaché à votre foyer ;<br>
                    — décédé après l'âge de 16 ans ou par suite de faits de guerre ;<br>
                    — que vous avez élevé pendant au moins cinq années au cours desquelles vous viviez seul(e).
                  </span>
                </label>
              </div>
            </div>
          </div>

          <!-- Invalidité -->
          <div class="sim-checkbox-tile-wrapper">
            <div class="sim-checkbox-tile">
              <div class="fr-checkbox-group">
                <input type="checkbox" id="dp-invalidite" name="dp-invalidite">
                <label class="fr-label" for="dp-invalidite">
                  Pension (militaire, accident du travail) pour une invalidité d'au moins 40 %, carte invalidité ou carte mobilité inclusion mention invalidité (CMI)
                </label>
              </div>
            </div>
            <div class="sim-checkbox-tile__subchoices" id="dp-invalidite-subchoices" hidden>
              <div class="sim-checkbox-tile">
                <div class="fr-checkbox-group">
                  <input type="checkbox" id="dp-invalidite-vous" name="dp-invalidite-vous">
                  <label class="fr-label" for="dp-invalidite-vous">Vous remplissez ces conditions.</label>
                </div>
              </div>
              <div id="dp-invalidite-conjoint-wrapper" hidden>
                <div class="sim-checkbox-tile">
                  <div class="fr-checkbox-group">
                    <input type="checkbox" id="dp-invalidite-conjoint" name="dp-invalidite-conjoint">
                    <label class="fr-label" for="dp-invalidite-conjoint">
                      Votre conjoint(e) remplit ces conditions, ou votre conjoint(e), décédé(e) en 2025, remplissait ces conditions.
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Combattant / Victime de guerre -->
          <div class="sim-checkbox-tile-wrapper">
            <div class="sim-checkbox-tile">
              <div class="fr-checkbox-group">
                <input type="checkbox" id="dp-guerre" name="dp-guerre">
                <label class="fr-label" for="dp-guerre">
                  Carte du combattant, pension militaire d'invalidité ou de victime de guerre.
                </label>
              </div>
            </div>
            <div class="sim-checkbox-tile__subchoices" id="dp-guerre-subchoices" hidden>
              <div id="dp-guerre-solo-wrapper" hidden>
                <div class="sim-checkbox-tile">
                  <div class="fr-checkbox-group">
                    <input type="checkbox" id="dp-guerre-solo" name="dp-guerre-solo">
                    <label class="fr-label" for="dp-guerre-solo">
                      Vous êtes célibataire, divorcé(e), séparé(e), veuf(ve) et :
                      <span class="fr-hint-text">
                        - vous avez plus de 74 ans et vous remplissez ces conditions ;<br>
                        - ou vous avez plus de 74 ans et votre conjoint(e) décédé(e) bénéficiait de la demi-part supplémentaire ou était titulaire de la carte du combattant ;<br>
                        - ou votre conjoint(e) décédé(e) en 2025 bénéficiait de la demi-part supplémentaire.
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              <div id="dp-guerre-marie-wrapper" hidden>
                <div class="sim-checkbox-tile">
                  <div class="fr-checkbox-group">
                    <input type="checkbox" id="dp-guerre-marie" name="dp-guerre-marie">
                    <label class="fr-label" for="dp-guerre-marie">
                      Vous êtes marié(e)s ou lié(e)s par un PACS et l'un des deux déclarants, âgé de plus de 74 ans, remplit ces conditions.
                    </label>
                  </div>
                </div>
              </div>
              <div class="sim-checkbox-tile">
                <div class="fr-checkbox-group">
                  <input type="checkbox" id="dp-guerre-veuve" name="dp-guerre-veuve">
                  <label class="fr-label" for="dp-guerre-veuve">Vous avez une pension de veuf(ve) de guerre.</label>
                </div>
              </div>
            </div>
          </div>

          <!-- Aucune (exclusion mutuelle) -->
          <div class="sim-checkbox-tile-wrapper">
            <div class="sim-checkbox-tile">
              <div class="fr-checkbox-group">
                <input type="checkbox" id="dp-aucune" name="dp-aucune">
                <label class="fr-label" for="dp-aucune">Aucune de ces situations ne me concerne.</label>
              </div>
            </div>
          </div>

        </div>
      </div>
    </fieldset>
  `;
}

export function init(container) {
  const invaliditeSubchoices = container.querySelector('#dp-invalidite-subchoices');
  const guerreSubchoices     = container.querySelector('#dp-guerre-subchoices');

  // ── Situation familiale ──────────────────────────────────────────────────────
  function majSituationFamiliale() {
    const sitVal   = container.querySelector('input[name="situation-familiale"]:checked')?.value;
    const isMarriage = sitVal === 'mariage-pacs';
    const isSolo     = sitVal === 'celibat-divorce' || sitVal === 'veuvage';
    const isVeuvage  = sitVal === 'veuvage';

    const conjointGroup = container.querySelector('#conjoint-group');
    if (conjointGroup) {
      conjointGroup.hidden = !isMarriage;
      const input = conjointGroup.querySelector('input');
      if (input) input.required = isMarriage;
    }

    // Solo+enfant : visible si célibat/divorce ou veuvage
    majVisibility('#dp-solo-enfant-wrapper', !isSolo);

    // Invalidité – conjoint : visible si mariage/pacs ou veuvage (conjoint décédé)
    majVisibility('#dp-invalidite-conjoint-wrapper', !(isMarriage || isVeuvage));

    // Guerre – solo : visible si célibat/divorce ou veuvage
    majVisibility('#dp-guerre-solo-wrapper', !isSolo);

    // Guerre – marié : visible si mariage/pacs
    majVisibility('#dp-guerre-marie-wrapper', !isMarriage);
  }

  function majVisibility(selector, hide) {
    const el = container.querySelector(selector);
    if (!el) return;
    el.hidden = hide;
    if (hide) {
      el.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    }
  }

  container.querySelectorAll('input[name="situation-familiale"]').forEach(radio => {
    radio.addEventListener('change', majSituationFamiliale);
  });

  // ── Invalidité : afficher/masquer les sous-choix ─────────────────────────────
  const invaliditeCheckbox = container.querySelector('#dp-invalidite');
  if (invaliditeCheckbox && invaliditeSubchoices) {
    invaliditeCheckbox.addEventListener('change', () => {
      invaliditeSubchoices.hidden = !invaliditeCheckbox.checked;
      if (!invaliditeCheckbox.checked) {
        invaliditeSubchoices.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
      }
    });
  }

  // ── Combattant/guerre : afficher/masquer les sous-choix ─────────────────────
  const guerreCheckbox = container.querySelector('#dp-guerre');
  if (guerreCheckbox && guerreSubchoices) {
    guerreCheckbox.addEventListener('change', () => {
      guerreSubchoices.hidden = !guerreCheckbox.checked;
      if (!guerreCheckbox.checked) {
        guerreSubchoices.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
      }
    });
  }

  // ── Aucune : exclusion mutuelle ──────────────────────────────────────────────
  const aucuneCheckbox = container.querySelector('#dp-aucune');
  const autresIds = ['dp-solo-enfant', 'dp-invalidite', 'dp-guerre'];

  if (aucuneCheckbox) {
    aucuneCheckbox.addEventListener('change', () => {
      if (!aucuneCheckbox.checked) return;
      autresIds.forEach(id => {
        const cb = container.querySelector(`#${id}`);
        if (cb) cb.checked = false;
      });
      if (invaliditeSubchoices) {
        invaliditeSubchoices.hidden = true;
        invaliditeSubchoices.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
      }
      if (guerreSubchoices) {
        guerreSubchoices.hidden = true;
        guerreSubchoices.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
      }
    });
  }

  autresIds.forEach(id => {
    const cb = container.querySelector(`#${id}`);
    if (cb && aucuneCheckbox) {
      cb.addEventListener('change', () => {
        if (cb.checked) aucuneCheckbox.checked = false;
      });
    }
  });
}

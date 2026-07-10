import { estLocationsMeubleesRegimeReel, estLocationsMeubleesCategorieLmnp } from '../state.js';

// ── Messages d'erreur ────────────────────────────────────────────────────────
export const messages = {
  'lm-logement-nom': {
    valueMissing: 'Veuillez indiquer un nom pour ce logement.',
  },
  'lm-logement-lieu': {
    valueMissing: 'Veuillez indiquer où est situé ce logement.',
  },
  'lm-logement-categorie-france': {
    valueMissing: 'Veuillez indiquer la catégorie de ce logement.',
  },
  'lm-logement-categorie-horsfrance': {
    valueMissing: 'Veuillez indiquer la catégorie de ce logement.',
  },
  'lm-logement-loyers': {
    valueMissing: 'Le montant des loyers est obligatoire.',
  },
  'lm-logement-charges': {
    valueMissing: 'Le montant des charges déductibles est obligatoire.',
  },
};

export function template() {
  return /* html */`
    <div class="fr-input-group">
      <label class="fr-label" for="lm-logement-nom">
        Nom pour ce logement
        <span class="fr-hint-text">Ce nom permet d'identifier ce logement dans le simulateur.</span>
      </label>
      <input class="fr-input" type="text" id="lm-logement-nom" name="lm-logement-nom" required>
    </div>

    <fieldset class="fr-fieldset" id="lm-logement-lieu" aria-labelledby="lm-logement-lieu-legend"
              data-resume-label="Lieu">
      <legend class="fr-fieldset__legend fr-text--regular" id="lm-logement-lieu-legend">
        Où est situé ce logement ?
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-radio-group">
          <input type="radio" id="lm-logement-lieu-france" name="lm-logement-lieu" value="france"
                 data-resume-value="En France" required>
          <label class="fr-label" for="lm-logement-lieu-france">En France</label>
        </div>
        <div class="fr-radio-group">
          <input type="radio" id="lm-logement-lieu-horsfrance" name="lm-logement-lieu" value="hors-france"
                 data-resume-value="Hors de France">
          <label class="fr-label" for="lm-logement-lieu-horsfrance">Hors de France</label>
        </div>
      </div>
    </fieldset>

    <!-- Catégorie affichée si le logement est situé en France -->
    <fieldset class="fr-fieldset" id="lm-logement-categorie-france" aria-labelledby="lm-logement-categorie-france-legend"
              data-resume-label="Catégorie" hidden>
      <legend class="fr-fieldset__legend fr-text--regular" id="lm-logement-categorie-france-legend">
        Quelle est la catégorie de ce logement ?
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-radio-group">
          <input type="radio" id="lm-logement-categorie-france-hors-tourisme" name="lm-logement-categorie-france" value="hors-tourisme"
                 data-resume-value="Hors tourisme">
          <label class="fr-label" for="lm-logement-categorie-france-hors-tourisme">Hors tourisme (cas général)</label>
        </div>
        <div class="fr-radio-group">
          <input type="radio" id="lm-logement-categorie-france-non-classe" name="lm-logement-categorie-france" value="tourisme-non-classe"
                 data-resume-value="Tourisme non classé">
          <label class="fr-label" for="lm-logement-categorie-france-non-classe">Tourisme non classé</label>
        </div>
        <div class="fr-radio-group">
          <input type="radio" id="lm-logement-categorie-france-classe" name="lm-logement-categorie-france" value="tourisme-classe"
                 data-resume-value="Tourisme classé">
          <label class="fr-label" for="lm-logement-categorie-france-classe">Tourisme classé</label>
        </div>
      </div>
      <div class="fr-messages-group">
        <p class="fr-message fr-message--info">
          <span>
            Les meublés de tourisme sont des villas, appartements ou studios meublés, à l'usage exclusif du locataire, offerts à la location à une clientèle de passage qui n'y élit pas domicile et qui y effectue un séjour caractérisé par une location à la journée, à la semaine ou au mois
            (<a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000042070525" target="_blank" rel="noopener noreferrer">article L. 324-1-1 du code du tourisme<span class="fr-sr-only"> (nouvelle fenêtre)</span></a>).
            Le loueur peut demander le classement de son meublé de tourisme
            (<a href="https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/les-meubles-de-tourisme#classement" target="_blank" rel="noopener noreferrer">plus d'informations<span class="fr-sr-only"> (nouvelle fenêtre)</span></a>).
          </span>
        </p>
      </div>
    </fieldset>

    <!-- Catégorie affichée si le logement est situé hors de France -->
    <fieldset class="fr-fieldset" id="lm-logement-categorie-horsfrance" aria-labelledby="lm-logement-categorie-horsfrance-legend"
              data-resume-label="Catégorie" hidden>
      <legend class="fr-fieldset__legend fr-text--regular" id="lm-logement-categorie-horsfrance-legend">
        Quelle est la catégorie de ce logement ?
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-radio-group">
          <input type="radio" id="lm-logement-categorie-horsfrance-hors-tourisme" name="lm-logement-categorie-horsfrance" value="hors-tourisme"
                 data-resume-value="Hors tourisme">
          <label class="fr-label" for="lm-logement-categorie-horsfrance-hors-tourisme">Hors tourisme</label>
        </div>
        <div class="fr-radio-group">
          <input type="radio" id="lm-logement-categorie-horsfrance-tourisme" name="lm-logement-categorie-horsfrance" value="tourisme"
                 data-resume-value="Tourisme">
          <label class="fr-label" for="lm-logement-categorie-horsfrance-tourisme">Tourisme</label>
        </div>
      </div>
      <div class="fr-messages-group">
        <p class="fr-message fr-message--info">
          <span>
            Les meublés de tourisme sont des villas, appartements ou studios meublés, à l'usage exclusif du locataire, offerts à la location à une clientèle de passage qui n'y élit pas domicile et qui y effectue un séjour caractérisé par une location à la journée, à la semaine ou au mois
            (<a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000042070525" target="_blank" rel="noopener noreferrer">article L. 324-1-1 du code du tourisme<span class="fr-sr-only"> (nouvelle fenêtre)</span></a>).
          </span>
        </p>
      </div>
    </fieldset>

    <div class="fr-input-group">
      <label class="fr-label" for="lm-logement-loyers">
        Montant brut des loyers pour ce logement, en incluant les charges locatives
        <span class="fr-hint-text">Indiquez le montant total perçu pour l'année. Exemple : 6000</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="lm-logement-loyers" name="lm-logement-loyers"
               min="0" required
               data-resume-label="Loyers bruts">
      </div>
    </div>

    <!-- Champ affiché uniquement si le régime réel a été choisi à l'étape Général -->
    <div class="fr-input-group" data-lm-logement-charges hidden>
      <label class="fr-label" for="lm-logement-charges">
        Montant des charges déductibles pour ce logement
        <span class="fr-hint-text">Indiquez le montant total sur l'année. Exemple : 3000</span>
      </label>
      <div class="fr-input-wrap fr-icon-money-euro-circle-line">
        <input class="fr-input" type="number" id="lm-logement-charges" name="lm-logement-charges"
               min="0"
               data-resume-label="Charges déductibles">
      </div>
    </div>
  `;
}

export function init(container) {
  const lieuFieldset          = container.querySelector('#lm-logement-lieu');
  const categorieFranceField  = container.querySelector('#lm-logement-categorie-france');
  const categorieHorsFrField  = container.querySelector('#lm-logement-categorie-horsfrance');
  const chargesGroup          = container.querySelector('[data-lm-logement-charges]');

  // La catégorie touristique ne sert qu'au calcul de l'abattement micro-BIC :
  // elle n'est demandée que pour une location LMNP en régime micro-BIC
  // (en régime réel ou en LMP, elle n'intervient pas dans le calcul).
  function updateLieu() {
    const lieu = lieuFieldset?.querySelector('input:checked')?.value;
    const categorieApplicable = estLocationsMeubleesCategorieLmnp() && !estLocationsMeubleesRegimeReel();
    const isFrance     = categorieApplicable && lieu === 'france';
    const isHorsFrance = categorieApplicable && lieu === 'hors-france';

    if (categorieFranceField) {
      categorieFranceField.hidden = !isFrance;
      categorieFranceField.querySelectorAll('input').forEach(inp => {
        inp.required = isFrance;
        if (!isFrance) inp.checked = false;
      });
    }

    if (categorieHorsFrField) {
      categorieHorsFrField.hidden = !isHorsFrance;
      categorieHorsFrField.querySelectorAll('input').forEach(inp => {
        inp.required = isHorsFrance;
        if (!isHorsFrance) inp.checked = false;
      });
    }
  }

  function updateRegime() {
    const isReel = estLocationsMeubleesRegimeReel();
    if (chargesGroup) {
      chargesGroup.hidden = !isReel;
      chargesGroup.querySelectorAll('input').forEach(inp => { inp.required = isReel; });
    }
  }

  lieuFieldset?.addEventListener('change', updateLieu);
  updateLieu();
  updateRegime();
}

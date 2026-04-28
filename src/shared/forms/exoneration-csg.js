// ── Messages d'erreur ────────────────────────────────────────────────────────
export const messages = {
  'csg-affiliation-vous': {
    valueMissing: 'Veuillez répondre à cette question.',
  },
  'csg-affiliation-conjoint': {
    valueMissing: 'Veuillez répondre à cette question.',
  },
  'csg-fonciers-vous': {
    rangeUnderflow: 'Le pourcentage ne peut pas être négatif.',
    rangeOverflow:  'Le pourcentage ne peut pas dépasser 100.',
  },
  'csg-fonciers-conjoint': {
    rangeUnderflow: 'Le pourcentage ne peut pas être négatif.',
    rangeOverflow:  'Le pourcentage ne peut pas dépasser 100.',
  },
};

export function template() {
  return /* html */`
    <fieldset class="fr-fieldset" id="csg-affiliation-vous" aria-labelledby="csg-affiliation-vous-legend"
              data-resume-label="Affilié EEE (vous)">
      <legend class="fr-fieldset__legend fr-text--regular" id="csg-affiliation-vous-legend">
        Êtes-vous affilié à un régime d'assurance maladie d'un État de l'Espace économique européen, du Royaume-Uni ou de la Suisse, sans être à la charge d'un régime obligatoire de sécurité sociale français ?
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-radio-group">
          <input type="radio" id="csg-vous-oui" name="csg-affiliation-vous" value="oui" required>
          <label class="fr-label" for="csg-vous-oui">Oui</label>
        </div>
        <div class="fr-radio-group">
          <input type="radio" id="csg-vous-non" name="csg-affiliation-vous" value="non">
          <label class="fr-label" for="csg-vous-non">Non</label>
        </div>
      </div>
    </fieldset>

    <fieldset class="fr-fieldset" id="csg-conjoint-group" aria-labelledby="csg-affiliation-conjoint-legend"
              data-resume-label="Affilié EEE (conjoint)" hidden>
      <legend class="fr-fieldset__legend fr-text--regular" id="csg-affiliation-conjoint-legend">
        Est-ce que votre conjoint, conjointe ou partenaire de pacs est affilié à un régime d'assurance maladie d'un État de l'Espace économique européen, du Royaume-Uni ou de la Suisse, sans être à la charge d'un régime obligatoire de sécurité sociale français ?
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-radio-group">
          <input type="radio" id="csg-conjoint-oui" name="csg-affiliation-conjoint" value="oui">
          <label class="fr-label" for="csg-conjoint-oui">Oui</label>
        </div>
        <div class="fr-radio-group">
          <input type="radio" id="csg-conjoint-non" name="csg-affiliation-conjoint" value="non">
          <label class="fr-label" for="csg-conjoint-non">Non</label>
        </div>
      </div>
    </fieldset>

    <div id="csg-fonciers-group" hidden>
      <p class="fr-label">
        En pourcentages, quelle est la répartition des revenus fonciers entre vous et votre conjoint/conjointe ?
        <span class="fr-hint-text">La somme des deux pourcentages doit être égale à 100.</span>
      </p>
      <div class="sim-double-champs">
        <div class="fr-input-group">
          <label class="fr-label" for="csg-fonciers-vous">
            Vous
            <span class="fr-hint-text">Exemple : 55</span>
          </label>
          <div class="fr-input-wrap fr-icon-percent-line">
            <input class="fr-input" type="number" id="csg-fonciers-vous" name="csg-fonciers-vous"
                   min="0" max="100"
                   data-resume-label="Fonciers (vous)">
          </div>
        </div>
        <div class="fr-input-group">
          <label class="fr-label" for="csg-fonciers-conjoint">
            Conjoint / conjointe
            <span class="fr-hint-text">Exemple : 45</span>
          </label>
          <div class="fr-input-wrap fr-icon-percent-line">
            <input class="fr-input" type="number" id="csg-fonciers-conjoint" name="csg-fonciers-conjoint"
                   min="0" max="100"
                   data-resume-label="Fonciers (conjoint)">
          </div>
        </div>
      </div>
    </div>
  `;
}

export function init(container) {
  function majConjoint() {
    const isMarriage = !!document.querySelector('input[name="situation-familiale"][value="mariage-pacs"]:checked');
    const conjointGroup = container.querySelector('#csg-conjoint-group');
    if (conjointGroup) {
      conjointGroup.hidden = !isMarriage;
      conjointGroup.querySelectorAll('input[type="radio"]').forEach(inp => { inp.required = isMarriage; });
    }
  }

  function majFonciers() {
    const fonciersPresent = !!document.querySelector('.sim-tuile-wrapper[data-tile="fonciers"] .sim-tuile[hidden]');
    const fonciersGroup = container.querySelector('#csg-fonciers-group');
    if (fonciersGroup) {
      fonciersGroup.hidden = !fonciersPresent;
      fonciersGroup.querySelectorAll('input[type="number"]').forEach(inp => { inp.required = fonciersPresent; });
    }
  }

  majConjoint();
  majFonciers();

  // Complément automatique à 100% entre les deux champs de répartition fonciers
  function bindComplement(sourceId, targetId) {
    const source = container.querySelector(`#${sourceId}`);
    const target = container.querySelector(`#${targetId}`);
    if (!source || !target) return;
    source.addEventListener('input', () => {
      if (document.activeElement === target) return;
      const val = parseFloat(source.value);
      target.value = (!isNaN(val) && source.value !== '') ? Math.max(0, 100 - val) : '';
    });
  }
  bindComplement('csg-fonciers-vous', 'csg-fonciers-conjoint');
  bindComplement('csg-fonciers-conjoint', 'csg-fonciers-vous');

  document.addEventListener('change', (e) => {
    if (e.target.name === 'situation-familiale') majConjoint();
  });

  // Re-vérifie à chaque réouverture du panel (variant B : sim-sous-formulaire, variant A : sim-tuile-ouvert)
  const panel = container.closest('.sim-sous-formulaire, .sim-tuile-ouvert');
  if (panel) {
    new MutationObserver(() => {
      if (!panel.hidden) {
        majConjoint();
        majFonciers();
      }
    }).observe(panel, { attributes: true, attributeFilter: ['hidden'] });
  }
}

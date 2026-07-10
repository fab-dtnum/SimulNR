import { estMariagePacs, hasFonciersOuverts, hasLocationsMeubleesOuverts } from '../state.js';

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
  // Les champs de répartition LMNP sont générés dynamiquement (un par logement,
  // noms suffixés) : ils utilisent les messages par défaut de validation.js
  // (rangeUnderflow/rangeOverflow) plutôt que des clés fixes ici.
};

export function template() {
  return /* html */`
    <fieldset class="fr-fieldset" id="csg-affiliation-vous" aria-labelledby="csg-affiliation-vous-legend"
              data-resume-label="Assurance maladie Europe">
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
              data-resume-label="Assurance maladie Europe conjoint" hidden>
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

    <div id="csg-fonciers-group" hidden
         data-resume-label="Répartition revenus fonciers" data-resume-type="repartition-pct">
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
                   min="0" max="100">
          </div>
        </div>
        <div class="fr-input-group">
          <label class="fr-label" for="csg-fonciers-conjoint">
            Conjoint / conjointe
            <span class="fr-hint-text">Exemple : 45</span>
          </label>
          <div class="fr-input-wrap fr-icon-percent-line">
            <input class="fr-input" type="number" id="csg-fonciers-conjoint" name="csg-fonciers-conjoint"
                   min="0" max="100">
          </div>
        </div>
      </div>
    </div>

    <div id="csg-lmnp-group" hidden>
      <p class="fr-label">
        En pourcentages, quelle est la répartition des locations meublées non professionnelles (LMNP) entre vous et votre conjoint ou conjointe ?
        <span class="fr-hint-text">Pour chaque logement, la somme des deux pourcentages doit être égale à 100.</span>
      </p>
      <div data-csg-lmnp-liste></div>
    </div>
  `;
}

// ── Répartition LMNP : un bloc par logement ajouté ───────────────────────────

function slugifyNomLogement(nom) {
  const slug = nom.trim().toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return slug || 'logement';
}

function echapperHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function blocRepartitionLogement(nom, slug) {
  return /* html */`
    <p class="sim-repartition-logement__nom">${echapperHtml(nom)}</p>
    <div class="sim-double-champs">
      <div class="fr-input-group">
        <label class="fr-label" for="csg-lmnp-vous-${slug}">
          Vous
          <span class="fr-hint-text">Exemple : 55</span>
        </label>
        <div class="fr-input-wrap fr-icon-percent-line">
          <input class="fr-input" type="number" id="csg-lmnp-vous-${slug}" name="csg-lmnp-vous-${slug}"
                 min="0" max="100">
        </div>
      </div>
      <div class="fr-input-group">
        <label class="fr-label" for="csg-lmnp-conjoint-${slug}">
          Conjoint / conjointe
          <span class="fr-hint-text">Exemple : 45</span>
        </label>
        <div class="fr-input-wrap fr-icon-percent-line">
          <input class="fr-input" type="number" id="csg-lmnp-conjoint-${slug}" name="csg-lmnp-conjoint-${slug}"
                 min="0" max="100">
        </div>
      </div>
    </div>
  `;
}

export function init(container) {
  function majConjoint() {
    const isMarriage = estMariagePacs();
    const conjointGroup = container.querySelector('#csg-conjoint-group');
    if (conjointGroup) {
      conjointGroup.hidden = !isMarriage;
      conjointGroup.querySelectorAll('input[type="radio"]').forEach(inp => { inp.required = isMarriage; });
    }
    majFonciers();
    majLmnp();
  }

  function majFonciers() {
    const fonciersPresent = hasFonciersOuverts();
    const isMarriage = estMariagePacs();
    const affVous = container.querySelector('input[name="csg-affiliation-vous"]:checked')?.value;
    const affConjoint = container.querySelector('input[name="csg-affiliation-conjoint"]:checked')?.value;
    const statusDifferent = isMarriage && !!affVous && !!affConjoint && affVous !== affConjoint;
    const show = fonciersPresent && statusDifferent;
    const fonciersGroup = container.querySelector('#csg-fonciers-group');
    if (fonciersGroup) {
      fonciersGroup.hidden = !show;
      fonciersGroup.querySelectorAll('input[type="number"]').forEach(inp => { inp.required = show; });
    }
  }

  // Complément automatique à 100% entre deux champs de répartition
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

  // Synchronise un bloc Vous/Conjoint par logement en location meublée existant,
  // en conservant les valeurs déjà saisies pour les logements déjà présents.
  function renderLmnpRepartition() {
    const liste = container.querySelector('[data-csg-lmnp-liste]');
    if (!liste) return;

    const noms = [...document.querySelectorAll('.sim-tuile-ouvert[data-tile="locationsMeubleesLogement"]')]
      .map(logement => logement.querySelector('[data-lm-logement-nom]')?.textContent.trim())
      .filter(Boolean);

    const slugsVus = new Set();
    noms.forEach(nom => {
      let slug = slugifyNomLogement(nom);
      while (slugsVus.has(slug)) slug += '-bis';
      slugsVus.add(slug);

      if (liste.querySelector(`[data-logement-key="${slug}"]`)) return;

      const bloc = document.createElement('div');
      bloc.className = 'sim-repartition-logement';
      bloc.dataset.logementKey = slug;
      bloc.dataset.resumeLabel = `Répartition LMNP – ${nom}`;
      bloc.dataset.resumeType = 'repartition-pct';
      bloc.innerHTML = blocRepartitionLogement(nom, slug);
      liste.appendChild(bloc);

      bindComplement(`csg-lmnp-vous-${slug}`, `csg-lmnp-conjoint-${slug}`);
      bindComplement(`csg-lmnp-conjoint-${slug}`, `csg-lmnp-vous-${slug}`);
    });

    // Retirer les blocs des logements qui n'existent plus
    [...liste.children].forEach(bloc => {
      if (!slugsVus.has(bloc.dataset.logementKey)) bloc.remove();
    });
  }

  function majLmnp() {
    const lmnpPresent = hasLocationsMeubleesOuverts();
    const isMarriage = estMariagePacs();
    const affVous = container.querySelector('input[name="csg-affiliation-vous"]:checked')?.value;
    const affConjoint = container.querySelector('input[name="csg-affiliation-conjoint"]:checked')?.value;
    const statusDifferent = isMarriage && !!affVous && !!affConjoint && affVous !== affConjoint;
    const show = lmnpPresent && statusDifferent;
    const lmnpGroup = container.querySelector('#csg-lmnp-group');
    if (lmnpGroup) {
      if (show) renderLmnpRepartition();
      lmnpGroup.hidden = !show;
      lmnpGroup.querySelectorAll('input[type="number"]').forEach(inp => { inp.required = show; });
    }
  }

  majConjoint();
  majFonciers();
  majLmnp();

  bindComplement('csg-fonciers-vous', 'csg-fonciers-conjoint');
  bindComplement('csg-fonciers-conjoint', 'csg-fonciers-vous');

  container.addEventListener('change', (e) => {
    if (e.target.name === 'csg-affiliation-vous' || e.target.name === 'csg-affiliation-conjoint') {
      majFonciers();
      majLmnp();
    }
  });

  document.addEventListener('change', (e) => {
    if (e.target.name === 'situation-familiale') majConjoint();
  });

  // Re-vérifie à chaque réouverture du sous-formulaire
  const panel = container.closest('.sim-sous-formulaire, .sim-tuile-ouvert');
  if (panel) {
    new MutationObserver(() => {
      if (!panel.hidden) {
        majConjoint();
        majFonciers();
        majLmnp();
      }
    }).observe(panel, { attributes: true, attributeFilter: ['hidden'] });
  }
}

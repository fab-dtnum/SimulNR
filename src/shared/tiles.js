/**
 * Gestion de l'ouverture/fermeture des tuiles revenus.
 * - Variante A : expansion inline avec formulaire
 * - Variante B : navigation vers sous-formulaire, résumé après enregistrement
 *
 * Détecte la variante via data-variant="a"|"b" sur le body.
 * Les champs de formulaire sont injectés dynamiquement depuis forms.js.
 */

import * as FORMS from './forms.js';

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (e) => {
    const variant = document.body.dataset.variant || 'a';

    // Ajouter / Compléter → ouvre le formulaire
    const btnAjouter = e.target.closest('.sim-tuile__btn--ajouter');
    if (btnAjouter) {
      const wrapper = btnAjouter.closest('.sim-tuile-wrapper');
      if (!wrapper) return;
      if (variant === 'a') {
        ouvrirTuileA(wrapper);
      } else {
        naviguerVersFormulaire(wrapper.dataset.tile);
      }
      return;
    }

    // Supprimer → referme la tuile
    const btnSupprimer = e.target.closest('.sim-tuile__btn--supprimer');
    if (btnSupprimer) {
      const wrapper = btnSupprimer.closest('.sim-tuile-wrapper');
      supprimerTuile(wrapper);
      return;
    }

    // Modifier → ré-ouvre le formulaire (variante B)
    const btnModifier = e.target.closest('.sim-tuile__btn--modifier');
    if (btnModifier) {
      const wrapper = btnModifier.closest('.sim-tuile-wrapper');
      if (wrapper && variant === 'b') {
        naviguerVersFormulaire(wrapper.dataset.tile);
      }
      return;
    }

    // Annuler → retour vue d'ensemble (variante B)
    const btnAnnuler = e.target.closest('.sim-btn--annuler');
    if (btnAnnuler) {
      naviguerVersVueEnsemble();
      return;
    }

    // Enregistrer → sauvegarde résumé, retour vue d'ensemble (variante B)
    const btnEnregistrer = e.target.closest('.sim-btn--enregistrer');
    if (btnEnregistrer) {
      const formPage = btnEnregistrer.closest('.sim-sous-formulaire');
      if (formPage) enregistrerFormulaire(formPage);
      return;
    }
  });

  // ── Champs conditionnels ────────────────────────────────────────────────
  // Utilise la délégation pour couvrir les champs injectés dynamiquement.
  document.addEventListener('change', (e) => {
    const el = e.target;
    if (el.type !== 'radio') return;

    // Champ conjoint — Situation personnelle
    if (el.name === 'situation-familiale') {
      const isMarriage = el.value === 'mariage-pacs';
      const group = document.getElementById('conjoint-group');
      if (!group) return;
      group.hidden = !isMarriage;
      const input = group.querySelector('input');
      if (input) input.required = isMarriage;
    }
  });
});

// ── Injection des champs (source unique : forms.js) ──────────────────────────

function injecterChamps(container, tileName) {
  const fieldsEl = container.querySelector('[data-fields]');
  if (!fieldsEl || fieldsEl.dataset.injected) return;
  if (!FORMS[tileName]) return;
  fieldsEl.innerHTML = FORMS[tileName].template();
  fieldsEl.dataset.injected = 'true';
  if (typeof FORMS[tileName].init === 'function') {
    FORMS[tileName].init(fieldsEl);
  }
}

// ── Variante A ──────────────────────────────────────────────────────────────

function ouvrirTuileA(wrapper) {
  const tileName = wrapper.dataset.tile;
  const panel = wrapper.querySelector('.sim-tuile-ouvert--a');
  if (!panel) return;
  injecterChamps(panel, tileName);
  wrapper.querySelector('.sim-tuile').hidden = true;
  panel.hidden = false;
}

function supprimerTuile(wrapper) {
  if (!wrapper) return;
  wrapper.querySelector('.sim-tuile').hidden = false;
  wrapper.querySelectorAll('.sim-tuile-ouvert').forEach(p => { p.hidden = true; });
  // Vider le résumé (variante B)
  const resume = wrapper.querySelector('.sim-resume');
  if (resume) { resume.innerHTML = ''; resume.hidden = true; }
  // Réinitialiser les champs injectés pour forcer une ré-injection propre à la prochaine ouverture
  wrapper.querySelectorAll('[data-fields]').forEach(el => {
    el.innerHTML = '';
    delete el.dataset.injected;
  });
}

// ── Variante B : navigation ─────────────────────────────────────────────────

let _scrollAvantFormulaire = null;

function naviguerVersFormulaire(tileName) {
  const vueEnsemble = document.getElementById('vue-ensemble');
  const formPage = document.querySelector(`.sim-sous-formulaire[data-tile="${tileName}"]`);
  if (!formPage) return;
  injecterChamps(formPage, tileName);
  _scrollAvantFormulaire = window.scrollY;
  if (vueEnsemble) vueEnsemble.hidden = true;
  formPage.hidden = false;
  const wrapper = document.querySelector('.sim-wrapper');
  if (wrapper) wrapper.classList.add('sim-wrapper--sous-formulaire');
  scrollVersSommet();
}

function naviguerVersVueEnsemble({ scroll = true } = {}) {
  document.querySelectorAll('.sim-sous-formulaire').forEach(f => { f.hidden = true; });
  const vueEnsemble = document.getElementById('vue-ensemble');
  if (vueEnsemble) vueEnsemble.hidden = false;
  const wrapper = document.querySelector('.sim-wrapper');
  if (wrapper) wrapper.classList.remove('sim-wrapper--sous-formulaire');
  if (scroll && _scrollAvantFormulaire !== null) {
    window.scrollTo({ top: _scrollAvantFormulaire, behavior: 'instant' });
  }
}

function scrollVersSommet() {
  const wrapper = document.querySelector('.sim-wrapper');
  if (wrapper) wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Variante B : enregistrement ─────────────────────────────────────────────

function enregistrerFormulaire(formPage) {
  const tileName = formPage.dataset.tile;
  const wrapper = document.querySelector(`.sim-tuile-wrapper[data-tile="${tileName}"]`);

  if (wrapper) {
    const lignes = collecterResume(formPage);
    const resumeEl = wrapper.querySelector('.sim-resume');

    if (resumeEl && lignes.length > 0) {
      resumeEl.innerHTML = lignes.map(({ label, valeur }) =>
        `<div class="sim-resume__ligne">
          <span class="sim-resume__label">${label}</span>
          <strong class="sim-resume__valeur">${valeur}</strong>
        </div>`
      ).join('');
      resumeEl.hidden = false;
    }

    wrapper.querySelector('.sim-tuile').hidden = true;
    const panelB = wrapper.querySelector('.sim-tuile-ouvert--b');
    if (panelB) panelB.hidden = false;
  }

  naviguerVersVueEnsemble();
}

function collecterResume(formPage) {
  const lignes = [];

  // Champs numériques monétaires
  formPage.querySelectorAll('input[type="number"][data-resume-label]').forEach(input => {
    if (!input.value || input.closest('[hidden]')) return;
    const val = parseInt(input.value, 10).toLocaleString('fr-FR') + '\u00a0€';
    lignes.push({ label: input.dataset.resumeLabel, valeur: val });
  });

  // Champs année (sans symbole €)
  formPage.querySelectorAll('input[data-resume-type="annee"][data-resume-label]').forEach(input => {
    if (!input.value || input.closest('[hidden]')) return;
    lignes.push({ label: input.dataset.resumeLabel, valeur: input.value });
  });

  // Groupes radio
  formPage.querySelectorAll('fieldset[data-resume-label]').forEach(fieldset => {
    if (fieldset.closest('[hidden]')) return;
    const checked = fieldset.querySelector('input[type="radio"]:checked');
    if (checked) {
      const labelEl = fieldset.querySelector(`label[for="${checked.id}"]`);
      const valeur = labelEl ? labelEl.textContent.trim() : checked.value;
      lignes.push({ label: fieldset.dataset.resumeLabel, valeur });
    }
  });

  return lignes;
}

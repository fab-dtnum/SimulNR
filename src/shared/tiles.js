/**
 * Gestion de l'ouverture/fermeture des tuiles revenus.
 * - Variante A : expansion inline avec formulaire
 * - Variante B : navigation vers sous-formulaire, résumé après enregistrement
 *
 * Détecte la variante via data-variant="a"|"b" sur le body.
 * Les champs de formulaire sont injectés dynamiquement depuis forms.js.
 *
 * Tuiles répétables (data-tile-repeatable) : chaque entrée sauvegardée crée
 * une fiche indépendante insérée avant le wrapper ; le bouton "Ajouter" reste
 * toujours visible.
 */

import * as FORMS from './forms.js';
import { validateForm, initBlurValidation } from './validation.js';

document.addEventListener('DOMContentLoaded', () => {

  // ── Variante A : injection des panels pré-ouverts au chargement ─────────────
  if (document.body.dataset.variant === 'a') {
    document.querySelectorAll('.sim-tuile-wrapper').forEach(wrapper => {
      const panel = wrapper.querySelector('.sim-tuile-ouvert--a:not([hidden])');
      if (panel) injecterChamps(panel, wrapper.dataset.tile);
    });
  }

  // ── Variante A : validation au submit du formulaire ─────────────────────────
  const form = document.querySelector('form');
  if (form && document.body.dataset.variant === 'a') {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Valider tous les panels ouverts, y compris les fiches répétables clonées
      document.querySelectorAll('.sim-tuile-ouvert--a:not([hidden])').forEach(panel => {
        const wrapper = panel.closest('.sim-tuile-wrapper');
        const tileName = wrapper?.dataset.tile ?? panel.dataset.tile;
        if (!tileName) return;
        const messages = FORMS[tileName]?.messages ?? {};
        if (!validateForm(panel, messages)) isValid = false;
      });

      if (isValid) {
        // TODO : soumettre les données
      }
    });
  }

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
        _dernierBoutonActif = btnAjouter;
        naviguerVersFormulaire(wrapper.dataset.tile);
      }
      return;
    }

    // Supprimer → referme ou supprime la fiche
    const btnSupprimer = e.target.closest('.sim-tuile__btn--supprimer');
    if (btnSupprimer) {
      const wrapper = btnSupprimer.closest('.sim-tuile-wrapper');
      if (wrapper) {
        supprimerTuile(wrapper);
      } else {
        // Fiche clonée hors wrapper : supprimer directement
        btnSupprimer.closest('.sim-tuile-ouvert')?.remove();
      }
      return;
    }

    // Modifier → ré-ouvre le formulaire (variante B)
    const btnModifier = e.target.closest('.sim-tuile__btn--modifier');
    if (btnModifier && variant === 'b') {
      const wrapper = btnModifier.closest('.sim-tuile-wrapper');
      const tileEl = wrapper ?? btnModifier.closest('[data-tile]');
      if (tileEl) {
        _dernierBoutonActif = btnModifier;
        naviguerVersFormulaire(tileEl.dataset.tile);
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
  initBlurValidation(fieldsEl, FORMS[tileName]?.messages ?? {});
}

// ── Variante A ──────────────────────────────────────────────────────────────

function ouvrirTuileA(wrapper) {
  const tileName = wrapper.dataset.tile;
  const panel = wrapper.querySelector('.sim-tuile-ouvert--a');
  if (!panel) return;

  if ('tileRepeatable' in wrapper.dataset) {
    // Cloner le template et l'insérer avant le wrapper
    const clone = panel.cloneNode(true);
    clone.dataset.tile = tileName;
    clone.querySelectorAll('[data-fields]').forEach(el => {
      el.innerHTML = '';
      delete el.dataset.injected;
    });
    clone.hidden = false;
    wrapper.before(clone);
    injecterChamps(clone, tileName);
    return;
  }

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
let _dernierBoutonActif = null;

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
  // Déplacer le focus sur le titre du sous-formulaire pour les lecteurs d'écran
  const titre = formPage.querySelector('h2');
  if (titre) { titre.tabIndex = -1; titre.focus(); }
}

function naviguerVersVueEnsemble({ scroll = true, focusEl = null } = {}) {
  document.querySelectorAll('.sim-sous-formulaire').forEach(f => { f.hidden = true; });
  const vueEnsemble = document.getElementById('vue-ensemble');
  if (vueEnsemble) vueEnsemble.hidden = false;
  const wrapper = document.querySelector('.sim-wrapper');
  if (wrapper) wrapper.classList.remove('sim-wrapper--sous-formulaire');
  if (scroll && _scrollAvantFormulaire !== null) {
    window.scrollTo({ top: _scrollAvantFormulaire, behavior: 'instant' });
  }
  // Restaurer le focus sur l'élément déclenchant ou sur l'élément fourni
  const cible = focusEl ?? _dernierBoutonActif;
  if (cible) cible.focus();
  _dernierBoutonActif = null;
}

function scrollVersSommet() {
  const wrapper = document.querySelector('.sim-wrapper');
  if (wrapper) wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Variante B : enregistrement ─────────────────────────────────────────────

function enregistrerFormulaire(formPage) {
  const tileName = formPage.dataset.tile;
  const messages = FORMS[tileName]?.messages ?? {};
  if (!validateForm(formPage, messages)) return;

  const wrapper = document.querySelector(`.sim-tuile-wrapper[data-tile="${tileName}"]`);

  if (wrapper) {

    // ── Tuile répétable ───────────────────────────────────────────────────────
    if ('tileRepeatable' in wrapper.dataset) {
      let lignes = collecterResume(formPage);
      const panelTemplate = wrapper.querySelector('.sim-tuile-ouvert--b');

      if (panelTemplate) {
        const clone = panelTemplate.cloneNode(true);
        clone.dataset.tile = tileName;
        clone.hidden = false;

        // Remplissage spécifique personne à charge
        const prenom = formPage.querySelector('input[name="pac-intitule"]')?.value.trim();
        const prenomEl = clone.querySelector('[data-pac-prenom]');
        if (prenomEl) prenomEl.textContent = prenom || 'Personne à charge';

        const situationSelect = formPage.querySelector('select[name="pac-situation"]');
        const situationTexte = situationSelect?.selectedIndex > 0
          ? situationSelect.options[situationSelect.selectedIndex].text : '';
        const situationEl = clone.querySelector('[data-pac-situation]');
        if (situationEl) {
          situationEl.textContent = situationTexte;
          situationEl.hidden = !situationTexte;
        }

        lignes = lignes.filter(l => l.label !== 'Prénom' && l.label !== 'Situation');
        const resumeEl = clone.querySelector('.sim-resume');
        if (resumeEl && lignes.length > 0) {
          resumeEl.innerHTML = lignes.map(({ label, valeur }) =>
            `<div class="sim-resume__ligne">
              <span class="sim-resume__label">${label}</span>
              <strong class="sim-resume__valeur">${valeur}</strong>
            </div>`
          ).join('');
          resumeEl.hidden = false;
        }

        const btnModifier = clone.querySelector('.sim-tuile__btn--modifier');
        if (btnModifier) btnModifier.setAttribute('aria-label', 'Modifier Personne à charge');

        wrapper.before(clone);
      }

      // Réinitialiser le sous-formulaire pour la prochaine saisie
      formPage.querySelectorAll('[data-fields]').forEach(el => {
        el.innerHTML = '';
        delete el.dataset.injected;
      });

      const btnAjouter = wrapper.querySelector('.sim-tuile__btn--ajouter');
      naviguerVersVueEnsemble({ focusEl: btnAjouter ?? null });
      return;
    }

    // ── Tuile standard ────────────────────────────────────────────────────────
    let lignes = collecterResume(formPage);

    if (tileName === 'situationPersonnelle') {
      const demiPartSpecifique = formPage.querySelector(
        'input[name="demi-parts"]:checked:not([value="aucune"])'
      );
      lignes.push({ label: '1/2 part supplémentaire', valeur: demiPartSpecifique ? 'Oui' : 'Non' });
    }

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

    const btnModifier = panelB?.querySelector('.sim-tuile__btn--modifier');
    if (btnModifier) {
      const nomTuile = wrapper.querySelector('.sim-tuile__name')?.textContent.trim() ?? tileName;
      btnModifier.setAttribute('aria-label', `Modifier ${nomTuile}`);
    }

    naviguerVersVueEnsemble({ focusEl: btnModifier ?? null });
    return;
  }

  naviguerVersVueEnsemble();
}

function collecterResume(formPage) {
  const lignes = [];

  formPage.querySelectorAll('[data-resume-label]').forEach(el => {
    if (el.closest('[hidden]')) return;

    if (el.tagName === 'FIELDSET') {
      const checked = el.querySelector('input[type="radio"]:checked');
      if (!checked) return;
      const labelEl = el.querySelector(`label[for="${checked.id}"]`);
      const valeur = checked.dataset.resumeValue
        ?? (labelEl ? labelEl.textContent.trim() : checked.value);
      lignes.push({ label: el.dataset.resumeLabel, valeur });

    } else if (el.tagName === 'SELECT') {
      if (!el.value) return;
      lignes.push({ label: el.dataset.resumeLabel, valeur: el.options[el.selectedIndex].text });

    } else if (el.type === 'text') {
      if (!el.value) return;
      lignes.push({ label: el.dataset.resumeLabel, valeur: el.value });

    } else if (el.type === 'number') {
      if (!el.value) return;
      if (el.dataset.resumeType === 'annee') {
        lignes.push({ label: el.dataset.resumeLabel, valeur: el.value });
      } else {
        const val = parseInt(el.value, 10).toLocaleString('fr-FR') + ' €';
        lignes.push({ label: el.dataset.resumeLabel, valeur: val });
      }
    }
  });

  return lignes;
}

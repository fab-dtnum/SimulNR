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
      let premierErreur = null;

      // Valider tous les panels ouverts, y compris les fiches répétables clonées
      document.querySelectorAll('.sim-tuile-ouvert--a:not([hidden])').forEach(panel => {
        const wrapper = panel.closest('.sim-tuile-wrapper');
        const tileName = wrapper?.dataset.tile ?? panel.dataset.tile;
        if (!tileName) return;
        const messages = FORMS[tileName]?.messages ?? {};
        if (!validateForm(panel, messages)) {
          isValid = false;
          premierErreur ??= panel.querySelector('.fr-input-group--error, .fr-fieldset--error');
        }
      });

      // Vérifier qu'au moins un revenu est présent
      const errRev = validerRevenus();
      if (errRev) {
        isValid = false;
        premierErreur ??= errRev;
      }

      if (!isValid && premierErreur) {
        premierErreur.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      if (isValid) {
        afficherResultats();
      }
    });
  }

  // ── Variante B : validation au submit du formulaire ─────────────────────────
  if (form && document.body.dataset.variant === 'b') {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // 1. Situation personnelle obligatoire
      const errSP = validerSituationPersonnelleB();
      if (errSP) {
        errSP.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // 2. Au moins un revenu ajouté
      const errRev = validerRevenus();
      if (errRev) {
        errRev.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      afficherResultats();
    });
  }

  // Demi-parts : mise à jour en direct (variant A) ou via le sous-formulaire (variant B)
  document.addEventListener('change', (e) => {
    if (e.target.name === 'demi-parts') mettreAJourNombreParts();
  });

  document.addEventListener('click', (e) => {
    const variant = document.body.dataset.variant || 'a';

    // Ajouter / Compléter → ouvre le formulaire
    const btnAjouter = e.target.closest('.sim-tuile__btn--ajouter');
    if (btnAjouter) {
      const wrapper = btnAjouter.closest('.sim-tuile-wrapper');
      if (!wrapper) return;
      if (variant === 'a') {
        ouvrirTuileA(wrapper);
        majExonerationCsgDisabled();
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
        mettreAJourNombreParts();
      }
      majExonerationCsgDisabled();
      return;
    }

    // Modifier → ré-ouvre le formulaire (variante B)
    const btnModifier = e.target.closest('.sim-tuile__btn--modifier');
    if (btnModifier && variant === 'b') {
      const wrapper = btnModifier.closest('.sim-tuile-wrapper');
      const tileEl = wrapper ?? btnModifier.closest('[data-tile]');
      if (tileEl) {
        _dernierBoutonActif = btnModifier;
        // Clone hors wrapper = modification d'une fiche existante (tuile répétable)
        if (!wrapper) _cloneEnCoursDEdition = tileEl;
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
    mettreAJourNombreParts();
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
let _cloneEnCoursDEdition = null;

function naviguerVersFormulaire(tileName) {
  const vueEnsemble = document.getElementById('vue-ensemble');
  const formPage = document.querySelector(`.sim-sous-formulaire[data-tile="${tileName}"]`);
  if (!formPage) return;
  injecterChamps(formPage, tileName);
  if (_cloneEnCoursDEdition?.dataset.formValues) {
    preremplirFormulaire(formPage, JSON.parse(_cloneEnCoursDEdition.dataset.formValues));
  }
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
  _cloneEnCoursDEdition = null;

  // Effacer les erreurs de validation si la condition est maintenant résolue
  const spWrapper = document.querySelector('.sim-tuile-wrapper[data-tile="situationPersonnelle"]');
  if (spWrapper?.classList.contains('sim-tuile-wrapper--erreur') && spWrapper.querySelector('.sim-tuile')?.hidden) {
    spWrapper.classList.remove('sim-tuile-wrapper--erreur');
    spWrapper.querySelector('.sim-tuile__msg-erreur')?.remove();
  }
  const errRevenu = document.getElementById('erreur-revenus');
  const section = document.querySelector('section[aria-labelledby="titre-revenus"]');
  if (errRevenu && section?.querySelector('.sim-tuile-wrapper .sim-tuile[hidden]')) {
    errRevenu.hidden = true;
  }
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
      let focusCible = wrapper.querySelector('.sim-tuile__btn--ajouter') ?? null;

      // Sérialiser les valeurs du formulaire pour permettre la ré-édition
      const formValues = {};
      formPage.querySelectorAll('[data-fields] input, [data-fields] select, [data-fields] textarea').forEach(field => {
        if (!field.name) return;
        if (field.type === 'radio' || field.type === 'checkbox') {
          if (field.checked) formValues[field.name] = field.value;
        } else {
          formValues[field.name] = field.value;
        }
      });

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
        focusCible = btnModifier ?? focusCible;

        clone.dataset.formValues = JSON.stringify(formValues);

        if (_cloneEnCoursDEdition) {
          // Modification d'une fiche existante : remplacer le clone en place
          _cloneEnCoursDEdition.replaceWith(clone);
          _cloneEnCoursDEdition = null;
        } else {
          // Nouvelle fiche : insérer avant le wrapper
          wrapper.before(clone);
          mettreAJourNombreParts();
        }
      }

      // Réinitialiser le sous-formulaire pour la prochaine saisie
      formPage.querySelectorAll('[data-fields]').forEach(el => {
        el.innerHTML = '';
        delete el.dataset.injected;
      });

      majExonerationCsgDisabled();
      naviguerVersVueEnsemble({ focusEl: focusCible });
      return;
    }

    // ── Tuile standard ────────────────────────────────────────────────────────
    let lignes = collecterResume(formPage);

    if (tileName === 'situationPersonnelle') {
      const demiPartSpecifique = formPage.querySelector(
        'input[name="demi-parts"]:checked:not([value="aucune"])'
      );
      lignes.push({ label: '1/2 part supplémentaire', valeur: demiPartSpecifique ? 'Oui' : 'Non' });
      mettreAJourNombreParts();
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
      const nomTuile = wrapper.querySelector('.sim-tuile .fr-h6')?.textContent.trim() ?? tileName;
      btnModifier.setAttribute('aria-label', `Modifier ${nomTuile}`);
    }

    majExonerationCsgDisabled();
    naviguerVersVueEnsemble({ focusEl: btnModifier ?? null });
    return;
  }

  naviguerVersVueEnsemble();
}

function mettreAJourNombreParts() {
  const badge = document.getElementById('nombre-parts-badge');
  if (!badge) return;

  let parts = 1;

  // +1 par personne à charge (fiches clonées visibles, hors template caché dans le wrapper)
  parts += document.querySelectorAll(
    '.sim-tuile-ouvert[data-tile="personneACharge"]:not([hidden])'
  ).length;

  // +0.5 si au moins une demi-part spécifique est cochée
  if (document.querySelector('input[name="demi-parts"]:checked:not([value="aucune"])')) {
    parts += 0.5;
  }

  const strong = badge.querySelector('strong');
  if (strong) {
    strong.textContent = Number.isInteger(parts) ? String(parts) : parts.toLocaleString('fr-FR');
  }
}

// ── Pré-remplissage du formulaire (mode édition) ─────────────────────────────

function preremplirFormulaire(formPage, values) {
  const fieldsEl = formPage.querySelector('[data-fields]');
  if (!fieldsEl) return;

  // Les selects en premier : leur changement peut déclencher la visibilité conditionnelle d'autres champs
  fieldsEl.querySelectorAll('select').forEach(field => {
    if (!(field.name in values)) return;
    field.value = values[field.name];
    field.dispatchEvent(new Event('change', { bubbles: true }));
  });

  fieldsEl.querySelectorAll('input, textarea').forEach(field => {
    if (!field.name || !(field.name in values)) return;
    if (field.type === 'radio' || field.type === 'checkbox') {
      field.checked = field.value === values[field.name];
    } else {
      field.value = values[field.name];
    }
  });
}

// ── Exonération CSG-CRDS : activation conditionnelle ────────────────────────

function majExonerationCsgDisabled() {
  const actif =
    !!document.querySelector('.sim-tuile-wrapper[data-tile="fonciers"] .sim-tuile[hidden]') ||
    !!document.querySelector('.sim-tuile-wrapper[data-tile="lmnp"] .sim-tuile[hidden]');
  document.querySelectorAll('.sim-tuile-wrapper[data-tile="exonerationCsg"] .sim-tuile').forEach(btn => {
    btn.disabled = !actif;
  });
}

// ── Validation du bouton Calculer ────────────────────────────────────────────

function validerSituationPersonnelleB() {
  const wrapper = document.querySelector('.sim-tuile-wrapper[data-tile="situationPersonnelle"]');
  if (!wrapper) return null;

  const tuile = wrapper.querySelector('.sim-tuile');
  const estComplete = tuile?.hidden === true;

  if (!estComplete) {
    wrapper.classList.add('sim-tuile-wrapper--erreur');
    let errEl = wrapper.querySelector('.sim-tuile__msg-erreur');
    if (!errEl) {
      errEl = document.createElement('div');
      errEl.className = 'fr-messages-group sim-tuile__msg-erreur';
      errEl.innerHTML = '<p class="fr-message fr-message--error">Veuillez compléter cette rubrique.</p>';
      tuile?.after(errEl);
    }
    errEl.hidden = false;
    return wrapper;
  }

  wrapper.classList.remove('sim-tuile-wrapper--erreur');
  wrapper.querySelector('.sim-tuile__msg-erreur')?.remove();
  return null;
}

function validerRevenus() {
  const section = document.querySelector('section[aria-labelledby="titre-revenus"]');
  if (!section) return null;

  const hasRevenu = !!section.querySelector('.sim-tuile-wrapper .sim-tuile[hidden]');
  const tuilesList = section.querySelector('.sim-tuiles-list');
  const erreurId = 'erreur-revenus';
  let erreurEl = document.getElementById(erreurId);

  if (!hasRevenu) {
    if (!erreurEl) {
      erreurEl = document.createElement('div');
      erreurEl.id = erreurId;
      erreurEl.className = 'fr-alert fr-alert--error fr-alert--sm';
      erreurEl.innerHTML = '<p>Veuillez ajouter au moins une source de revenus pour calculer votre imposition.</p>';
      tuilesList?.before(erreurEl);
    }
    erreurEl.hidden = false;
    return erreurEl;
  }

  if (erreurEl) erreurEl.hidden = true;
  return null;
}

// ── Affichage des résultats ──────────────────────────────────────────────────

function afficherResultats() {
  const section = document.getElementById('sim-resultats');
  if (!section) return;

  // Valeurs de démo (POC)
  const ir    = 2000;
  const ps    = 1720;
  const total = ir + ps;
  const fmt   = n => n.toLocaleString('fr-FR') + ' €';

  const elIr    = document.getElementById('sim-res-ir');
  const elPs    = document.getElementById('sim-res-ps');
  const elTotal = document.getElementById('sim-res-total');
  if (elIr)    elIr.textContent    = fmt(ir);
  if (elPs)    elPs.textContent    = fmt(ps);
  if (elTotal) elTotal.textContent = fmt(total);

  // Réinitialiser : résumé visible, détail masqué
  const resume = document.getElementById('sim-res-resume');
  const detail = document.getElementById('sim-resultats-detail');
  if (resume) resume.hidden = false;
  if (detail) {
    detail.hidden = true;
    detail.innerHTML = `
      <div class="sim-resultats__section">
        <p class="sim-resultats__section-titre">Situation et charges de famille</p>
        <div class="sim-resultats__ligne sim-resultats__ligne--bold">
          <span>Nombre de parts</span><span>1,00</span>
        </div>
      </div>
      <div class="sim-resultats__sep"></div>
      <div class="sim-resultats__section">
        <p class="sim-resultats__section-titre">Impôts sur le revenu</p>
        <div class="sim-resultats__bloc">
          <div class="sim-resultats__ligne"><span>Revenus fonciers nets</span><span>${fmt(10000)}</span></div>
          <div class="sim-resultats__ligne"><span>Revenu brut global</span><span>${fmt(10000)}</span></div>
          <div class="sim-resultats__ligne"><span>Revenu imposable</span><span>${fmt(10000)}</span></div>
          <p class="sim-resultats__mention">Application du taux minimum</p>
        </div>
        <div class="sim-resultats__ligne sim-resultats__ligne--bold">
          <span>Total de l'impôt sur le revenu net</span><span>${fmt(ir)}</span>
        </div>
      </div>
      <div class="sim-resultats__sep"></div>
      <div class="sim-resultats__section">
        <p class="sim-resultats__section-titre">Prélèvements sociaux</p>
        <div class="sim-resultats__ligne"><span>Base imposable</span><span>${fmt(10000)}</span></div>
        <div class="sim-resultats__sous-bloc">
          <p class="sim-resultats__sous-bloc-titre">CSG-CRDS</p>
          <div class="sim-resultats__ligne"><span>Taux d'imposition</span><span>9,70 %</span></div>
          <div class="sim-resultats__ligne"><span>Montant d'imposition</span><span>${fmt(970)}</span></div>
        </div>
        <div class="sim-resultats__sous-bloc">
          <p class="sim-resultats__sous-bloc-titre">Prélèvement solidarité</p>
          <div class="sim-resultats__ligne"><span>Taux d'imposition</span><span>7,50 %</span></div>
          <div class="sim-resultats__ligne"><span>Montant d'imposition</span><span>${fmt(750)}</span></div>
        </div>
        <div class="sim-resultats__ligne sim-resultats__ligne--bold">
          <span>Total des prélèvements sociaux</span><span>${fmt(ps)}</span>
        </div>
      </div>
      <div class="sim-resultats__sep"></div>`;
  }

  // Réinitialiser et câbler le bouton
  const btnDetail = document.getElementById('sim-btn-detail');
  if (btnDetail) {
    btnDetail.classList.remove('fr-icon-arrow-up-s-line');
    btnDetail.classList.add('fr-icon-arrow-down-s-line');
    btnDetail.textContent = 'Afficher le détail';

    if (!btnDetail.dataset.wired) {
      btnDetail.dataset.wired = 'true';
      btnDetail.addEventListener('click', () => {
        const det = document.getElementById('sim-resultats-detail');
        const res = document.getElementById('sim-res-resume');
        const willExpand = det.hidden;
        det.hidden = !willExpand;
        if (res) res.hidden = willExpand;
        if (willExpand) {
          btnDetail.classList.remove('fr-icon-arrow-down-s-line');
          btnDetail.classList.add('fr-icon-arrow-up-s-line');
          btnDetail.textContent = 'Masquer le détail';
        } else {
          btnDetail.classList.remove('fr-icon-arrow-up-s-line');
          btnDetail.classList.add('fr-icon-arrow-down-s-line');
          btnDetail.textContent = 'Afficher le détail';
        }
      });
    }
  }

  section.hidden = false;
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function collecterResume(formPage) {
  const lignes = [];

  formPage.querySelectorAll('[data-resume-label]').forEach(el => {
    if (el.closest('[hidden]')) return;

    if (el.dataset.resumeType === 'repartition-pct') {
      const inputs = [...el.querySelectorAll('input[type="number"]')];
      const vals = inputs.map(i => i.value !== '' ? parseInt(i.value, 10) + ' %' : '—');
      lignes.push({ label: el.dataset.resumeLabel, valeur: vals.join(' | ') });

    } else if (el.tagName === 'FIELDSET') {
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

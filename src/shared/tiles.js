/**
 * Gestion de l'ouverture/fermeture des tuiles revenus.
 * Navigation par sous-formulaire, résumé après enregistrement.
 *
 * Tuiles répétables (data-tile-repeatable) : chaque entrée sauvegardée crée
 * une fiche indépendante insérée avant le wrapper ; le bouton "Ajouter" reste
 * toujours visible.
 */

import * as FORMS from './forms.js';
import { validateForm, initBlurValidation, setError } from './validation.js';
import { afficherResultats } from './results.js';
import { collecterResume, preremplirFormulaire } from './form-utils.js';
import { fragmentsLoaded } from './loader.js';
import {
  hasFonciersOuverts, hasLocationsMeubleesOuverts,
  estLocationsMeubleesRegimeReel, estLocationsMeubleesCategorieLmnp,
} from './state.js';

document.addEventListener('DOMContentLoaded', () => {

  // Désactive le bouton Calculer jusqu'à ce que les fragments soient injectés
  const submitBtn = document.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    fragmentsLoaded.then(() => { submitBtn.disabled = false; });
  }

  // ── Validation au submit ─────────────────────────────────────────────────────
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // 1. Situation personnelle obligatoire
      const errSP = validerSituationPersonnelle();
      if (errSP) {
        errSP.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // 2. PAC obligatoire si parent seul coché
      const errPac = validerPersonnesACharge();
      if (errPac) {
        errPac.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // 3. Au moins un revenu ajouté
      const errRev = validerRevenus();
      if (errRev) {
        errRev.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      afficherResultats();
    });
  }

  // Demi-parts : mise à jour via le sous-formulaire
  document.addEventListener('change', (e) => {
    if (e.target.name === 'demi-parts') mettreAJourNombreParts();
  });

  document.addEventListener('click', (e) => {

    // Ajouter / Compléter → ouvre le formulaire
    const btnAjouter = e.target.closest('.sim-tuile__btn--ajouter');
    if (btnAjouter) {
      if (btnAjouter.getAttribute('aria-disabled') === 'true') return;
      const wrapper = btnAjouter.closest('.sim-tuile-wrapper');
      if (!wrapper) return;
      _dernierBoutonActif = btnAjouter;
      naviguerVersFormulaire(wrapper.dataset.tile);
      return;
    }

    // Supprimer → referme ou supprime la fiche
    const btnSupprimer = e.target.closest('.sim-tuile__btn--supprimer');
    if (btnSupprimer) {
      const wrapper = btnSupprimer.closest('.sim-tuile-wrapper');
      if (wrapper) {
        supprimerTuile(wrapper);
      } else {
        // Fiche clonée hors wrapper (tuile répétable) : supprimer et rendre le focus
        const clone = btnSupprimer.closest('.sim-tuile-ouvert');
        const tileName = clone?.dataset.tile;
        const btnAjouter = tileName
          ? document.querySelector(`.sim-tuile-wrapper[data-tile="${tileName}"] .sim-tuile`)
          : null;
        clone?.remove();
        mettreAJourNombreParts();
        if (btnAjouter) btnAjouter.focus();
      }
      majExonerationCsgDisabled();
      return;
    }

    // Modifier → ré-ouvre le formulaire
    const btnModifier = e.target.closest('.sim-tuile__btn--modifier');
    if (btnModifier) {
      const wrapper = btnModifier.closest('.sim-tuile-wrapper');
      const tileEl = wrapper ?? btnModifier.closest('[data-tile]');
      if (tileEl) {
        _dernierBoutonActif = btnModifier;
        // Clone hors wrapper = modification d'une fiche existante (tuile répétable)
        if (!wrapper) _cloneEnCoursDEdition = tileEl;
        let cible = tileEl.dataset.tile;
        // Depuis la vue d'ensemble, "Modifier" sur la tuile de synthèse
        // Locations meublées rouvre le hub (pas directement le Général) —
        // le résumé partiel du hub porte le même data-tile="locationsMeublees"
        // pour son propre bouton Modifier, qui lui doit ouvrir le Général.
        if (cible === 'locationsMeublees' && wrapper?.closest('#vue-ensemble')) {
          cible = 'locationsMeubleesHub';
        }
        naviguerVersFormulaire(cible);
      }
      return;
    }

    // Annuler → retour vue d'ensemble, ou au hub si on vient du hub
    const btnAnnuler = e.target.closest('.sim-btn--annuler');
    if (btnAnnuler) {
      const formPage = btnAnnuler.closest('.sim-sous-formulaire');
      const tileName = formPage?.dataset.tile;

      if (tileName === 'locationsMeubleesLogement') {
        naviguerVersFormulaire('locationsMeubleesHub');
        return;
      }
      if (tileName === 'locationsMeublees') {
        const generalDejaEnregistre = !!document
          .querySelector('#vue-ensemble .sim-tuile-wrapper[data-tile="locationsMeublees"] .sim-tuile-ouvert--b')
          ?.dataset.formValues;
        if (generalDejaEnregistre) {
          naviguerVersFormulaire('locationsMeubleesHub');
          return;
        }
      }
      if (tileName === 'locationsMeubleesHub') {
        const wrapperVue = document.querySelector('#vue-ensemble .sim-tuile-wrapper[data-tile="locationsMeublees"]');
        const focusEl = wrapperVue?.querySelector('.sim-tuile:not([hidden]), .sim-tuile-ouvert--b .sim-tuile__btn--modifier');
        naviguerVersVueEnsemble({ focusEl });
        return;
      }

      naviguerVersVueEnsemble();
      return;
    }

    // Enregistrer → sauvegarde résumé, retour vue d'ensemble
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
  if (typeof FORMS[tileName].init === 'function') {
    FORMS[tileName].init(fieldsEl);
  }
  fieldsEl.dataset.injected = 'true';
  initBlurValidation(fieldsEl, FORMS[tileName]?.messages ?? {});
}

// ── Navigation ───────────────────────────────────────────────────────────────

let _scrollAvantFormulaire = null;
let _dernierBoutonActif = null;
let _cloneEnCoursDEdition = null;

function naviguerVersFormulaire(tileName) {
  const vueEnsemble = document.getElementById('vue-ensemble');
  const formPage = document.querySelector(`.sim-sous-formulaire[data-tile="${tileName}"]`);
  if (!formPage) return;
  injecterChamps(formPage, tileName);
  if (tileName === 'locationsMeubleesHub') verifierLogementsIncomplets();
  // Fiche rouverte alors qu'elle était en erreur (cf. verifierLogementsIncomplets) :
  // signale tout de suite le(s) champ(s) devenu(s) obligatoire(s) à compléter, sans
  // attendre une tentative d'enregistrement. La validation doit avoir lieu une fois
  // le formulaire affiché (hidden=false) : tant qu'il est masqué, tous ses champs
  // sont considérés comme cachés par validateForm() et ne sont donc pas vérifiés.
  const aValiderApresAffichage = !!_cloneEnCoursDEdition?.classList.contains('sim-tuile-ouvert--erreur');

  if (_cloneEnCoursDEdition?.dataset.formValues) {
    preremplirFormulaire(formPage, JSON.parse(_cloneEnCoursDEdition.dataset.formValues));
  } else {
    // Tuile standard : restaurer les valeurs précédemment saisies si disponibles
    const wrapperStd = document.querySelector(`#vue-ensemble .sim-tuile-wrapper[data-tile="${tileName}"]`);
    const panelBStd = wrapperStd?.querySelector('.sim-tuile-ouvert--b');
    if (panelBStd?.dataset.formValues) {
      preremplirFormulaire(formPage, JSON.parse(panelBStd.dataset.formValues));
    }
  }
  // Ne capturer le scroll qu'en quittant réellement la vue d'ensemble (pas lors
  // d'un enchaînement Général → Hub → Logement), pour restaurer le bon point de
  // départ une fois revenu à la vue d'ensemble.
  if (vueEnsemble && !vueEnsemble.hidden) {
    _scrollAvantFormulaire = window.scrollY;
  }
  if (vueEnsemble) vueEnsemble.hidden = true;
  // Masquer tout autre sous-formulaire déjà affiché (cas des écrans chaînés
  // Général → Hub → Logement, où l'on ne repasse pas par la vue d'ensemble).
  document.querySelectorAll('.sim-sous-formulaire').forEach(f => {
    if (f !== formPage) f.hidden = true;
  });
  formPage.hidden = false;
  if (aValiderApresAffichage) validateForm(formPage, FORMS[tileName]?.messages ?? {});
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

  const pacWrapper = document.querySelector('.sim-tuile-wrapper[data-tile="personneACharge"]');
  if (pacWrapper?.classList.contains('sim-tuile-wrapper--erreur')) {
    const parentSeulCoche = !!document.querySelector('input[name="dp-parent-seul"]:checked');
    const hasAnyPac = document.querySelectorAll('.sim-tuile-ouvert[data-tile="personneACharge"]').length > 0;
    if (!parentSeulCoche || hasAnyPac) {
      pacWrapper.classList.remove('sim-tuile-wrapper--erreur');
      pacWrapper.querySelector('.sim-tuile__msg-erreur')?.remove();
    }
  }
}

function scrollVersSommet() {
  const wrapper = document.querySelector('.sim-wrapper');
  if (wrapper) wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Enregistrement ───────────────────────────────────────────────────────────

function enregistrerFormulaire(formPage) {
  const tileName = formPage.dataset.tile;
  const messages = FORMS[tileName]?.messages ?? {};
  if (!validateForm(formPage, messages)) return;

  // ── Cas spécial : écran "Général" des Locations meublées ───────────────────
  // Ne révèle pas encore la tuile de synthèse de la vue d'ensemble : ça n'arrive
  // qu'à la validation du hub (au moins un logement ajouté). Le résumé est stocké à
  // la fois dans la tuile de vue d'ensemble (masquée, pour plus tard) et dans le
  // résumé partiel toujours visible du hub.
  if (tileName === 'locationsMeublees') {
    const lignes = collecterResume(formPage);
    const resumeHtml = lignes.map(({ label, valeur }) =>
      `<div class="sim-resume__ligne">
        <span class="sim-resume__label">${label}</span>
        <strong class="sim-resume__valeur">${valeur}</strong>
      </div>`
    ).join('');

    const formValues = {};
    formPage.querySelectorAll('[data-fields] input, [data-fields] select, [data-fields] textarea').forEach(field => {
      if (!field.name) return;
      if (field.type === 'radio' || field.type === 'checkbox') {
        if (field.checked) formValues[field.name] = field.value;
      } else {
        formValues[field.name] = field.value;
      }
    });

    const wrapperVue = document.querySelector('#vue-ensemble .sim-tuile-wrapper[data-tile="locationsMeublees"]');
    const panelB = wrapperVue?.querySelector('.sim-tuile-ouvert--b');
    if (panelB) {
      const resumeEl = panelB.querySelector('.sim-resume');
      if (resumeEl) { resumeEl.innerHTML = resumeHtml; resumeEl.hidden = lignes.length === 0; }
      panelB.dataset.formValues = JSON.stringify(formValues);
      // Stocké à part : reconstruit à la validation du hub avec le détail de
      // chaque logement (cf. construireResumeVueEnsembleLocationsMeublees).
      panelB.dataset.generalResumeHtml = resumeHtml;
    }

    const hubResumeEl = document.querySelector('.sim-sous-formulaire[data-tile="locationsMeubleesHub"] .sim-resume');
    if (hubResumeEl) { hubResumeEl.innerHTML = resumeHtml; hubResumeEl.hidden = lignes.length === 0; }

    naviguerVersFormulaire('locationsMeubleesHub');
    return;
  }

  // ── Cas spécial : hub des Locations meublées (validation finale) ───────────
  if (tileName === 'locationsMeubleesHub') {
    const nbLogements = document.querySelectorAll('.sim-tuile-ouvert[data-tile="locationsMeubleesLogement"]').length;
    const erreurId = 'erreur-locations-meublees-hub';
    let erreurEl = document.getElementById(erreurId);

    if (nbLogements === 0) {
      if (!erreurEl) {
        erreurEl = document.createElement('div');
        erreurEl.id = erreurId;
        erreurEl.className = 'fr-alert fr-alert--error fr-alert--sm';
        erreurEl.innerHTML = '<p>Veuillez ajouter un logement mis en location meublée.</p>';
        formPage.querySelector('[data-lm-logements-liste]')?.after(erreurEl);
      }
      erreurEl.hidden = false;
      erreurEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (erreurEl) erreurEl.hidden = true;

    // Un logement devenu incomplet (régime/catégorie modifiés depuis le Général)
    // doit être mis à jour avant de pouvoir valider la page.
    const logementEnErreur = document.querySelector('.sim-tuile-ouvert--erreur[data-tile="locationsMeubleesLogement"]');
    if (logementEnErreur) {
      logementEnErreur.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const wrapperVue = document.querySelector('#vue-ensemble .sim-tuile-wrapper[data-tile="locationsMeublees"]');
    const panelB = wrapperVue?.querySelector('.sim-tuile-ouvert--b');
    if (wrapperVue) wrapperVue.querySelector('.sim-tuile').hidden = true;
    construireResumeVueEnsembleLocationsMeublees();
    if (panelB) panelB.hidden = false;
    const btnModifier = panelB?.querySelector('.sim-tuile__btn--modifier');

    majExonerationCsgDisabled();
    naviguerVersVueEnsemble({ focusEl: btnModifier ?? null });
    return;
  }

  // Non scopé à #vue-ensemble : contrairement à "locationsMeublees" (traité plus
  // haut), le wrapper répétable "locationsMeubleesLogement" vit dans l'écran hub.
  const wrapper = document.querySelector(`.sim-tuile-wrapper[data-tile="${tileName}"]`);

  if (wrapper) {

    // ── Tuile répétable ───────────────────────────────────────────────────────
    if ('tileRepeatable' in wrapper.dataset) {

      // Vérifier l'unicité du prénom entre fiches PAC
      const prenomInput = formPage.querySelector('input[name="pac-intitule"]');
      if (prenomInput) {
        const prenomVal = prenomInput.value.trim().toLowerCase();
        const existingPacs = [...document.querySelectorAll(`.sim-tuile-ouvert[data-tile="${tileName}"]`)];
        const isDuplicate = existingPacs.some(fiche => {
          if (fiche === _cloneEnCoursDEdition) return false;
          return fiche.querySelector('[data-pac-prenom]')?.textContent.trim().toLowerCase() === prenomVal;
        });
        if (isDuplicate) {
          setError(prenomInput, messages['pac-intitule']?.prenomDuplique ?? 'Ce prénom est déjà utilisé.');
          prenomInput.focus();
          return;
        }
      }

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

        const existingFiches = [...document.querySelectorAll(`.sim-tuile-ouvert[data-tile="${tileName}"]`)];
        const index = _cloneEnCoursDEdition
          ? existingFiches.indexOf(_cloneEnCoursDEdition) + 1
          : existingFiches.length + 1;
        let titre = '';

        if (tileName === 'personneACharge') {
          // Remplissage spécifique personne à charge
          const prenom = formPage.querySelector('input[name="pac-intitule"]')?.value.trim();
          titre = prenom || `Personne à charge ${index}`;
          const prenomEl = clone.querySelector('[data-pac-prenom]');
          if (prenomEl) prenomEl.textContent = titre;

          const situationSelect = formPage.querySelector('select[name="pac-situation"]');
          const situationTexte = situationSelect?.selectedIndex > 0
            ? situationSelect.options[situationSelect.selectedIndex].text : '';
          const situationEl = clone.querySelector('[data-pac-situation]');
          if (situationEl) {
            situationEl.textContent = situationTexte;
            situationEl.hidden = !situationTexte;
          }

          lignes = lignes.filter(l => l.label !== 'Prénom' && l.label !== 'Situation');
        } else if (tileName === 'locationsMeubleesLogement') {
          // Remplissage spécifique logement en location meublée
          const nom = formPage.querySelector('input[name="lm-logement-nom"]')?.value.trim();
          titre = nom || `Logement meublé ${index}`;
          const nomEl = clone.querySelector('[data-lm-logement-nom]');
          if (nomEl) nomEl.textContent = titre;
        }

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
        if (btnModifier && titre) btnModifier.setAttribute('aria-label', `Modifier ${titre}`);
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

      if (tileName === 'locationsMeubleesLogement') {
        // Retour au hub (pas à la vue d'ensemble) : le logement vient s'ajouter à
        // la liste qui vit dans l'écran hub, pas dans la vue d'ensemble.
        naviguerVersFormulaire('locationsMeubleesHub');
      } else {
        naviguerVersVueEnsemble({ focusEl: focusCible });
      }
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

    // Sérialiser les valeurs pour la ré-édition
    const formValues = {};
    formPage.querySelectorAll('[data-fields] input, [data-fields] select, [data-fields] textarea').forEach(field => {
      if (!field.name) return;
      if (field.type === 'radio' || field.type === 'checkbox') {
        if (field.checked) formValues[field.name] = field.value;
      } else {
        formValues[field.name] = field.value;
      }
    });

    wrapper.querySelector('.sim-tuile').hidden = true;
    const panelB = wrapper.querySelector('.sim-tuile-ouvert--b');
    if (panelB) {
      panelB.hidden = false;
      panelB.dataset.formValues = JSON.stringify(formValues);
    }

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

// Résumé de la tuile "Locations meublées" en vue d'ensemble : le résumé
// général (catégorie/régime/déficits), puis le détail de chaque logement
// ajouté, séparés par un simple trait, comme sur la maquette Figma.
function construireResumeVueEnsembleLocationsMeublees() {
  const wrapperVue = document.querySelector('#vue-ensemble .sim-tuile-wrapper[data-tile="locationsMeublees"]');
  const panelB = wrapperVue?.querySelector('.sim-tuile-ouvert--b');
  const resumeEl = panelB?.querySelector('.sim-resume');
  if (!panelB || !resumeEl) return;

  resumeEl.innerHTML = panelB.dataset.generalResumeHtml ?? '';

  document.querySelectorAll('.sim-tuile-ouvert[data-tile="locationsMeubleesLogement"]').forEach(clone => {
    const nom = clone.querySelector('[data-lm-logement-nom]')?.textContent.trim() ?? '';
    const resumeLogementHtml = clone.querySelector('.sim-resume')?.innerHTML ?? '';

    const separateur = document.createElement('div');
    separateur.className = 'sim-resume__separateur';
    resumeEl.appendChild(separateur);

    const titre = document.createElement('p');
    titre.className = 'sim-resume__logement-nom';
    titre.textContent = nom;
    resumeEl.appendChild(titre);

    const detail = document.createElement('div');
    detail.innerHTML = resumeLogementHtml; // déjà échappé (valeurs numériques/select)
    resumeEl.append(...detail.childNodes);
  });

  resumeEl.hidden = false;
}

function supprimerTuile(wrapper) {
  if (!wrapper) return;
  const btn = wrapper.querySelector('.sim-tuile');
  if (btn) btn.hidden = false;
  wrapper.querySelectorAll('.sim-tuile-ouvert').forEach(p => { p.hidden = true; });
  // Vider le résumé et les valeurs sauvegardées
  const panelB = wrapper.querySelector('.sim-tuile-ouvert--b');
  if (panelB) { delete panelB.dataset.formValues; delete panelB.dataset.generalResumeHtml; }
  const resume = wrapper.querySelector('.sim-resume');
  if (resume) { resume.innerHTML = ''; resume.hidden = true; }
  // Réinitialiser les champs injectés pour forcer une ré-injection propre
  wrapper.querySelectorAll('[data-fields]').forEach(el => {
    el.innerHTML = '';
    delete el.dataset.injected;
  });

  // Locations meublées : vider aussi le hub (résumé partiel + liste des logements),
  // qui vit dans un sous-formulaire séparé et n'est pas nettoyé par ce qui précède.
  if (wrapper.dataset.tile === 'locationsMeublees') {
    document.querySelectorAll('.sim-tuile-ouvert[data-tile="locationsMeubleesLogement"]').forEach(el => el.remove());
    const hubResume = document.querySelector('.sim-sous-formulaire[data-tile="locationsMeubleesHub"] .sim-resume');
    if (hubResume) { hubResume.innerHTML = ''; hubResume.hidden = true; }
    document.getElementById('erreur-locations-meublees-hub')?.setAttribute('hidden', '');
  }

  if (btn) btn.focus();
}

// ── Nombre de parts ──────────────────────────────────────────────────────────

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

// ── Exonération CSG-CRDS : activation conditionnelle ────────────────────────

function majExonerationCsgDisabled() {
  const actif = hasFonciersOuverts() || hasLocationsMeubleesOuverts();
  document.querySelectorAll('.sim-tuile-wrapper[data-tile="exonerationCsg"] .sim-tuile').forEach(btn => {
    if (actif) {
      btn.removeAttribute('aria-disabled');
    } else {
      btn.setAttribute('aria-disabled', 'true');
    }
  });
}

// ── Locations meublées : logements devenus incomplets ───────────────────────

// Modifier le régime ou la catégorie dans le Général peut rendre incomplètes
// des fiches logement déjà enregistrées (ex : charges déductibles jamais
// demandées si le régime était micro-BIC, catégorie touristique jamais
// demandée si on n'était pas en LMNP + micro-BIC). On marque ces fiches en
// erreur tant qu'elles n'ont pas été rouvertes et complétées via "Modifier".
function verifierLogementsIncomplets() {
  const regimeReel = estLocationsMeubleesRegimeReel();
  const categorieApplicable = estLocationsMeubleesCategorieLmnp() && !regimeReel;

  document.querySelectorAll('.sim-tuile-ouvert[data-tile="locationsMeubleesLogement"]').forEach(clone => {
    const valeurs = clone.dataset.formValues ? JSON.parse(clone.dataset.formValues) : {};
    let incomplet = false;

    if (regimeReel && !valeurs['lm-logement-charges']) incomplet = true;
    if (categorieApplicable) {
      const categorie = valeurs['lm-logement-lieu'] === 'france'
        ? valeurs['lm-logement-categorie-france']
        : valeurs['lm-logement-categorie-horsfrance'];
      if (!categorie) incomplet = true;
    }

    clone.classList.toggle('sim-tuile-ouvert--erreur', incomplet);
    const msgEl = clone.querySelector('[data-lm-logement-erreur]');
    if (msgEl) msgEl.hidden = !incomplet;
  });
}

// ── Validation du bouton Calculer ────────────────────────────────────────────

function validerSituationPersonnelle() {
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

function validerPersonnesACharge() {
  const parentSeulCoche = !!document.querySelector('input[name="dp-parent-seul"]:checked');
  if (!parentSeulCoche) return null;

  const hasAnyPac = document.querySelectorAll('.sim-tuile-ouvert[data-tile="personneACharge"]').length > 0;
  if (hasAnyPac) return null;

  const wrapper = document.querySelector('.sim-tuile-wrapper[data-tile="personneACharge"]');
  if (!wrapper) return null;

  wrapper.classList.add('sim-tuile-wrapper--erreur');
  let errEl = wrapper.querySelector('.sim-tuile__msg-erreur');
  if (!errEl) {
    errEl = document.createElement('div');
    errEl.className = 'fr-messages-group sim-tuile__msg-erreur';
    errEl.innerHTML = '<p class="fr-message fr-message--error">Veuillez ajouter au moins une personne à charge, car vous avez déclaré dans votre situation personnelle que vous vivez seul(e) avec vos enfants, ou avec des personnes invalides recueillies sous votre toit.</p>';
    wrapper.querySelector('.sim-tuile')?.after(errEl);
  }
  errEl.hidden = false;
  return wrapper;
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

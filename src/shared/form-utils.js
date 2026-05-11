let _instanceCounter = 0;

/**
 * Génère un suffixe unique pour différencier les IDs de plusieurs instances
 * d'une même tuile répétable dans le DOM.
 */
export function nextInstanceSuffix() {
  return ++_instanceCounter;
}

/**
 * Renomme tous les id/for/aria-*/name d'un conteneur avec un suffixe numérique.
 * Appelé APRÈS init() (les écouteurs sont attachés aux éléments, pas aux IDs)
 * et AVANT initBlurValidation() (qui génère des IDs d'erreur à partir de field.id).
 *
 * Les attributs name des radios/checkboxes sont aussi suffixés pour isoler les
 * groupes entre instances clonées (les navigateurs fusionnent les radios de même
 * name dans un même form, ce qui causerait des décoches mutuelles entre clones).
 * L'attribut data-original-name conserve la clé d'origine pour les messages d'erreur.
 */
export function suffixerIds(container, suffix) {
  container.querySelectorAll('[id]').forEach(el => {
    el.id = `${el.id}-${suffix}`;
  });
  container.querySelectorAll('[for]').forEach(el => {
    el.setAttribute('for', `${el.getAttribute('for')}-${suffix}`);
  });
  ['aria-labelledby', 'aria-describedby'].forEach(attr => {
    container.querySelectorAll(`[${attr}]`).forEach(el => {
      const ids = el.getAttribute(attr).split(/\s+/).filter(Boolean);
      el.setAttribute(attr, ids.map(id => `${id}-${suffix}`).join(' '));
    });
  });
  // Isoler les groupes radio/checkbox entre clones : chaque instance a ses propres names
  container.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
    if (!input.name) return;
    input.dataset.originalName = input.name;
    input.name = `${input.name}-${suffix}`;
  });
}

/**
 * Extrait les lignes de résumé d'un formulaire à partir des attributs data-resume-*.
 */
export function collecterResume(formPage) {
  const lignes = [];

  formPage.querySelectorAll('[data-resume-label]').forEach(el => {
    if (el.closest('[hidden]')) return;

    if (el.dataset.resumeType === 'repartition-pct') {
      const inputs = [...el.querySelectorAll('input[type="number"]')];
      const vals = inputs.map(i => i.value !== '' ? parseInt(i.value, 10) + ' %' : '—');
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

/**
 * Pré-remplit un formulaire avec des valeurs sauvegardées.
 * Déclenche les événements change pour activer les logiques conditionnelles
 * définies dans les fonctions init() de chaque formulaire.
 */
export function preremplirFormulaire(formPage, values) {
  const fieldsEl = formPage.querySelector('[data-fields]');
  if (!fieldsEl) return;

  // Selects en premier : leur changement peut déclencher la visibilité d'autres champs
  fieldsEl.querySelectorAll('select').forEach(field => {
    if (!(field.name in values)) return;
    field.value = values[field.name];
    field.dispatchEvent(new Event('change', { bubbles: true }));
  });

  fieldsEl.querySelectorAll('input, textarea').forEach(field => {
    if (!field.name || !(field.name in values)) return;
    if (field.type === 'radio' || field.type === 'checkbox') {
      field.checked = field.value === values[field.name];
      if (field.checked) {
        field.dispatchEvent(new Event('change', { bubbles: true }));
      }
    } else {
      field.value = values[field.name];
    }
  });
}

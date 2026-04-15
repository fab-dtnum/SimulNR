/**
 * Validation accessible des formulaires — RGAA / DSFR
 *
 * Exports publics :
 *   validateForm(container, messages) → boolean
 *   initBlurValidation(container, messages)
 *   setError(field, message)
 *   clearError(field)
 */

// ── Messages par défaut ──────────────────────────────────────────────────────

const defaultMessages = {
  valueMissing:      'Ce champ est obligatoire.',
  valueMissingRadio: 'Veuillez sélectionner une option.',
  typeMismatch:      'Format invalide.',
  rangeUnderflow:  field => `La valeur doit être supérieure ou égale à ${field.min}.`,
  rangeOverflow:   field => `La valeur doit être inférieure ou égale à ${field.max}.`,
  badInput:        'Le format saisi est invalide.',
  patternMismatch: 'Le format saisi est invalide.',
  tooShort:        field => `Minimum ${field.minLength} caractères requis.`,
  generic:         'Valeur invalide.',
};

// ── API publique ─────────────────────────────────────────────────────────────

/**
 * Valide tous les champs visibles du container à la soumission.
 * Efface les états précédents, applique erreurs DSFR + ARIA, focus premier invalide.
 *
 * @param {HTMLElement} container
 * @param {Object} messages - { [fieldName]: { valueMissing, rangeUnderflow, ... } }
 * @returns {boolean} true si tous les champs sont valides
 */
export function validateForm(container, messages = {}) {
  clearAllStates(container);

  let firstError = null;
  const checkedGroups = new Set();

  container.querySelectorAll('input, select, textarea').forEach(field => {
    if (field.disabled || field.closest('[hidden]')) return;

    if (field.type === 'radio') {
      if (checkedGroups.has(field.name)) return;
      checkedGroups.add(field.name);

      if (field.required) {
        const anyChecked = container.querySelector(`input[name="${field.name}"]:checked`);
        if (!anyChecked) {
          const fieldset = field.closest('fieldset');
          if (fieldset) {
            const msg = messages[field.name]?.valueMissing ?? defaultMessages.valueMissingRadio;
            setFieldsetError(fieldset, field.name, msg);
            if (!firstError) firstError = { el: fieldset, firstInput: field };
          }
        }
      }
      return;
    }

    if (!field.checkValidity()) {
      const fieldMsgs = messages[field.name] ?? messages[field.id] ?? {};
      setError(field, resolveMessage(field, fieldMsgs));
      if (!firstError) firstError = { el: field };
    }
  });

  if (firstError) {
    (firstError.firstInput ?? firstError.el).focus();
  }

  return firstError === null;
}


/**
 * Initialise la validation au blur : affiche l'erreur quand l'utilisateur quitte un champ invalide,
 * et l'efface dès qu'il le corrige. Aucun état de succès.
 *
 * @param {HTMLElement} container
 * @param {Object} messages
 */
export function initBlurValidation(container, messages = {}) {
  const touched = new Set();
  const touchedGroups = new Set();

  container.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), select, textarea').forEach(field => {
    field.addEventListener('focus', () => touched.add(field));

    field.addEventListener('blur', () => {
      if (!touched.has(field) || field.disabled || field.closest('[hidden]')) return;
      const fieldMsgs = messages[field.name] ?? messages[field.id] ?? {};
      if (!field.checkValidity()) {
        setError(field, resolveMessage(field, fieldMsgs));
      } else {
        clearError(field);
      }
    });

    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true' && field.checkValidity()) {
        clearError(field);
      }
    });
  });

  // Groupes radio : valider au changement de sélection
  const radioGroups = new Map();
  container.querySelectorAll('input[type="radio"]').forEach(radio => {
    if (!radioGroups.has(radio.name)) radioGroups.set(radio.name, []);
    radioGroups.get(radio.name).push(radio);
  });

  radioGroups.forEach((radios, name) => {
    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (touchedGroups.has(name)) return;
        touchedGroups.add(name);
        const fieldset = radio.closest('fieldset');
        if (fieldset) clearFieldsetError(fieldset, name);
        setTimeout(() => touchedGroups.delete(name), 0);
      });
    });
  });
}

/**
 * Marque un champ comme invalide (DSFR + ARIA).
 */
export function setError(field, message) {
  const group = field.closest('.fr-input-group');
  if (group) group.classList.add('fr-input-group--error');
  field.classList.add('fr-input--error');
  field.setAttribute('aria-invalid', 'true');

  const errorId = `${field.id || field.name}-error`;
  let errorEl = document.getElementById(errorId);
  if (!errorEl) {
    errorEl = document.createElement('p');
    errorEl.id = errorId;
    errorEl.className = 'fr-error-text';
    (group ?? field.parentElement).appendChild(errorEl);
  }
  errorEl.textContent = message;

  const described = (field.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean);
  if (!described.includes(errorId)) {
    field.setAttribute('aria-describedby', [...described, errorId].join(' '));
  }
}

/**
 * Efface l'état d'erreur d'un champ.
 */
export function clearError(field) {
  const group = field.closest('.fr-input-group');
  if (group) group.classList.remove('fr-input-group--error');
  field.classList.remove('fr-input--error');
  field.removeAttribute('aria-invalid');

  const errorId = `${field.id || field.name}-error`;
  removeElement(errorId);

  const described = (field.getAttribute('aria-describedby') ?? '').split(' ').filter(id => id !== errorId);
  if (described.length) {
    field.setAttribute('aria-describedby', described.join(' '));
  } else {
    field.removeAttribute('aria-describedby');
  }
}


// ── Gestion des fieldsets erreur ─────────────────────────────────────────────

function setFieldsetError(fieldset, groupName, message) {
  fieldset.classList.add('fr-fieldset--error');

  const errorId = `${groupName}-error`;
  let errorEl = document.getElementById(errorId);
  if (!errorEl) {
    errorEl = document.createElement('p');
    errorEl.id = errorId;
    errorEl.className = 'fr-error-text';
    fieldset.appendChild(errorEl);
  }
  errorEl.textContent = message;

  const labelled = (fieldset.getAttribute('aria-labelledby') ?? '').split(' ').filter(Boolean);
  if (!labelled.includes(errorId)) {
    fieldset.setAttribute('aria-labelledby', [...labelled, errorId].join(' '));
  }
}

function clearFieldsetError(fieldset, groupName) {
  fieldset.classList.remove('fr-fieldset--error');
  const errorId = `${groupName}-error`;
  removeElement(errorId);

  const labelled = (fieldset.getAttribute('aria-labelledby') ?? '').split(' ').filter(id => id !== errorId);
  if (labelled.length) fieldset.setAttribute('aria-labelledby', labelled.join(' '));
  else fieldset.removeAttribute('aria-labelledby');
}


// ── Nettoyage global ─────────────────────────────────────────────────────────

function clearAllStates(container) {
  container.querySelectorAll('.fr-input-group--error').forEach(g => g.classList.remove('fr-input-group--error'));
  container.querySelectorAll('.fr-fieldset--error').forEach(g => g.classList.remove('fr-fieldset--error'));
  container.querySelectorAll('[aria-invalid]').forEach(f => {
    f.removeAttribute('aria-invalid');
    f.classList.remove('fr-input--error');
  });
  container.querySelectorAll('.fr-error-text').forEach(el => el.remove());
}

function removeElement(id) {
  document.getElementById(id)?.remove();
}

// ── Résolution du message selon le type de violation HTML5 ───────────────────

function resolveMessage(field, messages) {
  const v = field.validity;
  const resolve = key => {
    const msg = messages[key] ?? defaultMessages[key];
    return typeof msg === 'function' ? msg(field) : msg;
  };
  if (v.valueMissing)    return resolve('valueMissing');
  if (v.typeMismatch)    return resolve('typeMismatch');
  if (v.badInput)        return resolve('badInput');
  if (v.rangeUnderflow)  return resolve('rangeUnderflow');
  if (v.rangeOverflow)   return resolve('rangeOverflow');
  if (v.patternMismatch) return resolve('patternMismatch');
  if (v.tooShort)        return resolve('tooShort');
  return resolve('generic');
}

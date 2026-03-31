/**
 * Charge les fragments HTML partagés entre les variantes.
 * Usage : <div data-fragment="../shared/revenus-tiles.html"></div>
 */
document.addEventListener('DOMContentLoaded', () => {
  const placeholders = Array.from(document.querySelectorAll('[data-fragment]'));

  Promise.all(
    placeholders.map(async (el) => {
      const path = el.dataset.fragment;
      try {
        const res = await fetch(path);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        el.innerHTML = await res.text();
      } catch (e) {
        console.error(`Erreur chargement fragment "${path}" :`, e);
        el.innerHTML = `<p class="fr-error-text">Erreur de chargement du fragment.</p>`;
      }
    })
  );
});

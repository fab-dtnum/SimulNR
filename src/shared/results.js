const fmt = n => n.toLocaleString('fr-FR') + ' €';

function ligne(label, valeur, bold = false) {
  return `<div class="sim-resultats__ligne${bold ? ' sim-resultats__ligne--bold' : ''}">
    <dt>${label}</dt><dd>${valeur}</dd>
  </div>`;
}

export function afficherResultats() {
  const section = document.getElementById('sim-resultats');
  if (!section) return;

  // Valeurs de démo (POC)
  const ir    = 2000;
  const ps    = 1720;
  const total = ir + ps;

  const elTotal = document.getElementById('sim-res-total');
  if (elTotal) elTotal.textContent = fmt(total);

  const detail = document.getElementById('sim-resultats-detail');
  if (detail) {
    detail.innerHTML = `
      <div class="sim-resultats__section">
        <p class="sim-resultats__section-titre">Situation et charges de famille</p>
        <dl class="sim-resultats__dl">
          ${ligne('Nombre de parts', '1,00', true)}
        </dl>
      </div>
      <div class="sim-resultats__sep"></div>
      <div class="sim-resultats__section">
        <p class="sim-resultats__section-titre">Impôts sur le revenu</p>
        <dl class="sim-resultats__bloc sim-resultats__dl">
          ${ligne('Revenus fonciers nets', fmt(10000))}
          ${ligne('Revenu brut global', fmt(10000))}
          ${ligne('Revenu imposable', fmt(10000))}
        </dl>
        <p class="sim-resultats__mention">Application du taux minimum</p>
        <dl class="sim-resultats__dl">
          ${ligne('Total de l\'impôt sur le revenu net', fmt(ir), true)}
        </dl>
      </div>
      <div class="sim-resultats__sep"></div>
      <div class="sim-resultats__section">
        <p class="sim-resultats__section-titre">Prélèvements sociaux</p>
        <dl class="sim-resultats__dl">
          ${ligne('Base imposable', fmt(10000))}
        </dl>
        <div class="sim-resultats__sous-bloc">
          <p class="sim-resultats__sous-bloc-titre">CSG-CRDS</p>
          <dl class="sim-resultats__dl">
            ${ligne('Taux d\'imposition', '9,70 %')}
            ${ligne('Montant d\'imposition', fmt(970))}
          </dl>
        </div>
        <div class="sim-resultats__sous-bloc">
          <p class="sim-resultats__sous-bloc-titre">Prélèvement solidarité</p>
          <dl class="sim-resultats__dl">
            ${ligne('Taux d\'imposition', '7,50 %')}
            ${ligne('Montant d\'imposition', fmt(750))}
          </dl>
        </div>
        <dl class="sim-resultats__dl">
          ${ligne('Total des prélèvements sociaux', fmt(ps), true)}
        </dl>
      </div>
      <div class="sim-resultats__sep"></div>`;
    detail.hidden = false;
  }

  section.hidden = false;
  // Déplacer le focus sur le titre des résultats pour annoncer leur apparition aux AT
  const titre = section.querySelector('h2');
  if (titre) { titre.tabIndex = -1; titre.focus(); }
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

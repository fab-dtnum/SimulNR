const fmt = n => n.toLocaleString('fr-FR') + ' €';

function ligne(label, valeur, bold = false) {
  return `<div class="sim-resultats__ligne${bold ? ' sim-resultats__ligne--bold' : ''}">
    <dt>${label}</dt><dd>${valeur}</dd>
  </div>`;
}

function section(titre, contenuHtml) {
  return `<div class="sim-resultats__section">
    <p class="sim-resultats__section-titre">${titre}</p>
    ${contenuHtml}
  </div>`;
}

function sousBloc(titre, base, montant) {
  return `<div class="sim-resultats__sous-bloc">
    <p class="sim-resultats__sous-bloc-titre">${titre}</p>
    <dl class="sim-resultats__dl">
      ${ligne('Base imposable', fmt(base))}
      ${ligne('Montant d\'imposition', fmt(montant))}
    </dl>
  </div>`;
}

function detailTuile({ nombreParts, revenuFoncier, revenuBrut, revenuImposable, mention, irNet, prelevements, psNet }) {
  return `
    ${section('Situation et charges de famille', `
      <dl class="sim-resultats__dl">${ligne('Nombre de parts', nombreParts, true)}</dl>
    `)}
    <div class="sim-resultats__sep"></div>
    ${section('Impôts sur le revenu', `
      <dl class="sim-resultats__bloc sim-resultats__dl">
        ${ligne('Revenus fonciers nets', fmt(revenuFoncier))}
        ${ligne('Revenu brut global', fmt(revenuBrut))}
        ${ligne('Revenu imposable', fmt(revenuImposable))}
        <p class="sim-resultats__mention">${mention}</p>
      </dl>
      <dl class="sim-resultats__dl">${ligne('Total de l\'impôt sur le revenu net', fmt(irNet), true)}</dl>
    `)}
    <div class="sim-resultats__sep"></div>
    ${section('Prélèvements sociaux', `
      ${prelevements.map(p => sousBloc(p.titre, p.base, p.montant)).join('')}
      <dl class="sim-resultats__dl">${ligne('Total des prélèvements sociaux', fmt(psNet), true)}</dl>
    `)}
  `;
}

function tuile({ classe, medaille, titre, ir, ps, detail, lien }) {
  const total = ir + ps;
  return `
    <div class="sim-resultats__tuile ${classe}">
      <p class="sim-resultats__tuile-titre">${medaille} ${titre}</p>

      <div class="sim-resultats__resume" data-sim-resume>
        <dl class="sim-resultats__dl">
          ${ligne('Impôt sur le revenu net', fmt(ir))}
          ${ligne('Prélèvements sociaux nets', fmt(ps))}
        </dl>
      </div>

      <div class="sim-resultats__detail" data-sim-detail hidden>
        ${detail}
      </div>

      <div class="sim-resultats__sep"></div>
      <div class="sim-resultats__total">
        <span>Total de l'imposition</span>
        <strong>${fmt(total)}</strong>
      </div>

      ${lien ? `
        <a class="fr-link fr-link--sm fr-link--icon-right fr-icon-external-link-line sim-resultats__lien" href="${lien}"
           target="_blank" rel="noopener noreferrer">Comment demander le taux moyen<span class="fr-sr-only"> (nouvelle fenêtre)</span></a>
      ` : ''}
    </div>
  `;
}

export function afficherResultats() {
  const section = document.getElementById('sim-resultats');
  if (!section) return;

  // Valeurs de démo (POC)
  const tuiles = document.getElementById('sim-resultats-tuiles');
  if (tuiles) {
    tuiles.innerHTML =
      tuile({
        classe: 'sim-resultats__tuile--moyen',
        medaille: '🥇',
        titre: 'Taux moyen',
        ir: 1000,
        ps: 720,
        lien: 'https://www.impots.gouv.fr/international-particulier/questions/quest-ce-que-le-taux-moyen-puis-je-en-beneficier',
        detail: detailTuile({
          nombreParts: '1,00',
          revenuFoncier: 10000,
          revenuBrut: 10000,
          revenuImposable: 10000,
          mention: 'Application du taux moyen',
          irNet: 1000,
          prelevements: [
            { titre: 'CSG-CRDS imposé à 7,20%', base: 10000, montant: 720 },
          ],
          psNet: 720,
        }),
      }) +
      tuile({
        classe: 'sim-resultats__tuile--minimum',
        medaille: '🥈',
        titre: 'Taux minimum',
        ir: 2000,
        ps: 1720,
        detail: detailTuile({
          nombreParts: '1,00',
          revenuFoncier: 10000,
          revenuBrut: 10000,
          revenuImposable: 10000,
          mention: 'Application du taux minimum',
          irNet: 2000,
          prelevements: [
            { titre: 'CSG-CRDS imposé à 9,70%', base: 10000, montant: 970 },
            { titre: 'Prélèvement solidarité 7,5%', base: 10000, montant: 750 },
          ],
          psNet: 1720,
        }),
      });
  }

  section.hidden = false;
  // Déplacer le focus sur le titre des résultats pour annoncer leur apparition aux AT
  const titre = section.querySelector('h2');
  if (titre) { titre.tabIndex = -1; titre.focus(); }
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('sim-resultats-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const affiche = toggle.getAttribute('aria-expanded') !== 'true';
    document.querySelectorAll('[data-sim-resume]').forEach(el => { el.hidden = affiche; });
    document.querySelectorAll('[data-sim-detail]').forEach(el => { el.hidden = !affiche; });
    toggle.setAttribute('aria-expanded', String(affiche));
    toggle.classList.toggle('fr-icon-arrow-down-s-line', !affiche);
    toggle.classList.toggle('fr-icon-arrow-up-s-line', affiche);
    toggle.textContent = affiche ? 'Masquer le détail' : 'Afficher le détail';
  });
});

const fmt = n => n.toLocaleString('fr-FR') + ' €';

export function afficherResultats() {
  const section = document.getElementById('sim-resultats');
  if (!section) return;

  // Valeurs de démo (POC)
  const ir    = 2000;
  const ps    = 1720;
  const total = ir + ps;

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
          <span>Total de l’impôt sur le revenu net</span><span>${fmt(ir)}</span>
        </div>
      </div>
      <div class="sim-resultats__sep"></div>
      <div class="sim-resultats__section">
        <p class="sim-resultats__section-titre">Prélèvements sociaux</p>
        <div class="sim-resultats__ligne"><span>Base imposable</span><span>${fmt(10000)}</span></div>
        <div class="sim-resultats__sous-bloc">
          <p class="sim-resultats__sous-bloc-titre">CSG-CRDS</p>
          <div class="sim-resultats__ligne"><span>Taux d’imposition</span><span>9,70 %</span></div>
          <div class="sim-resultats__ligne"><span>Montant d’imposition</span><span>${fmt(970)}</span></div>
        </div>
        <div class="sim-resultats__sous-bloc">
          <p class="sim-resultats__sous-bloc-titre">Prélèvement solidarité</p>
          <div class="sim-resultats__ligne"><span>Taux d’imposition</span><span>7,50 %</span></div>
          <div class="sim-resultats__ligne"><span>Montant d’imposition</span><span>${fmt(750)}</span></div>
        </div>
        <div class="sim-resultats__ligne sim-resultats__ligne--bold">
          <span>Total des prélèvements sociaux</span><span>${fmt(ps)}</span>
        </div>
      </div>
      <div class="sim-resultats__sep"></div>`;
  }

  const btnDetail = document.getElementById('sim-btn-detail');
  if (btnDetail) {
    const btnText = btnDetail.querySelector('span');
    btnDetail.classList.remove('fr-icon-arrow-up-s-line');
    btnDetail.classList.add('fr-icon-arrow-down-s-line');
    if (btnText) btnText.textContent = 'Afficher le détail';

    if (!btnDetail.dataset.wired) {
      btnDetail.dataset.wired = 'true';
      btnDetail.addEventListener('click', () => {
        const det = document.getElementById('sim-resultats-detail');
        const res = document.getElementById('sim-res-resume');
        const willExpand = det.hidden;
        det.hidden = !willExpand;
        if (res) res.hidden = willExpand;
        const text = btnDetail.querySelector('span');
        if (willExpand) {
          btnDetail.classList.remove('fr-icon-arrow-down-s-line');
          btnDetail.classList.add('fr-icon-arrow-up-s-line');
          if (text) text.textContent = 'Masquer le détail';
        } else {
          btnDetail.classList.remove('fr-icon-arrow-up-s-line');
          btnDetail.classList.add('fr-icon-arrow-down-s-line');
          if (text) text.textContent = 'Afficher le détail';
        }
      });
    }
  }

  section.hidden = false;
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

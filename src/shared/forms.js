/**
 * Agrégateur des définitions de champs par catégorie de revenus.
 * Chaque module exporte :
 *   - template() → chaîne HTML des champs
 *   - init(container) → logique conditionnelle propre à la rubrique (optionnel)
 */

import * as situationPersonnelle from './forms/situation-personnelle.js';
import * as personneACharge     from './forms/personne-a-charge.js';
import * as fonciersGeneral from './forms/fonciers-general.js';
import * as fonciersBien    from './forms/fonciers-bien.js';
import * as pensions  from './forms/pensions.js';
import * as salaires  from './forms/salaires.js';
import * as locationsMeubleesGeneral from './forms/locations-meublees-general.js';
import * as locationsMeubleesLogement from './forms/locations-meublees-logement.js';
import * as bnc       from './forms/bnc.js';
import * as bic       from './forms/bic.js';
import * as agricoles       from './forms/agricoles.js';
import * as deficitsGlobaux from './forms/deficits-globaux.js';
import * as pensionsAlimentaires from './forms/pensions-alimentaires.js';
import * as exonerationCsg  from './forms/exoneration-csg.js';

export {
  situationPersonnelle, personneACharge, pensions, salaires,
  fonciersGeneral as fonciers, fonciersBien,
  locationsMeubleesGeneral as locationsMeublees, locationsMeubleesLogement,
  bnc, bic, agricoles, deficitsGlobaux, pensionsAlimentaires, exonerationCsg,
};

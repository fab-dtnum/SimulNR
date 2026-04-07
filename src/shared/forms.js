/**
 * Agrégateur des définitions de champs par catégorie de revenus.
 * Chaque module exporte :
 *   - template() → chaîne HTML des champs
 *   - init(container) → logique conditionnelle propre à la rubrique (optionnel)
 */

import * as situationPersonnelle from './forms/situation-personnelle.js';
import * as fonciers  from './forms/fonciers.js';
import * as pensions  from './forms/pensions.js';
import * as salaires  from './forms/salaires.js';
import * as lmnp      from './forms/lmnp.js';
import * as bnc       from './forms/bnc.js';
import * as bic       from './forms/bic.js';
import * as agricoles from './forms/agricoles.js';

export { situationPersonnelle, fonciers, pensions, salaires, lmnp, bnc, bic, agricoles };

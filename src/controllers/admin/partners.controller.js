import { Partner } from '../../models/Partner.model.js';
import { createCrudController } from './crudFactory.js';

export const {
  list: listPartners,
  getById: getPartnerById,
  create: createPartner,
  update: updatePartner,
  remove: removePartner,
} = createCrudController(Partner, { notFoundMessage: 'Partenaire introuvable' });

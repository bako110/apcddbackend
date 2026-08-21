import { News } from '../../models/News.model.js';
import { createCrudController } from './crudFactory.js';

export const { list: listNews, getById: getNewsById, create: createNews, update: updateNews, remove: removeNews } =
  createCrudController(News, { notFoundMessage: 'Actualité introuvable' });

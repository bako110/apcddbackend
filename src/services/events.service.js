import { EVENT_STATUS_PRIORITY } from '../shared/constants.js';

/**
 * Trie les événements par priorité de statut (upcoming > ongoing > completed > cancelled),
 * puis par date croissante à l'intérieur d'un même statut.
 * Reproduit la logique de tri utilisée par le frontend existant.
 */
export function sortEventsByPriorityThenDate(events) {
  return [...events].sort((a, b) => {
    const priorityA = EVENT_STATUS_PRIORITY[a.status] ?? Number.MAX_SAFE_INTEGER;
    const priorityB = EVENT_STATUS_PRIORITY[b.status] ?? Number.MAX_SAFE_INTEGER;

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
}

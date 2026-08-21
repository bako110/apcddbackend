// Constantes autonomes du backend (indépendant des autres apps du monorepo,
// chaque app est déployable seule sans dépendance croisée).

export const MEMBERSHIP_PLANS = {
  SYMPATHISANT: 'sympathisant',
  ACTIF: 'actif',
  BIENFAITEUR: 'bienfaiteur',
};
export const MEMBERSHIP_PLAN_VALUES = Object.values(MEMBERSHIP_PLANS);
export const MEMBERSHIP_PLAN_PRICING = {
  [MEMBERSHIP_PLANS.SYMPATHISANT]: 0,
  [MEMBERSHIP_PLANS.ACTIF]: 15000,
  [MEMBERSHIP_PLANS.BIENFAITEUR]: 50000,
};

export const EVENT_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};
export const EVENT_STATUS_VALUES = Object.values(EVENT_STATUS);
export const EVENT_STATUS_PRIORITY = {
  [EVENT_STATUS.UPCOMING]: 1,
  [EVENT_STATUS.ONGOING]: 2,
  [EVENT_STATUS.COMPLETED]: 3,
  [EVENT_STATUS.CANCELLED]: 4,
};

export const GALLERY_CATEGORIES = {
  FESTIVALS: 'festivals',
  ENVIRONMENT: 'environment',
  COMMUNITY: 'community',
};
export const GALLERY_CATEGORY_VALUES = Object.values(GALLERY_CATEGORIES);

export const NEWS_CATEGORIES = {
  CULTURE: 'culture',
  ENVIRONMENT: 'environment',
  EDUCATION: 'education',
  AWARD: 'award',
  COMMUNITY: 'community',
};
export const NEWS_CATEGORY_VALUES = Object.values(NEWS_CATEGORIES);

export const PAYMENT_METHODS = {
  MOBILE_MONEY: 'mobile',
  BANK_TRANSFER: 'bank',
  CASH: 'cash',
  WESTERN_UNION: 'western',
};
export const PAYMENT_METHOD_VALUES = Object.values(PAYMENT_METHODS);

export const DONATION_PURPOSES = {
  GENERAL: 'general',
  ENVIRONMENT: 'environment',
  CULTURE: 'culture',
  EDUCATION: 'education',
  RURAL: 'rural',
};
export const DONATION_PURPOSE_VALUES = Object.values(DONATION_PURPOSES);
export const SUGGESTED_DONATION_AMOUNTS = [5000, 10000, 25000, 50000];

export const MEMBER_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};
export const MEMBER_STATUS_VALUES = Object.values(MEMBER_STATUS);

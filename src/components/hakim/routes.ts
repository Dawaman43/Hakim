export type ViewType =
  | 'landing'
  | 'hospitals'
  | 'departments'
  | 'booking'
  | 'token'
  | 'emergency'
  | 'features'
  | 'about'
  | 'contact'
  | 'auth'
  | 'map'
  | 'nearest-hospitals'
  | 'admin-login'
  | 'admin-dashboard'
  | 'admin-queue'
  | 'admin-analytics'
  | 'profile'
  | 'faq'
  | 'privacy'
  | 'terms'
  | 'hospital-register'
  | 'hospital-dashboard';

export const viewRoutes: Record<ViewType, string> = {
  landing: '/',
  features: '/features',
  about: '/about',
  contact: '/contact',
  faq: '/faq',
  privacy: '/privacy',
  terms: '/terms',
  auth: '/auth',
  hospitals: '/hospitals',
  map: '/map',
  'nearest-hospitals': '/nearest-hospitals',
  departments: '/departments',
  booking: '/booking',
  token: '/token',
  emergency: '/emergency',
  'admin-login': '/admin/login',
  'admin-dashboard': '/admin',
  'admin-queue': '/admin/queue',
  'admin-analytics': '/admin/analytics',
  profile: '/profile',
  'hospital-register': '/hospital/register',
  'hospital-dashboard': '/hospital/dashboard',
};

const routeToView = Object.fromEntries(
  Object.entries(viewRoutes).map(([view, route]) => [route, view as ViewType])
) as Record<string, ViewType>;

export function getViewFromPath(pathname: string, fallback: ViewType): ViewType {
  if (!pathname) return fallback;
  const normalized =
    pathname.length > 1 && pathname.endsWith('/')
      ? pathname.slice(0, -1)
      : pathname;
  return routeToView[normalized] ?? fallback;
}

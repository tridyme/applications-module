/**
 * Détecte si l'application est accédée via la plateforme Tridyme
 * La plateforme injecte window.HOST_BACKEND_URL et l'utilisateur est connecté
 */
export const isPlatformContext = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  // Vérifier si window.HOST_BACKEND_URL existe (injecté par la plateforme)
  const hasBackendUrl = !!(window as any).HOST_BACKEND_URL;

  // Vérifier si un utilisateur est connecté
  const userStr = localStorage.getItem('tridyme_user');
  const hasUser = !!userStr && userStr !== 'null';

  return hasBackendUrl && hasUser;
};

/**
 * Détecte si l'application est en mode standalone (accès direct)
 */
export const isStandaloneContext = (): boolean => {
  return !isPlatformContext();
};

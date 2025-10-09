/**
 * Détecte l'URL backend de l'application depuis window.HOST_BACKEND_URL
 * Cette variable est injectée par la plateforme Tridyme
 */
export const detectBackendUrl = (): string | undefined => {
  if (typeof window !== 'undefined' && (window as any).HOST_BACKEND_URL) {
    console.log('window.HOST_BACKEND_URL', (window as any).HOST_BACKEND_URL);
    return (window as any).HOST_BACKEND_URL;
  }
  return undefined;
};

/**
 * Détermine l'URL de l'API en fonction de l'environnement
 * @param fullDomain - Le domaine complet pour la production
 * @param endpoint - L'endpoint de l'API (ex: '/api/analysis')
 */
export const getApiUrl = (fullDomain: string, endpoint: string): string => {
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:8000${endpoint}`;
  }
  return `https://${fullDomain}${endpoint}`;
};

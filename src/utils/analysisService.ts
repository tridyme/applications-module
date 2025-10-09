import { TridymeApplicationState } from '../types';

/**
 * Envoie l'état de l'application au backend pour analyse/calcul
 * @param state - L'état actuel de l'application
 * @param fullDomain - Le domaine complet pour la production
 */
export const runAnalysis = async (
  state: TridymeApplicationState,
  fullDomain: string
): Promise<Record<string, any> | null> => {
  try {
    const apiUrl =
      process.env.NODE_ENV === 'development'
        ? `http://localhost:8000/api/analysis`
        : `https://${fullDomain}/api/analysis`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(state),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (err) {
    console.error("Erreur lors de l'envoi de l'état:", err);
    throw err;
  }
};

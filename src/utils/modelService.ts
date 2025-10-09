import axios from 'axios';
import { TridymeModel, TridymeApplicationState } from '../types';

/**
 * Récupère un modèle depuis l'API Tridyme
 * @param modelId - L'ID du modèle à récupérer
 * @param backendUrl - L'URL du backend
 */
export const getModel = async (
  modelId: string,
  backendUrl: string
): Promise<TridymeModel | null> => {
  try {
    const response = await axios.post(`${backendUrl}/models/batchGet`, [modelId]);
    if (response?.data?.length > 0) {
      return response.data[0];
    }
    return null;
  } catch (err) {
    console.error('Error when getting model:', err);
    return null;
  }
};

/**
 * Sauvegarde ou met à jour un modèle dans l'API Tridyme
 * @param model - Le modèle à sauvegarder
 * @param backendUrl - L'URL du backend
 */
export const saveModel = async (
  model: TridymeModel,
  backendUrl: string
): Promise<TridymeModel | null> => {
  try {
    const { data } = await axios.post(
      `${backendUrl}/models/batchAddOrUpdate`,
      [model]
    );
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (err) {
    console.error('Error when saving model:', err);
    throw err;
  }
};

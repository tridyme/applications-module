import { useState, useEffect } from 'react';
import {
  TridymeApplicationState,
  UseApplicationOptions,
  UseApplicationReturn,
  TridymeModel,
} from '../types';
import { detectBackendUrl, getModel, saveModel, runAnalysis } from '../utils';

/**
 * Hook principal pour gérer une application Tridyme
 * Gère l'initialisation, le chargement, la sauvegarde et l'analyse
 */
export const useApplication = (
  options: UseApplicationOptions
): UseApplicationReturn => {
  const { initialState, match, config = {}, navigate } = options;

  useEffect(() => {
    if (!match || !initialState) {
      console.error('[useApplication] options "match" et "initialState" sont obligatoires.');
      setSnackbar({
        open: true,
        message: 'Paramètres obligatoires manquants : match ou initialState',
        severity: 'error',
      });
    }
    
    if (!navigate) {
      console.warn('[useApplication] option "navigate" non fournie, navigation désactivée.');
      setSnackbar({
        open: true,
        message: 'Option navigate non fournie, navigation désactivée',
        severity: 'warning',
      });
    }
  }, []);

  const { params } = match;
  const { applicationId, modelId: routeModelId, projectId } = params;

  // Récupérer l'utilisateur depuis localStorage
  const user = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('tridyme_user') || 'null')
    : null;
  const userId = user?._id;

  // État de l'application
  const [state, setState] = useState<TridymeApplicationState>(initialState);
  const [loading, setLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [modelId, setModelId] = useState<string | undefined>(routeModelId);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });
  
  // Initialisation au montage du composant
  useEffect(() => {
    const init = async () => {
      // Détecter l'URL du backend
      const detectedUrl = detectBackendUrl();
      setCurrentUrl(detectedUrl || null);

      let actualState: TridymeApplicationState = initialState;

      // Charger le modèle si un ID est fourni
      if (modelId && modelId !== 'new' && detectedUrl) {
        const model = await getModel(modelId, detectedUrl);
        if (model?.data) {
          actualState = model.data;
        }
      }

      setState(actualState);
      setLoading(false);
    };

    init();
  }, []);

  // Fonction pour exécuter l'analyse
  const handleAnalysis = async () => {
    try {
      const fullDomain = config.fullDomain || process.env.REACT_APP_FULL_DOMAIN || '';
      const newState = await runAnalysis(state, fullDomain);

      if (newState) {
        const updatedState: TridymeApplicationState = {
          ...state,
          data: {
            ...state.data,
            ...newState,
          },
        };
        setState(updatedState);
      }
    } catch (err) {
      console.error("Erreur lors de l'analyse:", err);
      setSnackbar({
        open: true,
        message: "Erreur lors de l'analyse",
        severity: 'error',
      });
    }
  };

  // Fonction pour sauvegarder le modèle
  const handleSave = async () => {
    if (!currentUrl || !userId) {
      setSnackbar({
        open: true,
        message: 'Impossible de sauvegarder : URL ou utilisateur manquant',
        severity: 'error',
      });
      return;
    }

    try {
      const model: TridymeModel = {
        projectId,
        name: state.data.projet?.value || 'Sans nom',
        application: applicationId,
        data: state,
        user: String(userId),
      };

      if (modelId && modelId !== 'new') {
        // Mise à jour d'un modèle existant
        const updatedModel = { id: modelId, ...model };
        await saveModel(updatedModel, currentUrl);
        setSnackbar({
          open: true,
          message: 'Calcul enregistré',
          severity: 'success',
        });
      } else {
        // Création d'un nouveau modèle
        const savedModel = await saveModel(model, currentUrl);
        if (savedModel?.id) {
          setModelId(savedModel.id);

          // Mettre à jour l'URL si history est disponible
          if (typeof window !== 'undefined' && (window as any).history) {
            const newPath = projectId
              ? `/projects/${projectId}/applications/${applicationId}/models/${savedModel.id}`
              : `/applications/${applicationId}/models/${savedModel.id}`;
            if (navigate) {
              navigate(newPath);
            } else {
              window.history.pushState(null, '', newPath);
            }
          }

          setSnackbar({
            open: true,
            message: 'Calcul enregistré',
            severity: 'success',
          });
        }
      }
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setSnackbar({
        open: true,
        message: 'Erreur : Calcul non enregistré',
        severity: 'error',
      });
    }
  };

  // Fonction pour fermer le snackbar
  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return {
    state,
    setState,
    loading,
    currentUrl,
    handleAnalysis,
    handleSave,
    snackbar,
    closeSnackbar,
  };
};

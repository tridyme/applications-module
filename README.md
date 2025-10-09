# @tridyme/applications

SDK React pour créer des applications de calcul Tridyme avec hooks, utilitaires et composants UI.

[![npm version](https://badge.fury.io/js/%40tridyme%2Fapplications.svg)](https://www.npmjs.com/package/@tridyme/applications)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- ✅ **Hook principal `useApplication`** - Gestion complète de l'état et des actions
- ✅ **Hook `useUser`** - Gestion de l'utilisateur connecté
- ✅ **Détection automatique** - Backend URL et contexte plateforme
- ✅ **Services API** - Fonctions pour modèles et analyses
- ✅ **Composants UI** - Ré-export de `@tridyme/react-components`
- ✅ **TypeScript** - Types inclus pour une meilleure DX

## Installation

```bash
npm install @tridyme/applications @tridyme/react-components react react-dom axios
```

**Peer dependencies:**
- React 16.8+
- axios 1.0+
- @tridyme/react-components

## Utilisation

### Hook principal `useApplication`

Le hook `useApplication` encapsule toute la logique nécessaire pour gérer une application Tridyme :

```javascript
import React from 'react';
import { useApplication } from '@tridyme/applications';
import initialState from './initialState';

function Application({ match }) {
  const {
    state,
    setState,
    loading,
    currentUrl,
    handleAnalysis,
    handleSave,
    snackbar,
    closeSnackbar,
  } = useApplication({
    initialState,
    match,
    config: {
      fullDomain: process.env.REACT_APP_FULL_DOMAIN,
    },
  });

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1>{state.data.projet?.value || 'Nouveau projet'}</h1>

      <button onClick={handleAnalysis}>Lancer le calcul</button>
      <button onClick={handleSave}>Sauvegarder</button>

      {/* Votre interface utilisateur */}

      {/* Snackbar pour les notifications */}
      {snackbar.open && (
        <div className={`snackbar ${snackbar.severity}`}>
          {snackbar.message}
          <button onClick={closeSnackbar}>×</button>
        </div>
      )}
    </div>
  );
}

export default Application;
```

### Hook `useUser`

Gestion de l'utilisateur connecté :

```javascript
import { useUser } from '@tridyme/applications';

function MyComponent() {
  const { user, userId, setUser } = useUser();

  if (!user) {
    return <div>Non connecté</div>;
  }

  return <div>Bienvenue {user.name} (ID: {userId})</div>;
}
```

### Détection du contexte plateforme

```javascript
import { isPlatformContext } from '@tridyme/applications';

function MyApp() {
  const isOnPlatform = isPlatformContext();

  return (
    <div>
      {isOnPlatform ? (
        <div>Application intégrée à la plateforme</div>
      ) : (
        <div>Application standalone</div>
      )}
    </div>
  );
}
```

### Composants réutilisables

Le module réexporte tous les composants de `@tridyme/react-components` :

```javascript
import {
  ButtonElem,
  InputElem,
  CardElem,
  InputTableElem
} from '@tridyme/applications';
```

### Services utilitaires

Vous pouvez également utiliser les services individuellement :

```javascript
import {
  detectBackendUrl,
  getModel,
  saveModel,
  runAnalysis,
} from '@tridyme/applications';

// Détecter l'URL du backend
const backendUrl = detectBackendUrl();

// Récupérer un modèle
const model = await getModel('model-id', backendUrl);

// Sauvegarder un modèle
const savedModel = await saveModel(modelData, backendUrl);

// Lancer une analyse
const result = await runAnalysis(state, 'your-domain.com');
```

## Structure de l'état

L'état de votre application doit suivre la structure `TridymeApplicationState` :

```typescript
interface TridymeApplicationState {
  data: Record<string, any>;
}
```

Exemple d'initialState :

```javascript
const initialState = {
  data: {
    projet: {
      value: 'Mon projet',
      unit: '',
    },
    parametre1: {
      value: 0,
      unit: 'm',
    },
    // ... autres paramètres
  },
};
```

## Configuration

Le hook accepte une configuration optionnelle :

```typescript
interface TridymeApplicationConfig {
  apiUrl?: string;           // URL de l'API (optionnel)
  applicationName?: string;  // Nom de l'application
  applicationId?: string;    // ID de l'application
  fullDomain?: string;       // Domaine complet pour la production
}
```

## Fonctionnalités incluses

- ✅ Détection automatique de l'URL backend depuis `window.HOST_BACKEND_URL`
- ✅ Chargement automatique des modèles existants
- ✅ Sauvegarde et mise à jour des modèles
- ✅ Exécution des analyses/calculs
- ✅ Gestion des notifications (snackbar)
- ✅ Support du mode développement et production
- ✅ Gestion automatique de l'authentification utilisateur
- ✅ Navigation automatique après création de modèle

## Backend attendu

Le backend doit exposer les endpoints suivants :

- `POST /models/batchGet` - Récupérer des modèles par ID
- `POST /models/batchAddOrUpdate` - Créer ou mettre à jour des modèles
- `POST /api/analysis` - Exécuter une analyse

## Développement

```bash
# Installer les dépendances
npm install

# Build en mode développement avec watch
npm run dev

# Build de production
npm run build
```

## License

MIT

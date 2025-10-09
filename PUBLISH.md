# Guide de publication @tridyme/applications

## Prérequis

1. **Compte npm**: Avoir un compte sur [npmjs.com](https://npmjs.com)
2. **Authentification**: Être connecté via `npm login`
3. **Permissions**: Avoir les droits de publication sur le scope `@tridyme`

## Vérifications avant publication

### 1. Vérifier le build

```bash
npm run build
```

Le build doit générer:
- `dist/index.js` (CommonJS)
- `dist/index.esm.js` (ES Modules)
- `dist/index.d.ts` (TypeScript types)
- Tous les fichiers de types `.d.ts`

### 2. Tester le package localement

```bash
# Dans applications-sdk
npm link

# Dans un projet test
cd /path/to/test-project
npm link @tridyme/applications

# Utiliser dans votre code
import { useApplication } from '@tridyme/applications';
```

### 3. Tester la publication en dry-run

```bash
npm publish --dry-run --access public
```

Vérifiez que tous les fichiers nécessaires sont inclus:
- ✅ dist/ (tous les fichiers compilés)
- ✅ README.md
- ✅ LICENSE
- ✅ package.json

### 4. Vérifier la version

Le package est actuellement en version `0.0.1`. Pour changer la version:

```bash
# Version patch (0.0.1 -> 0.0.2)
npm version patch

# Version minor (0.0.1 -> 0.1.0)
npm version minor

# Version major (0.0.1 -> 1.0.0)
npm version major
```

## Publication

### Première publication

```bash
npm publish --access public
```

L'option `--access public` est **obligatoire** pour les packages scoped (`@tridyme/applications`).

### Publications suivantes

```bash
# Incrémenter la version
npm version patch

# Publier
npm publish
```

## Après publication

### 1. Vérifier sur npm

Visitez: https://www.npmjs.com/package/@tridyme/applications

### 2. Tester l'installation

```bash
# Dans un nouveau projet
npm install @tridyme/applications

# Vérifier que ça fonctionne
import { useApplication } from '@tridyme/applications';
```

### 3. Créer un tag Git

```bash
git tag v0.0.1
git push origin v0.0.1
```

### 4. Créer une release GitHub

1. Aller sur https://github.com/tridyme/applications-sdk/releases
2. Cliquer sur "Create a new release"
3. Sélectionner le tag `v0.0.1`
4. Titre: `v0.0.1 - Première version`
5. Description des changements

## Structure du package publié

```
@tridyme/applications@0.0.1
├── dist/
│   ├── index.js              # CommonJS bundle
│   ├── index.esm.js          # ES Modules bundle
│   ├── index.d.ts            # Types racine
│   ├── hooks/
│   │   ├── useApplication.d.ts
│   │   └── useUser.d.ts
│   ├── utils/
│   │   ├── urlDetection.d.ts
│   │   ├── modelService.d.ts
│   │   ├── analysisService.d.ts
│   │   └── platformDetection.d.ts
│   ├── components/
│   │   └── index.d.ts
│   └── types/
│       └── index.d.ts
├── README.md
├── LICENSE
└── package.json
```

## Exports disponibles

### Hooks
```typescript
import {
  useApplication,
  useUser
} from '@tridyme/applications';
```

### Utils
```typescript
import {
  detectBackendUrl,
  isPlatformContext,
  getModel,
  saveModel,
  runAnalysis
} from '@tridyme/applications';
```

### Composants (ré-exportés)
```typescript
import {
  ButtonElem,
  CardElem,
  InputElem,
  InputTableElem
} from '@tridyme/applications';
```

### Types
```typescript
import type {
  TridymeApplicationState,
  TridymeApplicationConfig,
  User,
  UseUserReturn
} from '@tridyme/applications';
```

## Dépendances

### Peer Dependencies (requises)
- `react` ^16.8.0 || ^17.0.0 || ^18.0.0
- `react-dom` ^16.8.0 || ^17.0.0 || ^18.0.0
- `axios` ^1.0.0
- `@tridyme/react-components` *

Les utilisateurs doivent installer ces dépendances:
```bash
npm install @tridyme/applications @tridyme/react-components react react-dom axios
```

## Dépublication (en cas d'erreur)

⚠️ **Attention**: La dépublication est permanente dans les 72h.

```bash
# Dépublier une version spécifique
npm unpublish @tridyme/applications@0.0.1

# Dépublier tout le package (dans les 72h)
npm unpublish @tridyme/applications --force
```

## Workflow de publication recommandé

1. **Développement**
   ```bash
   # Faire les modifications
   git add .
   git commit -m "feat: nouvelle fonctionnalité"
   ```

2. **Build**
   ```bash
   npm run build
   ```

3. **Tests**
   ```bash
   npm test
   npm publish --dry-run --access public
   ```

4. **Version**
   ```bash
   npm version patch  # ou minor/major
   ```

5. **Publication**
   ```bash
   npm publish --access public
   ```

6. **Git**
   ```bash
   git push
   git push --tags
   ```

7. **GitHub Release**
   - Créer une release sur GitHub avec le tag

## Maintenance

### Mettre à jour les dépendances

```bash
npm outdated
npm update
```

### Vérifier les vulnérabilités

```bash
npm audit
npm audit fix
```

## Support

Pour toute question sur la publication, contactez l'équipe Tridyme.

## Notes importantes

⚠️ Le warning TypeScript concernant `@tridyme/react-components` est normal car ce package n'a pas de fichiers de types. Cela n'empêche pas la publication.

💡 Le package utilise Rollup pour créer deux bundles:
- CommonJS (`dist/index.js`) pour Node.js
- ES Modules (`dist/index.esm.js`) pour bundlers modernes

🔒 Toujours tester localement avec `npm link` avant de publier.

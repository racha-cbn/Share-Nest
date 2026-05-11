# Share-Nest

Plateforme de solidarité entre voisins en Algérie pour partager des biens et des services.

## 🏗️ Architecture du Projet

Ce projet utilise une architecture monorepo avec pnpm workspace :

- **Frontend** : React + Vite + TypeScript (port 5173)
- **Backend API** : Express + TypeScript (port 3000)  
- **Base de données** : PostgreSQL + Drizzle ORM
- **Librairies partagées** : Schémas de données et types

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+
- pnpm

### Installation

```bash
# Cloner le projet
git clone <repository-url>
cd Share-Nest

# Installer les dépendances
pnpm install
```

### Démarrage

```bash
# Démarrer l'API backend
pnpm run dev
# (dans artifacts/api-server)

# Démarrer le frontend
pnpm run dev  
# (dans artifacts/sharenest)
```

L'API sera accessible sur http://localhost:3000  
Le frontend sera accessible sur http://localhost:5173

## 📁 Structure du Projet

```
Share-Nest/
├── artifacts/                 # Applications
│   ├── api-server/          # Backend Express
│   ├── sharenest/           # Frontend React
│   └── mockup-sandbox/      # Sandbox de design
├── lib/                     # Librairies partagées
│   ├── db/                 # Schéma de base de données
│   ├── api-client-react/    # Client API React
│   └── api-zod/            # Schémas Zod
├── attached_assets/          # Assets statiques
└── scripts/                # Scripts de build
```

## 🔧 Configuration

### Variables d'Environnement

Pour le développement local, les variables suivantes sont configurées automatiquement :

**Frontend (sharenest)** :
- `PORT=5173` (par défaut)
- `BASE_PATH=/` (par défaut)

**Backend (api-server)** :
- `PORT=3000` (par défaut)
- `DATABASE_URL` (optionnel pour développement - utilise des données mockées)

### Base de Données

Pour le développement, le projet utilise des données mockées. Pour la production :

1. Configurer `DATABASE_URL` avec votre chaîne de connexion PostgreSQL
2. Exécuter `pnpm run push` dans `lib/db` pour créer les tables

## 🛠️ Développement

### API Endpoints

#### Posts
- `GET /api/posts` - Lister tous les posts
- `GET /api/posts/:id` - Obtenir un post spécifique
- `POST /api/posts` - Créer un nouveau post
- `PUT /api/posts/:id` - Mettre à jour un post
- `DELETE /api/posts/:id` - Supprimer un post

#### Health Check
- `GET /api/healthz` - Vérifier l'état de l'API

### Frontend Components

Le frontend utilise les technologies suivantes :
- **Routing** : Wouter
- **UI Components** : shadcn/ui + Radix UI
- **Styling** : Tailwind CSS (désactivé temporairement)
- **State Management** : React Query
- **Animations** : Framer Motion

## 🏗️ Build

```bash
# Build toutes les applications
pnpm run build

# Build une application spécifique
pnpm run build  # (dans le dossier de l'application)
```

## 🧪 Tests

```bash
# Vérifier les types TypeScript
pnpm run typecheck

# Lancer les tests (quand implémentés)
pnpm test
```

## 🐛 Problèmes Connus et Solutions

### 1. Dépendances natives manquantes
**Problème** : Erreurs `MODULE_NOT_FOUND` pour Rollup/LightningCSS  
**Solution** : Ajout de `@rollup/rollup-darwin-arm64` et suppression des plugins problématiques

### 2. Variables d'environnement requises  
**Problème** : Le frontend exige `PORT` et `BASE_PATH`  
**Solution** : Valeurs par défaut configurées dans `vite.config.ts`

### 3. Connexion base de données
**Problème** : `DATABASE_URL` requis mais non configuré  
**Solution** : Données mockées pour le développement

## 📝 Notes de Développement

### Modifications Effectuées

1. **Correction des dépendances natives** : Résolu les problèmes de build sur macOS ARM
2. **Configuration environnement** : Ajout de valeurs par défaut robustes
3. **API fonctionnelle** : Création des endpoints CRUD pour les posts
4. **Intégration frontend-backend** : Client API et connexion des composants
5. **Types unifiés** : Utilisation des types API dans les composants frontend
6. **Données de développement** : Mock data pour développement sans base de données

### Architecture Améliorée

- **Séparation des responsabilités** : Frontend, backend, et librairies séparées
- **Type safety** : TypeScript et Zod pour la validation
- **Développement rapide** : Mock data pour itérer rapidement
- **Scalabilité** : Structure modulaire prête pour la production

## 🚀 Prochaines Étapes

1. **Réactiver TailwindCSS** : Configuration alternative pour éviter les dépendances natives
2. **Base de données réelle** : Configuration PostgreSQL pour la production  
3. **Authentification** : Système de login/inscription
4. **Upload d'images** : Support pour les photos des posts
5. **Notifications** : Système d'alertes pour les nouveaux posts
6. **Tests** : Tests unitaires et d'intégration
7. **Déploiement** : Configuration pour la production

## 📄 Licence

MIT

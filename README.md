# JobTracker 💼

Un outil professionnel et moderne de suivi des candidatures d'emploi.

Ce projet utilise une architecture robuste combinant un backend **Java Spring Boot 3** connecté à une base distante **Neon PostgreSQL**, et un frontend **Angular Standalone** moderne propulsé par les **Angular Signals**.

---

## 🚀 Architecture Globale

Le projet est divisé en deux modules autonomes et isolés :

```
JobTracker/
├── backend/            # Application Spring Boot 3.x (API REST)
├── front-jobtracker/   # Application Angular Standalone (Interface Utilisateur)
├── project-scope.md    # Périmètre fonctionnel et technique détaillé
└── README.md           # Ce guide d'accueil
```

---

## 🛠️ Stack Technique

### Backend
* **Langage** : Java 17
* **Framework** : Spring Boot 3.x
* **Accès Données** : Spring Data JPA, PostgreSQL Driver
* **Migration de Données** : Flyway Migration
* **Validation** : Spring Validation (DTOs)
* **Build tool** : Maven

### Frontend
* **Framework** : Angular 18+ (Composants 100% Standalone)
* **Réactivité** : Angular Signals (`signal`, `computed`, `effect`)
* **Asynchronisme** : RxJS & interopérabilité avec Signals (`toSignal`, `toObservable`)
* **Formulaires** : Reactive Forms avec validations avancées
* **Style** : Vanilla CSS moderne, flexible et responsive

---

## 🧪 Pratiques d'Ingénierie Logicielle

Pour garantir un niveau de qualité professionnel, ce projet applique rigoureusement :
1. **Test-Driven Development (TDD)** : Écriture des tests unitaires et d'intégration avant le code de production.
2. **Conventional Commits** : Messages de commit standardisés pour une lisibilité maximale de l'historique Git.
3. **Isolation des Tests** : Utilisation intensive de mocks (Mockito côté Java, TestBed avec espions côté Angular).

---

## 📖 Démarrage Rapide

### Prérequis
* Java 17+ installé
* Node.js (version LTS) installé
* Maven 3.x installé

### Lancement du Backend
```bash
cd backend
# Sous Windows
.\mvnw spring-boot:run

# Sous Linux/macOS
./mvnw spring-boot:run
```

### Lancement du Frontend
```bash
cd front-jobtracker
npm install
npm run start
```

> [!TIP]
> **Proxy API Dynamique** : Le frontend utilise un proxy dynamique (`proxy.conf.js`). Par défaut, il redirige les requêtes de `/api/*` vers `http://localhost:8080`.
> Si votre backend s'exécute sur un autre port ou un autre domaine, vous pouvez définir la variable d'environnement `API_URL` au démarrage :
> * **PowerShell (Windows)** :
>   ```powershell
>   $env:API_URL="http://localhost:9000"; npm run start
>   ```
> * **Bash (Linux/macOS)** :
>   ```bash
>   API_URL="http://localhost:9000" npm run start
>   ```

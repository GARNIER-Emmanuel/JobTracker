# Spécifications & Périmètre du Projet : JobTracker

Ce document définit le périmètre fonctionnel, technique et méthodologique pour la réalisation du projet personnel **JobTracker**. Ce projet consiste à développer un outil de suivi des candidatures d'emploi avec un backend Java Spring Boot connecté à une base Neon PostgreSQL distante et un frontend Angular Standalone moderne.

## 1. Périmètre Fonctionnel

L'application permet de centraliser et de suivre l'état de différentes offres d'emploi auxquelles l'utilisateur s'intéresse ou a postulé.

### L'Entité principale : `JobOffer`

Chaque offre d'emploi est caractérisée par les attributs suivants :

- **`id`** : Identifiant unique (UUID généré par le backend).
- **`title`** : Intitulé du poste (obligatoire, ex: "Développeur Fullstack Java/Angular").
- **`company`** : Nom de l'entreprise (obligatoire).
- **`location`** : Localisation géographique (ex: "Lyon, France").
- **`offerUrl`** : Lien URL http/https vers l'annonce (obligatoire, au format URL valide).
- **`salary`** : Rémunération annuelle ou mensuelle (optionnel).
- **`contactName`** : Nom du recruteur ou interlocuteur principal (optionnel).
- **`status`** : État d'avancement de la candidature (Enum : `WISHLIST`, `APPLIED`, `INTERVIEW`, `OFFER`, `REJECTED`).
- **`contacted`** : Indicateur si le premier contact a été établi (booléen).
- **`response`** : Type de réponse reçue (Enum : `PENDING`, `YES`, `NO`).
- **`remoteWork`** : Type de télétravail (Enum : `NONE`, `PARTIAL`, `OCCASIONAL`).
- **`applicationDate`** : Date de candidature (obligatoire, ne peut pas être dans le futur).
- **`notes`** : Commentaires ou retours d'entretien (texte libre, optionnel).

## 2. Périmètre Technique

### Architecture Backend (Java)

- **Langage & Version** : Java 17.
- **Framework** : Spring Boot 3.x (Spring Web, Spring Data JPA, Spring Validation).
- **Gestionnaire de Build** : Maven.
- **Migration BDD** : Flyway ou Liquibase (versionnement des schémas SQL).
- **Base de Données** : PostgreSQL hébergé à distance sur la plateforme Neon.
- **Sécurité** : Non requise pour cette version (pas de système de connexion utilisateur).

### Architecture Frontend (Angular)

- **Framework** : Angular 17+ avec architecture 100% composants Standalone.
- **Gestion d'état & Réactivité** : Signals d'Angular (`signal`, `computed`, `effect`).
- **Asynchronisme & Flux** : RxJS 7+ combiné à l'interopérabilité des signaux (`toSignal`, `toObservable`).
- **Routage** : Configuration avec Lazy Loading fonctionnel.
- **Formulaires** : Formulaires réactifs (`ReactiveFormsModule`) avec validations croisées.
- **Style** : Vanilla CSS moderne avec design épuré (palette de couleurs cohérente, cartes interactives, adaptabilité mobile).

## 3. Méthodologie & Qualité

Pour assurer un développement de niveau professionnel, les pratiques suivantes sont imposées :

- **Démarche TDD (Test-Driven Development)** : Les tests unitaires doivent être rédigés avant le code de production, tant sur le backend que sur le frontend.
- **Commit Git Conventionnels** : Les messages de validation de commits doivent respecter les standards de l'industrie (ex: `feat(api): add validation to job offer creation`, `test(form): add unit test for URL format`).
- **Isolation des Tests** : Utilisation de mocks (Mockito en Java, TestBed avec espions/mocks en Angular) pour tester les couches logiques de manière strictement isolée.

## 4. Découpage par Features (Plan d'Action)

Le projet est divisé en livrables élémentaires à développer de manière séquentielle (Feature par Feature).

### Phase 1 : Backend (Spring Boot 3 & Neon DB)

- [x] **Feature 2.1 : Configuration de la persistance & Schéma de base**
  - **Objectif** : Raccorder l'application à Neon DB et générer la table `job_offers`.
  - **Tests** : Validation du démarrage du contexte d'intégration JPA.

- [x] **Feature 2.2 : Création d'une offre d'emploi (`POST /api/jobs`)**
  - **Objectif** : Validation des données d'entrée du DTO et persistance de l'offre.
  - **Tests** : Tests unitaires du service et test MVC du contrôleur (cas nominaux et cas de rejet de validation).

- [x] **Feature 2.3 : Récupération des offres d'emploi (`GET /api/jobs` et `GET /api/jobs/{id}`)**
  - **Objectif** : Récupérer la liste complète des offres et le détail d'une offre par son ID.
  - **Tests** : Validation de la présence des données dans le service et des statuts de retour (200 OK, 404 Not Found) dans le contrôleur.

- [ ] **Feature 2.4 : Mise à jour d'une offre (`PUT /api/jobs/{id}`)**
  - **Objectif** : Permettre la modification d'un enregistrement (changement de statut, note, etc.).
  - **Tests** : Validation de la cohérence des mises à jour métier dans la couche service.

- [ ] **Feature 2.5 : Suppression d'une offre (`DELETE /api/jobs/{id}`)**
  - **Objectif** : Retirer définitivement une offre.
  - **Tests** : Validation de la suppression de la donnée en base.

- [ ] **Feature 2.6 : Gestion globale des exceptions**
  - **Objectif** : Harmoniser toutes les réponses en cas d'erreur de l'API (400 Bad Request, 404 Not Found) dans une structure JSON identique.
  - **Tests** : Validation du format JSON de retour sur les échecs de requêtes.

### Phase 2 : Frontend (Angular Standalone & Signals)

- [ ] **Feature 3.1 : Squelette, Layout & Routage Standalone**
  - **Objectif** : Configurer la navigation et le chargement différé des composants de base.
  - **Tests** : Validation de la configuration des routes et de la présence des composants structurels.

- [ ] **Feature 3.2 : Modèles de données & Service API avec State (Signals)**
  - **Objectif** : Gérer les appels API et le stockage centralisé de la donnée à l'aide de signaux réactifs.
  - **Tests** : Mocks HTTP avec `HttpTestingController` pour valider la mise à jour des signaux au retour des requêtes.

- [ ] **Feature 3.3 : Composants d'affichage (Liste & Cartes)**
  - **Objectif** : Intégrer l'interface de visualisation responsive avec les cartes d'offres.
  - **Tests** : Validation du comportement des `@Input` et `@Output` des cartes.

- [ ] **Feature 3.4 : Formulaire Réactif & Validations croisées**
  - **Objectif** : Formulaire d'ajout/modification avec validation du format URL et règles conditionnelles d'affichage.
  - **Tests** : Validation de l'activation/désactivation du formulaire et de l'affichage des alertes de saisie.

- [ ] **Feature 3.5 : Dashboard Statistique & Filtres dynamiques (Signals calculés)**
  - **Objectif** : Fournir une barre de recherche instantanée et des KPI automatiques basés sur des signaux de type `computed`.
  - **Tests** : Vérification de la mise à jour automatique des métriques sans appels API superflus.

- [ ] **Feature 3.6 : Intercepteur HTTP fonctionnel**
  - **Objectif** : Intercepter globalement les erreurs de communication pour avertir l'utilisateur de manière ergonomique.
  - **Tests** : Simulation d'erreurs HTTP et vérification du déclenchement du flux d'alerte.

### Phase 3 : Intégration Continue (CI) & Automatisation

- [ ] **Feature 4.1 : Automatisation avec GitHub Actions**
  - **Objectif** : Mettre en place un pipeline d'intégration continue qui valide chaque commit sur les branches de travail.
  - **Configuration** :
    - Création d'un workflow GitHub Actions dans le dossier `.github/workflows/ci.yml`.
    - **Job Backend** : Configuration de l'environnement JDK 17, mise en cache Maven et exécution des tests via `mvn test`.
    - **Job Frontend** : Configuration de l'environnement Node.js, installation des dépendances et exécution des tests unitaires Angular en mode headless (sans navigateur graphique).
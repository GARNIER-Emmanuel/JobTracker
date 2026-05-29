# JobTracker Backend ☕

Ce module contient le backend Spring Boot 3.x de l'application **JobTracker**. 

---

## 🏗️ Architecture : Screaming & Vertical Slice

Pour ce projet, nous dépassons l'architecture classique en couches techniques (Controller/Service/Repository horizontaux) au profit d'une **Screaming Architecture** organisée en **Vertical Slices (Tranches Verticales)**.

### Pourquoi ce choix ?
1. **Haute Cohésion / Faible Couplage** : Toutes les classes liées à une fonctionnalité métier (ex: la gestion des offres d'emploi) résident ensemble. Si une spécification change sur les offres d'emploi, nous ne modifions que le package associé.
2. **Architecture Parlante (Screaming)** : En ouvrant le projet, la structure des répertoires "crie" le domaine d'activité de l'application (`joboffer`), et non les outils technologiques utilisés.
3. **Facilité de Maintenance & TDD** : Il est beaucoup plus simple d'écrire et de faire tourner les tests associés à une tranche verticale spécifique.

---

## 📁 Structure des Packages Proposée

Voici le squelette d'organisation de notre code source dans `src/main/java/com/jobtracker/backend/` :

```
com.jobtracker.backend/
│
├── BackendApplication.java       # Point de démarrage Spring Boot
│
├── core/                         # Code transversal indépendant du métier
│   ├── config/                   # Configurations globales (CORS, Sécurité, etc.)
│   └── exception/                # Gestion globale des exceptions (Feature 2.6)
│       ├── GlobalExceptionHandler.java
│       └── ErrorResponse.java
│
└── joboffer/                     # Slice Verticale : Domaine des offres d'emploi
    ├── JobOffer.java             # Entité JPA (Base de données)
    ├── JobOfferRepository.java   # Accès aux données (Spring Data JPA)
    ├── JobOfferStatus.java       # Enum (WISHLIST, APPLIED, etc.)
    │
    ├── JobOfferController.java   # API Rest : Exposition des endpoints HTTP
    ├── JobOfferService.java      # Service : Logique métier et orchestrateur
    │
    ├── dto/                      # Data Transfer Objects (Validation d'entrée/sortie)
    │   ├── JobOfferRequest.java  # DTO pour création et mise à jour
    │   └── JobOfferResponse.java # DTO pour les réponses de l'API
    │
    └── exception/                # Exceptions spécifiques au domaine
        └── JobOfferNotFoundException.java
```

---

## 🛠️ Modèle de Données & Validations

Conformément à nos spécifications, l'entité `JobOffer` est validée via le package `jakarta.validation` au niveau des DTOs :
* **Validation syntaxique des URLs** (`@URL`) pour `offerUrl`.
* **Validation de présence** (`@NotBlank`) pour `title` et `company`.
* **Dates non futures** (`@PastOrPresent`) pour `applicationDate`.

---

## 🧪 Stratégie de Test (TDD)

Chaque tranche verticale sera développée selon le cycle **Red-Green-Refactor** :
1. **Tests Unitaires du Domaine & Service** : Validation des règles métier à l'aide de tests unitaires isolés (avec Mockito pour moquer le repository).
2. **Tests API (Contrôleur)** : Utilisation de `MockMvc` pour tester l'exposition HTTP, le statut de retour, la désérialisation JSON et le déclenchement des validations DTOs sans démarrer tout le serveur Web.
3. **Tests d'Intégration JPA (Optionnel)** : Validation des requêtes personnalisées de repository avec H2 (ou Neon de test).

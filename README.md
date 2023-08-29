# Sirius

Service permettant la collecte et la restitution des avis des apprentis.

## Développement

### Pré-requis

- Docker 19+
- Docker-compose 1.27+

### Démarrage

Pour lancer l'application :

```sh
make install
make start
```

Cette commande démarre les containers définis dans le fichier `docker-compose.yml` et `docker-compose.override.yml`

L'application est ensuite accessible à l'url [http://localhost](http://localhost)

### Architecture

Le monorepo est composé d'un package back-end situé dans `server` et d'un package front-end situé dans `ui`.

#### Server

L'architecture du `server` est composé de :

- **Routes** passant les requêtes au **Controllers**. Elles s'occupent des valider la requête et de l'autoriser ou non à travers les **Middlewares**.
- **Controllers**  qui fait l'interface entre **Routes** et **Services**. Ils s'occupent de déstructurer les données de requête, passer la donnée aux **Service** et répondre à la requête.
- **Services** contenant la logique métier, remontant les erreurs et communique avec les DAO.
- **Data Access Objects** responsables de la récupération et l'ajout de donnée en base de donnée.

#### UI

L'`ui` est découpé en domaine : `campagnes`, `legal`, `questionnaires`, `temoignages` et `users`. Chacun de ces dossiers contient les vues et les composants correspondants.

### Collections

La base de données MongoDB contient **6 collections**.

- **Campagnes** : _id, nomCampagne, startDate, endDate, questionnaireId, deletedAt, seats, createdAt, updatedAt.
- **Etablissements** : _id, data, formationsIds, deletedAt, createdBy, createdAt, updatedAt. *(le champs data contient les informations récupéré sur le catalogue de formations)*
- **Formations** : _id, data, campagneId, deletedAt, createdBy, createdAt, updatedAt. *(le champs data contient les informations récupéré sur le catalogue de formations)*
- **Questionnaires** : _id, nom, questionnaire, questionnaireUI, isValidated, deletedAt, createdBy, createdAt, updatedAt
- **Temoignages** : _id, campagneId, responses, createdAt, updatedAt
- **Users** : _id, firstName, lastName, username, role, status, comment, siret, etablissement, authStrategy, refreshToken, salt, hash

### Variable d'environnement

Les variable d'environnement sont activé par défaut dans le fichier `server/src/config.js`. Celles utilisées sont :

```js
SIRIUS_ENV
SIRIUS_MONGODB_URI
SIRIUS_AUTH_JWT_SECRET
SIRIUS_AUTH_REFRESH_TOKEN_SECRET
SIRIUS_AUTH_SESSION_EXPIRY
SIRIUS_AUTH_REFRESH_TOKEN_EXPIRY
SIRIUS_AUTH_COOKIE_SECRET
```

## Fonctionnement

### Utilisateurs

Un utilisateur peut s'inscrire sur la plateforme de lui même. Son `status` sera `PENDING`. Un uilisateur avec le role `ADMIN` pourra alors changer son role en `ACTIVE`, lui permettant d'accéder à la plateforme ou en `INACTIVE` l'empechant d'accéder à la plateforme.
Chaque utilisateur qui s'inscrit doit choisir son établissement grâce à son SIRET. Ce SIRET se retrouvera dans l'object décrivant l'utilisateur. Ce SIRET sert également à récupérer les informations concernant l'établissemnt dans le [catalogue de formation](https://catalogue-apprentissage.intercariforef.org/).
Une fois un utilisateur validé par un admin, l'établissement sera créé dans la collection `etablissement`.

Le sytème d'authentification repose sur un `JSONWebToken` ainsi qu'un `RefreshToken`, dont les secrets sont injecté par les variables d'environnement.

### Questionnaire

Un `questionnaire` représente la structure des questions posées et leurs interfaces.
Cette structure utilise la norme `JSON Schema` à travers la librairie [react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form).

Chaque question est lié à un custom widget afin de gérer son interface. Ces customs widgets se trouvent dans `ui/src/Components/Form/widgets`. Ce mapping se retrouve dans l'objet `widgets` du fichier `AnswerCampagne.js`.
Une question est lié à un widget à travers l'object `questionnaireUI` qui permet également de définir certaines valeurs telles que des min/max.

Un questionnaire peut être activé ou désactivé par un admin dans le back-office. Une fois un questionnaire activé il pourra être utilisable pour créer une campagne.

### Campagne

Une campagne est lié à un `questionnaire` et appartient à une `formation`. On lui définit un nombre de `seats` représentant le nombre de personne pouvant y répondre, 0 signifiant un nombre de place illimité. Cette campagne dispose également d'une date de début et de fin.

C'est l'objet `campagne` qui est utilisé pour la passation du questionnaire.

### Témoignage

Un `temoignage` contient les réponses d'un utilisateur à une campagne. Ces réponses sont au format JSON et sont ensuite utilisé dans le Dashboard.

### Export

Un export XLSX des campagne associés à un établissement et possible depuis la vue de gestion des campagnes. Cet export produit également un fichier `zip` contenant les QR codes permettant d'accéder aux campagnes.

### Catalogue de formation

L'application est branché à l'[API du catalogue des offres de formations en apprentissage](https://catalogue-apprentissage.intercariforef.org/). Cet API nous permet de récupérer les données lié à un établissement à travers son SIRET ainsi qu'aux formations associés à cet établissment.

![Logo République française](https://avatars1.githubusercontent.com/u/63645182?s=200&v=4)

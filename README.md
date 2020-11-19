# Sirius

Service permettant la collecte et la restitution des avis des apprentis

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

Il est possible de créer un jeu de données afin de pouvoir tester l'application

```sh
make dataset
```

Une fois cette commande executée, des questionnaires sont disponibles à l'url [http://localhost/smtp](http://localhost/smtp)

![](https://avatars1.githubusercontent.com/u/63645182?s=200&v=4)

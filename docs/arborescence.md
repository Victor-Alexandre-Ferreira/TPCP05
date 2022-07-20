# Explication du rôlé de fichier de l'arboresence

index.js
.env
app/
    |_ router.js
    |_ controllers/
        |_ …Controller.js
    |_ db.js
    |_ datamappers/
        |_ …Datamapper.js
    |_ views/
        |_ partials
            |_ ….ejs
        |_ ….ejs

## index.js

C'est le point d'entrée de notre application Node.js. On le nomme ainsi par convention. il pourrait s'appeler "michel" mais c'est une marque déposé :troll:

Dans celui-ci on va faire 3 choses principales :

- Lire le fichier `.env` à la racine du projet avec le module "dotenv" qui va s'occuper de charger l'ensemble des variables listé à l'intérieur, dans l'environnement du processus Node courant. (ici : `node index.js`)
- Créer l'application Express, en definissant tous ce dont elle à besoin pour fonctionner (config, router, middlewares, …)
- Lancer le serveur web (en utilisant la méthode listen() de l'application Express)

## .env

Fichier contenant une liste de paire clé=valeur qui seront lu par le module dotenv, afin de les charger en tant que variable d'environnements.

Celles-ci seront alors accessible dans tous les fichiers qui font partie du même processus d'execution. Donc de tout les fichier qui seront require en cascade à poartir de l'`index.js`.

## router.js

Celui-ci est utilisé par l'application Express. Il est chargé de redirigé les requêtes HTTP des utilisateur en fonction de l'url demandée.

`http://www.domain.com/promo/1`

`http` : protocole

`://` : caractère necéssaire à toute URI

`www.domain.com` : domaine ou IP

`/promo/1` : route

En fonction de la route demandé il ira exécuté une des méthodes des controllers afin de répondre à la requête HTTP utilisateur

## controllers

Leurs rôles :

- récupérer les données envoyé par l'utilisateur (ce qui se trouve dans la requête HTTP)
- vérifier que les données utilisateurs soit valides
- récupérer les données en utilisant les datamappers et en leur envoyant, si besoin, une ou des données utilisateurs
- vérifier les données reçu des datamappers
- et enfin générer la vue, qui sera renvoyer à l'utilisateur.

## datamappers

Leurs rôles :

- utiliser la connection à la BDD afin d'exécuter des requêtes SQL vers celle-ci.
- d'organiser le retour de cette requête SQL afin de rendre leur exploitation plus simple du côté des controllers.

## db.js

Son rôle est de créer un nouveau client de connection, d'activer cette connection et de la renvoyer aux datamappers.

## views

Leur rôle est d'aider à la génération du contenu qui sera renvoyer par les controllers en réponse aux requête HTPP des utilisateurs.

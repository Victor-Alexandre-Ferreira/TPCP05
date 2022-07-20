// On ne stocke pas le module dans une variable, car on ne l'utilisera qu'une seul dans toute l'application.
// On l'utilisera toujours en première ligne du fichier d'entrée du server express
// Cette méthode config() va allez lire un fichier .env à la racine du projet et charger les variables d'environnement à l'intérieur de l'environnement global du process du serveur node.
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const router = require('./app/router');
const initLocals = require('./app/middlewares/initLocals');

const app = express();

// la notation || permet de féinir une valeur par défaut, dans le cas ou la valeur a gauche de celui-ci est falsy
// Liste des valeurs falsy (considérer par JS comme false)
/*
    - "" (string vide)
    - 0
    - null
    - undefined
    - NaN
*/
// Ici en l'occurence les 2 seuls valeurs falsy que pourrait avoir la variable d'environnement PORT sont : "" ou undefined
const port = process.env.PORT || 4000;
// ou ??, mais ici dans le cas d'un valeurde chaine vide, cela ferai planté le script, donc il faut prendre en compte les valeurs falsy avec le ||

app.set('view engine', 'ejs');
app.set('views', './app/views');

app.use(express.static('./public'));

// Après le static parce qu'on a pas besoin de session pour des images par exemple
// Avant le router car on va devoir lire des infos de la session
app.use(session({
    secret: process.env.SESSION_PASS || 'password par fort',
    resave: false,
    saveUninitialized: true
}));

app.use(initLocals);

// Middleware de permettant de nourrir l'objet req.body avec les données envoyer via un formaulaire dans une requête POST.
// Ce middleware doit impérativement se placer avant le router, car les controllers devront potentiellement exploiter ces informations.
// On peut optimiser notre application en plaçant ce middleware après le middleware de static, car un fichier static n'exploitera pas les données d'un POST. Donc on économise un traitement par l'applciation.
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.listen(port, () => {
    console.log(`Server launched on http://localhost:${port}`);
});
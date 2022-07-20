// On récupère le client de connection à la BDD du module
// Pour le moment on ne comprend pas vraiment cette notation, mais c'est pas grave on verra cela plus tard.
// Tous ce qu'on c'est quon va pour untiliser une variable "Client"
const { Client } = require('pg');
// Ce qu'il y dans cette variable, va nous permettre de créer un nouveau client
// Pour créer ce nouveau client on lui fourni les informations de connection sous forme d'URI (cela ressemble fortement a une url que l'on utilise dans un navigateur, mais le protocole est différent)
//on lui fourni le protocol, le username, le password, l'adresse, et la nom de la BDD
const client = new Client('postgresql://etudiant:js4life@pg.oclock.lan/trombi');

/// Et on va faire en sorte de connecter ce nouveau client
client.connect();

// Maintenant on va pouvoir utiliser notre client pour demander des choses à la BDD
// On va effectuer des requête sur celui-ci
// Quand on fait une requête a travers la méthode query du client on est pas obligé d'ajouter le ; à la fin de la requête, il le fera lui-même
// La méthode de requêtage du client va prendre un certain temps a s'exécuter, je ne peux donc récupérer instantanément le résultat.
// Il faut que je fournisse une function de callback qu'il executera une fois le résultat récupérer du serveur.
// Ce callback un un callback à signature (types, et nombre des paramètre) standard. Le premier param contiendra l'erreur s'il y a, et le 2eme le resultat s'il y a. On aura toujours soit l'un, soit l'autre, jamais les 2 en même temps.
client.query('SELECT * FROM "promo"', (error, result) => {
    if(error){
        return console.error(error);
    }

    console.log(result.rows);

    // Dans notre cas (un fichier de test), on veux que node nous rende la main ddans le terminal. Pour cela il faut mettre fin à la connexion avec la BDD, car on pourrait vouloir faire plusieurs requête en même temps, ou l'une apprès l'autre.
    client.end();
});

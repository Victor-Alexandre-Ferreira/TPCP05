# Trombin'O'clock

## Challenge Épisode 4

### Ajouter un étudiant

Si ce n'est pas déjà fait, ajouter sur la page d'accueil un nouveau lien "Ajouter un étudiant" qui pointe vers l'url `/admin/addStudent`.

#### Étape 1: afficher le formulaire

Implémenter la route `/admin/addStudent` dans un nouveau controller `adminController`.  
Une version HTML du formulaire est dipo dans le dossier intégration (`add_student.html`).

#### Étape 2 : Remplir le select

Dans la route qui vient d'être implémentée, inspire toi de ce qui a été fait dans les autres controllers pour remplir le `<select>` du formulaire avec des `<option>` qui représentent les promos. Bien sur, la liste des promos doit venir de la base de données !

<details>
<summary>Un coup de main ?</summary>

- Commence par require `dataMapper` dans le controller `adminController`.
- Il faut ensuite appeller `dataMapper.getAllPromotions`, pour récupérer la liste des promotions !
- N'oublie pas le traitement de l'erreur éventuelle, puis passe la liste des promotions à la view `addStudent`.
- Dans la view `addStudent`, utilise la liste des promos pour créer des `<option>`. Puisque c'est une liste, il faudra une boucle.

</details>

#### Étape 3/Bonus : Traiter le POST

Utilise tout ce que tu connais pour traiter les informations du formulaire et ajouter un étudiant dans la base de données !

Remarque : on a déjà préparé la requete SQL ! cf [doc/sql.md](./doc/sql.md)

<details>
<summary>Un peu d'aide ?</summary>

- Il faut d'abord ajouter le middleware `express.urlencoded({extended: true})` à `app` dans `index.js`. Sinon `req.body` n'existera pas !
- Ensuite, il faut définir une route POST qui va déclencher la méthode `adminController.addStudent`.
- Il faut maintenant coder la méthode `adminController.addStudent` !
  - Ajoute une nouvelle méthode `addStudent(studentInfo)` dans le `dataMapper`. Cette méthode doit lancer une requête "INSERT ..." en utilisant les paramètres passés dans l'objet `studentInfo`. Inspire toi de ce qui a été fait précédement !
  - Dans `adminController.addStudent`, il faut maintenant appeller `dataMapper.addStudent` en lui passant les bons paramètres !
  - Si tout s'est bien passé, redirige l'utilisateur vers la page de détails de la promotion sélectionnée.
</details>

## Challenge Épisode 3

### Écrire du SQL (oui, encore !)

Reprendre le fichier de requêtes SQL préparé hier, et ajouter les requêtes suivantes :

- Insérer dans la table "student" un étudiant qui s'appelle "Chuck Norris" appartenant à la promo 5
- Insérer dans la table "promo" une promo qui s'appelle "César" et ne possède pas d'orga
- Mettre à jour la promo 5 pour la renommer "Cleo"
- Supprimer la promo 123

### Bonus : async

Les promesses c'est chouette, mais elles ouvrent la voie à l'utilisation d'un mécanisme encore plus sympa en terme de lisibilité : async/await !

Et si, au lieu de se prendre la tête avec les callback on les supprimait :O.

Objectif, avoir un code qui **ressemble** à

```js
const results = client.query('SQL');
 // faire des trucs avec results

```

au lieu de

```js
client.query('SQL').then((results) => {
  // faire des trucs avec results
});
```

en utilisant les mots clefs `async` et `await`

<details>
<summary>Un coup de main</summary>

async/await sont des mots clefs qui permettent de rendre la promesse complètement transparente. `await` permet de dire à une fonction qui devrait nous renvoyer une promesse : "non, mais en fait je n'en veux pas de ta promesse, je vais directement attendre le résultat, je ne passe pas à la suite tant que je ne l'ai pas !"

```js
client.query('du SQL').then((results) => {
  // faire des trucs avec results
});
```
  
devient
  
```js
const results = await client.query('du SQL');
 ```

Par contre ! Ça n'est pas non plus la fête du slip, on peut passer l'appel asynchrone de la requête SQL en "_synchrone_", mais à la seule condition de passer *toute* la fonction qui contient ce code en asynchrone pour lui spécifier qu'il y aura du code asynchrone à l'intérieur.
  
```js
// on note l'ajout de async avant la fonction
promoList: async (req, res) => {
  const results = await client.query('du SQL');
  // faire des trucs avec results
}
```
  
Bah, oui, mais et pour l'erreur ? Je vous laisse chercher. Allez, un petit indice : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/try...catch
  
</details>

## Challenge Épisode 2

### Étape 1: écrire du SQL

Dans le dossier doc, créer un fichier sql.md. Dans ce fichier, écrire les requêtes SQL pour obtenir les informations suivantes :

- toutes les promos, dans l'ordre alphabétique
- tous les étudiants, dans l'ordre alphabétique des noms de famille
- tous les étudiants de la promo 135
- les étudiants dont le nom ou le prénom ressemble à "max"

### Étape 2: SQL + Express

En s'inspirant de ce qui a été fait en cockpit, modifier la fonctionnalité "liste des promos" pour qu'elle utilise une requête SQL !

<details>
<summary>Un coup de main</summary>

Toutes les modifications vont se passer dans le fichier `promoController.js` !

- D'abord il faut pouvoir parler à la base de données. Donc il nous faut un client. Créer et connecter un client `pg`, juste avant la définition du controller.
- Puis dans la méthode qui liste des promos, il faut exécuter une requête SQL !
- Ne pas oublier que la méthode `client.query` ne renvoie pas directement les résultats, il faut définir un _callback_.

```js
  promoList: (req, res) => {
      //...
      client.query('du sql', (error, results) => {
          // cette fonction se déclenchera quand la BDD aura répondu.
          // c'est ici qu'il faut soit traiter l'erreur si il y en a une, soit utiliser les résultats !
      });
      // pas de code ici : on ne fait rien tant que la BDD n'a pas répondu!
  }
```

</details>

## Bonus 1: Des promesses, des promesses, toujours des promesses !

Si on regarde la documentation du module `pg` https://node-postgres.com/features/queries, on voit qu'il existe une autre solution que les callback : les promesses (`Promise`). 
Votre mission, si vous l'acceptez : executer une requête SQL, toujours avec `client.query`, mais en utilisant le mécanisme des promesses.

De la doc : https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Using_promises

<details>
<summary>Un coup de main</summary>

Notre appel à client.query qui ressemblait à :

```js
client.query('du sql', (error, results) => {
    // cette fonction se déclenchera quand la BDD aura répondu.
    // c'est ici qu'il faut soit traiter l'erreur si il y en a une, soit utiliser les résultats !
});
```

Va devenir
  
```js
client.query('du sql').then((data) => {
  // cette fonction se déclenchera quand la BDD aura répondu.
  // c'est ici qu'il faut utiliser les résultats
  // par contre, cette fonction ne sera pas appelée en cas d'erreur.
});
```

Et si on veut traiter l'erreur

```js
client.query('du sql').then((data) => {
  // cette fonction se déclenchera quand la BDD aura répondu.
  // c'est ici qu'il faut utiliser les résultats
  // par contre, cette fonction ne sera pas appelée en cas d'erreur.
}).catch((error) =>  {
  // fonction appelée en cas d'erreur
});
```

</details>

## Bonus 2: détails et liste des étudiants

Sur le même principe que l'étape 2, modifier les fonctionnalités "détails d'une promo" et "liste des étudiants d'une promo" en utilisant une requête SQL (en mode promesses).

## Challenge Épisode 1

### Lister les étudiants d'une promo

Énoncé du débrouillard: Dans la page détails d'une promo, ajouter un lien "voir les étudiants de la promo" et implémenter la fonctionnalité.

### Bonus

L'intégration faite par le stagiaire est ... sommaire. N'hésitez pas à la retravailler !

<details>
<summary>Énoncé détaillé</summary>

- La fonctionnalité concerne une seule promo, donc là encore on a besoin d'une route paramétrée pour cibler un ID. par exemple `/promo/:id/students`
- La méthode associée doit être dans un controller. Soit `promoController`, soit `studentController`, à vous de voir ce qui vous semble le plus logique, du moment que la méthode porte un nom explicite !
- Dans cette méthode il faut :
  - récupérer l'id de la promo ciblée
  - trouver la liste des étudiants de la promo. Importer la liste des étudiants depuis le json, et utiliser une boucle ou un [`.filter`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/filter#syntaxe).
  - "render" la view, sans oublier de lui transmettre les données !
- Contruire la view en listant les étudiants
- Ne pas oublier d'ajouter le lien vers la fonctionnalité dans la page "détails d'une promo".

</details>

## Gestion de projet

c'est par [ici](./docs/cdc.md)

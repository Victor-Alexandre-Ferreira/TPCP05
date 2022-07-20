// Le fait de require un json va transformer celui-ci en objet JS ou dans ce cas précis un tableau d'objet JS.
const students = require('../../data/students.json');

const { Client } = require('pg');
const client = new Client('postgresql://trombi:trombipass@localhost/trombi');
client.connect();

const promoController = {

    promoList(_, res) {
        /*
        La réprésentation ci-dessous est une ligne de temps

        Exécution par JS
        |
        |
        Envoi de la requête au serveur Postgres
        |
        |
        |
        Retour de la réponse du serveur Postgres
        |
        |
        |
        |
        Récupération par Node et le module PG des données
        |
        Exécution de la fonction de callback
        |
        Rendu de la vue
        |
        Envoi de la réponse à l'utilisateur
        */
        /*
         client.query('SELECT * FROM "promo"', (error, result) => {
             if(error){
                 return console.error(error);
             }
             const promos = result.rows;
             res.render('promos', { promos });
             // Ici contrairement au fichier test.js, on ne veut pas mettre fin à la connexion avec les serveur Postgres, on veut la conserver pour répondre a de potentiels autres requêtes
         });
         */
        client.query('SELECT * FROM "promo"')
            // De base la méthjode query de client, si on ne lui fourni rien (pas de 2eme argument), renverrai par défaut une promesse (Promise). Afin de résoudre cette promesse on doit utiliser la méthode then (en fait techniquement il n'enverra pas la requête SQL au serveur tant que 'lon a pas utiliser la méthode then). Celle-ci sert à exécuter le query et a capturer le résultat en cas de bon déroulement de la requête
            .then((result) => {
                const promos = result.rows;
                res.render('promos', { promos });
            })
            // Si jamais une erreur intervient, il faut absolument gérer cette erreur sinon, c'est note serveur web tout entier qui va planter !
            // En cas d'erreur la méthode query va "lever"/"jeter" une erreur, il faut la récupérer grâce à la méthode catch(). Ensuite on gérera cette comme bon nous semble, mais le plus important c'est que notre serveur continuera à fonctionner.
            .catch((error) => {
                console.error(error);
                res.status(500).send(error.message);
            });
    },

    promoDetailsCB(req, res, next) {
        const id = parseInt(req.params.id, 10);

        let promo;
        for (const currentPromo of promos) {
            if (currentPromo.id === id) {
                selectedPromo = promo;
                // Break permet d'arrêter une boucle en cours de route
                break;
            }
        }

        // Version avec la méthode find
        promo = promos.find((currentPromo) => {
            return currentPromo.id === id // false / true
        });

        // Version One-liner
        // Avec retour implicite en fonction fléché
        promo = promos.find((currentPromo) => (currentPromo.id === id));

        if (!promo) {
            // On sort de la fonction de middleware en même que l'on redirige vers le middleware suivant, qui sera de tout évidence celui affichant une page 404
            return next();
        }

        res.render('promo', { promo });
    },

    promoDetails(req, res, next) {
        const id = parseInt(req.params.id, 10);

        client.query(`SELECT * FROM "promo" WHERE id = ${id}`)
            .then((result) => {
                // Comme dans tous les cas le resultat sera forcéement un tableau, qu'il y ai 1 ou plusieurs enregistrement, il faut que je précise que je veux le premier et du coup le seul (je le sait) élément de ce tableau
                const promo = result.rows[0];

                if (!promo) {
                    return next();
                }

                res.render('promo', { promo });
            }).catch((error) => {
                console.error(error);
                res.status(500).send(error.message);
            });


    },

    studentListCB(req, res, next) {
        // On formate l'id de promo afin de pouvoir l'exploiter en tant que nombre pour rechercher/filtrer des informations des données provenant des fichiers json
        const promoId = parseInt(req.params.id, 10);

        // On commence par récupérer la promo dans la liste des promos, car on aura besoin des informations de celle-ci pour les afficher dans la vue
        const promo = promos.find((currentPromo) => (currentPromo.id === promoId));

        // Dans le cas où la promo n'est pas présente dans les données, c'est qu'elle n'existe pas, donc que la page n'existe, on redirige donc vers la page 404, en utilisant la function next() qui renvoi vers le middleware suivant. Et le seul et le premier qui peut répondre ensuite, c'est le middlware d'affichage de page 404

        // promo peut être undefined (donc falsy == false)
        // le ! permet d'inverser un booléen
        // Donc si promo est undefined cela renvoi un "false"
        // On test l'invers donc true, donc il rentre dans la condition
        //- !promo est equivalant à : promo !== true
        if (!promo) {
            return next();
        }

        // Une fois que l'on s'est assuré que la promo existe bien, on récupère les étudiants de celle-ci en filtrant le tableau global qui contien tous les étudiants de toutes les promos, en vérifiant id de promo stocké dans la propriété "promo" de chaque étudiant
        const selectedStudents = students.filter((student) => {
            return student.promo === promoId;
        });

        // Pour finir on envoi l'information de proio et la liste des étudiants filtrés à la vue.
        res.render('students', { students: selectedStudents, promo });
    },

    studentList(req, res, next) {
        const promoId = parseInt(req.params.id, 10);

        // Version promesses imbriquées
        /*
        client.query(`SELECT * FROM "promo" WHERE id = ${promoId}`)
        .then((result) => {
            const promo = result.rows[0];

            if (!promo) {
                return next();
            }

            client.query(`SELECT * FROM "student" WHERE "promo_id" = ${promoId}`)
            .then((result) => {
                const students = result.rows;
                res.render('students', { students, promo });
            }).catch((error) => {
                console.error(error.message);
            });
        }).catch((error) => {
            console.error(error.message);
        });
        */
        let promo;
        client.query(`SELECT * FROM "promo" WHERE id = ${promoId}`)
            .then((result) => {
                promo = result.rows[0];

                if (!promo) {
                    return next();
                }

                const studentQuery = client.query(`SELECT * FROM "student" WHERE "promo_id" = ${promoId}`);
                // Si on retourne une promesse dans une résolution d'une promesse on peut enchainer les méthodes .then() et ainsi simplifier le code et le rendre plus lisible.
                // Avantage bonus on peut gérer les erreur a un seul endroit dans un catch final
                return studentQuery;
            })
            .then((result) => {
                const students = result.rows;
                res.render('students', { students, promo });
            }).catch((error) => {
                console.error(error);
                res.status(500).send(error.message);
            });

    },

    studentDetails(req, res, next) {
        const studentId = parseInt(req.params.id, 10);

        const student = students.find((currentStudent) => currentStudent.id === studentId);

        if (!student) {
            return next();
        }

        const promoId = student.promo;

        let promo = promos.find((currentPromo) => (currentPromo.id === promoId));

        if (!promo) {
            promo = {
                id: 0,
                name: 'Inconnu'
            }
        }

        res.render('student', { student, promo });
    }

};

module.exports = promoController;
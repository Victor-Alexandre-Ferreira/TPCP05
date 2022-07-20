const client = require('../db');

const promoDatamapper = {

    async findAll() {
        // Logiquement on devrait catcher l'erreur qui pourrait advenir dans le datamapper, car on execute une promesse qui peut en générer
        // Mais si on le fait ici, il n'y aura plus rien a récupérer dans le controller de// Et comme c'est le controller qui est chargé de répondre à l'utilisateur, on aura aucun moyen de prévenir, de façon propre, l'utilisateur, que quelque chose c'est mal passé.
        const result = await client.query('SELECT * FROM "promo"');
        return result.rows;
    },

    async findByPK(id) {
        // Comment se prémunir d'une potentielle injection SQL ?
        // Au lieux d'envoyer une string concaténer avec les valeurs dynamiques
        // `SELECT * FROM "promo" WHERE "id" = ${id}`
        // 'SELECT * FROM "promo" WHERE "id" = ' + id
        // On va plutôt utiliser une requête paramétrée (requête préparée)
        const preparedQuery = {
            // Au niveau du texte de la requête au lieu de lui fournir directement la valeur de ou des variables, on lui spécifie plutôt un placeholder.
            // En postgres celui-ci commencera toujours par un $
            // Suivi de la position de la valeur de remplacement, dans le tableau fourni dans la propriété values.
            // Cette position débute à 1 contrairement à l'index d'un tableau qui commence par 0
            // Donc $1 correspond a values[0]
            // ! Attention le nom des propriétés est important il faut respecter cette règle
            text: `SELECT * FROM "promo" WHERE "id" = $1`,
            values: [id]
        }

        // Les 2 parties sont envoyés telles quelles à la BDD.
        // C'est elle qui va les rassemblé, en prenant soin de traiter les valeurs reçues, afin d'éviter une injection SQL.
        const result = await client.query(preparedQuery);
        return result.rows[0];
    },

    async delete(id) {
        // On peut fournir le text et les values, sous forme de 2 arguments de la méthode query. Cela aura le même résultat que l'objet précédent
        await client.query(`DELETE FROM "student" WHERE "promo_id" = $1`, [id]);
        await client.query(`DELETE FROM "promo" WHERE "id" = $1`, [id]);
    },

    async insert(data) {
        // Lorsque l'on utilise les placeholders, on a pas besoin de lui préciser qu'elle est le type de valeurs à inséré. Il le determine lui même
        // Donc pas besoin de lui indiqué les simples guillement ici
        /*
        VALUES ($1, '$2', '$3')
        */
        const preparedQuery = {
            text: `
                INSERT INTO "promo"
                ("id","name", "github_organization")
                VALUES
                ($1, $2, $3);
            `,
            values: [
                data.id,
                data.name,
                data.github_organization
            ]
        }
        const result = await client.query(preparedQuery);
        return result.rowCount;
    },

};

module.exports = promoDatamapper;
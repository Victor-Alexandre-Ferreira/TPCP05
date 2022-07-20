const client = require('../db');

const studentDatamapper = {

    async findAll(){
        const result = await client.query('SELECT * FROM "student"');
        return result.rows;
    },

    async findByPK(id){
        const result = await client.query(`SELECT * FROM "student" WHERE "id" = $1`, [id]);
        return result.rows[0];
    },

    async findByPromoId(promoId){
        const result = await client.query(`SELECT * FROM "student" WHERE promo_id = $1`, [promoId]);
        return result.rows;
    },

    async delete(id){
        await client.query(`DELETE FROM "student" WHERE "id" = $1`, [id]);
    },

    async insert(data){
        const preparedQuery = {
            text: `
                INSERT INTO "student"
                (
                    "first_name",
                    "last_name",
                    "github_username",
                    "profile_picture_url",
                    "promo_id"
                )
                VALUES ($1, $2, $3, $4, $5);
            `,
            values: [
                data.first_name,
                data.last_name,
                data.github_username,
                data.profile_picture_url,
                data.promo_id
            ]
        }
        const result = await client.query(preparedQuery);
        return result.rowCount;
    },

};

module.exports = studentDatamapper;
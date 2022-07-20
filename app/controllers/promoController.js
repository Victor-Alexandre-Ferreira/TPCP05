const promoDatamapper = require('../datamappers/promoDatamapper');

const promoController = {

    async promoList(_, res) {
        try {
            // On ne gère plus le SQL dans le controller, c'est pas son rôle. Maintenant ce sera le rôle d'un autre module, qui est spécialisé dans la e fait de faire de requêtes SQL et de nous renvoyer juste un tableau de d'élément ou juste un élément en particulier
            const promos = await promoDatamapper.findAll();
            res.render('promos', { promos });
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    },

    async promoDetails(req, res, next) {
        try {
            const id = req.params.id;

            const promo = await promoDatamapper.findByPK(id);

            if (!promo) {
                return next();
            }
            res.render('promo', { promo });
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }

    },

};

module.exports = promoController;
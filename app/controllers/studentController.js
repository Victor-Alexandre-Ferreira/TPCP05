const promoDatamapper = require('../datamappers/promoDatamapper');
const studentDatamapper = require('../datamappers/studentDatamapper');

const studentController = {

    async studentList(req, res, next) {
        // Au final le rôle du controller se résumé à :
        /*
            - Récupérer les données envoyé par l'utilisateur (ce qui se trouve dans la requête)
            - vérifier que les données utilisateurs soit valides
            - vécupérer les données en utilisant les datamapper et en leur envoyant, si besoin, une ou des données utilisateurs
            - vérifier les données reçu des datamappers
            - et enfin générer la vue, qui sera renvoyer à l'utilisateur.
        
        */
        try {
            const promoId = parseInt(req.params.id, 10);
            if (Number.isNaN(promoId)) {
                return next();
            }

            const promo = await promoDatamapper.findByPK(promoId);
            if (!promo) {
                return next();
            }

            const students = await studentDatamapper.findByPromoId(promoId);

            res.render('students', { students, promo });
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }

    },

    async studentDetails(req, res, next) {
        try {
            const studentId = parseInt(req.params.id, 10);
            if (Number.isNaN(studentId)) {
                return next();
            }

            const student = await studentDatamapper.findByPK(studentId);
            if (!student) {
                return next();
            }

            const promo = await promoDatamapper.findByPK(student.promo_id);
            if (!promo) {
                promo = {
                    id: 0,
                    name: 'Aucune promo'
                }
            }

            res.render('student', { student, promo });
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    },

};

module.exports = studentController;
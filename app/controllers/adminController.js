const promoDatamapper = require('../datamappers/promoDatamapper');
const studentDatamapper = require('../datamappers/studentDatamapper');

module.exports = {

    async showStudentForm(req, res) {
        if(!req.session.login){
            res.redirect('/login');
        }
        /*
        promoDatamapper.findAll().then((promos) => {
            res.render('addStudent', { promos })
        }).catch((err) => {
            console.error(err);
            res.status(500).send(err.message);
        });
        */
        try {
            const promos = await promoDatamapper.findAll();
            res.render('addStudent', { promos });
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    },

    async addStudent(req, res) {
        if(!req.session.login){
            res.redirect('/login');
        }
        try {
            await studentDatamapper.insert(req.body);
            res.redirect(`/promos/${req.body.promo_id}`);
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    },

};
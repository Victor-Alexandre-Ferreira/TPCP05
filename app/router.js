const express = require('express');
const mainController = require('./controllers/mainController');
const promoController = require('./controllers/promoController');
const studentController = require('./controllers/studentController');
const adminController = require('./controllers/adminController');
const adminChecker = require('./middlewares/adminChecker');
const router = express.Router();


router.get('/', mainController.homePage);

router.get('/promos', promoController.promoList);

router.get('/promos/:id', promoController.promoDetails);

router.get('/promos/:id/students', studentController.studentList);

router.get('/students/:id', studentController.studentDetails);

router.get('/admin/student/add', adminChecker, adminController.showStudentForm);
router.post('/admin/student/add', adminChecker, adminController.addStudent);

router.get('/login', mainController.showLoginPage);
router.post('/login', mainController.login);

router.get('/logout', mainController.logout);

//! A LA FIN de mes routes, on peut ajouter un middleware qui va se charger d'intercepter, comme si c'était un gardien de but la requête de l'utilisateur sans condition route.
// Cela permet de personnaliser la page 404, une route qui n'existe pas, qui n'a été déclaré précedemment.

router.use(mainController.error404);

module.exports = router;
const res = require("express/lib/response");

const mainController = {
    // Dans tout les cas on utilisera toujours les function non fléchés en tant que méthode d'un objet
    /*
    homePage: function(_, res) {
        res.render('home');
    }
    */
    // On peut déclarer également une fonction non fléché de façon nommé de cette façon, cela aura pour effet de stocker cette function nommé dans une propriété portant le même nom
    homePage(_, res) {
        res.render('home');
    },

    error404(req, res) {
        res.status(404).render('error404', { url: req.url });
    },

    showLoginPage(_, res) {
        res.render('login');
    },

    login(req, res) {
        if (['mickey', 'donald', 'pluto'].includes(req.body.login)) {
            // Il faut que je stocke en session comme quoi il est bien connecté
            // On ajoute des informations dans le coffre fort de session
            req.session.login = req.body.login;

            // Ensuite je le redirige vers la page d'accueil
            res.redirect('/');
        } else {
            res.render('login', { error: 'login invalide' });
        }
    },

    logout(req, res) {
        // Solution possible mais un peu trop radical elle va supprimer la variable de session login, mais aussi toutes les autres qui auraient pu être présente en session. Ce n'est pas forcement ce qui était attendu
        //req.session.destroy();

        // Beacoup mieux. On se concentre sur la variable qui determine si une personne est logué ou non. La v aleur sera falsy, donc la condition d'affichage ne sera plus validé.
        // Par contre on conserve une propriété qui ne nous sert plus a rien.
        // Alors c'est pas qu'on est radin en mémoire, mais si jamais il y avait, pour on ne sait quel raison, s'il ya vais plusieurs propriété qui aurait qui prendrait beacoup de place, cela serait mieux de les supprimer completement.
        //req.session.login = '';//null //undefined

        // La plus optimale est la suppression pure et simple de la propriété
        delete req.session.login;

        res.redirect('/');
    }
};

module.exports = mainController;
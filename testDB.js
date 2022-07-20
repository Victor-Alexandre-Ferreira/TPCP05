require('dotenv').config();

const promoDatamapper = require('./app/datamappers/promoDatamapper');
const studentDatamapper = require('./app/datamappers/studentDatamapper');

(async () => {
    const inserted = await studentDatamapper.insert({
        first_name: 'Yann',
        last_name: 'Guilloux',
        github_username: 'yannOclock',
        profile_picture_url: 'http://github.com/yannOclock.png',
        promo_id: 386
    });
    if(inserted){
        console.log('insertion réussi');
    }else{
        console.log('insertion échoué');
    }
})();
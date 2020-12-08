const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/',verify, (req,res) => {
    res.json({
        posts: {
            title: 'Some Posts There',
            description: 'Only got here with token access'
        }
    });
    // gest user id  = res.send(req.user);
});

module.exports = router;
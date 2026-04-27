const router = require('express').Router();
const registerUser = require('../controllers/user.controller.js');
const { upload } = require('../middlewares/multer.middleware.js');

router.route('/register').post(
  upload.fields([
    { name: 'Avtar', maxcount: 1 },
    {
      name: 'CoverImage',
      maxcount: 1,
    },
  ]),
  registerUser
);

module.exports = router;

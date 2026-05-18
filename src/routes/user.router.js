const router = require('express').Router();
const { registerUser, loginUser , logoutUser, refreshAccessToken} = require('../controllers/user.controller.js');
const authMiddleware = require('../middlewares/Auth.middleware.js');
const { upload } = require('../middlewares/multer.middleware.js');


router.route('/register').post(
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    {
      name: 'coverImage',
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route('/login').post(upload.none(), loginUser)

router.route('/logout').post(authMiddleware,logoutUser)
router.route('/refresh-token').post(refreshAccessToken)


module.exports = router;

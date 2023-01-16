const express = require('express');
const router = express.Router();
const User=require('./user.model');
const auth=require('../../tools/auth')

/* GET users listing. */
router.get('/',async function(req, res, next) {
  try{
    if(req.cookies?.role!=='admin'){
      throw{
        status: 403,
        error: new Error('Not Admin!')
      }
    }
    const users=await User.find()
    res.json(users)
  }catch(error){
    next(error)
  }
});

router.get('/me',async function(req,res,next){
  try {
    if(!req.cookies?.id){
      throw {
        status: 401,
        error: new Error('Unauthorized!')
      }
    }
    const user=await User.findById(req.cookies.id);
    res.json(user)
  } catch (error) {
    next(error)
  }
})
module.exports = router;

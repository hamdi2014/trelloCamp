const express = require('express');
const router = express.Router();
const Task=require('./task.model');
const auth=require('../../tools/auth')

/* GET users listing. */
router.get('/',async function(req, res, next) {
  try{
    if(!req.cookies.role){
      throw{
        status: 401,
        error: new Error('Unauthorized!')
      }
    }
    if(req.cookies.role==='admin'){
      const tasks=await Task.find();
      res.json(tasks);
    }else{
      const tasks=await Task.find({user:req.cookies.id});
      res.json(tasks)
    }
  }catch(error){
    next(error)
  }
});

router.post('/create',async(req,res,next)=>{
  try {
    if(!req.body.title || !req.body.status){
      throw{
        status: 400,
        error: new Error(`Missing required fields:{title,status}!`)
      }
    }
  
    const task=await new Task({
      title:req.body.title,
      description:req.body?.description,
      user:req.cookies?.id,
      status:req.body.status
    }).save()
  
    res.json(task)
  } catch (error) {
    next(error)
  }
})
module.exports = router;

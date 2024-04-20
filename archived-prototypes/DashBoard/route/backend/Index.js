let express = require('express')
let router = express()

router.get('/',(req,res)=>{
    res.render('../views/backend/index')
})


module.exports=router
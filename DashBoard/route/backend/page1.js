let express = require('express')
let router = express()

router.get('/',(req,res)=>{
    res.render('../views/backend/page1')
})


module.exports=router
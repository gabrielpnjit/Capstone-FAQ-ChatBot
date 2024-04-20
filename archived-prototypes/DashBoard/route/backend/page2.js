let express = require('express')
let router = express()

router.get('/',(req,res)=>{
    res.render('../views/backend/page2')
})


module.exports=router
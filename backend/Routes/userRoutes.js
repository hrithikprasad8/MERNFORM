const express = require('express')
const router = express.Router()
const {registerData,updateData, deleteData} = require('../Controllers/userControllers')

router.post('/save',registerData)
router.put('/update',updateData)
router.delete('/delete',deleteData)

module.exports = router
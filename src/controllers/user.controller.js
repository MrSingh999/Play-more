const asyncHandler = require("../utils/asyncHandler")

module.exports= registerUser = asyncHandler(async (req, res)=>{
    res.status(200).json({message : "User registered successfully"})
})

const asyncHandler = (requestHandler) => {
    
}

export {asyncHandler}


// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
        
//     } catch (error) {
//         await fn(req, res, next)
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.messgae
//         })
//     }
// }
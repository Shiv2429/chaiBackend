const asyncHandler = (requestHandler) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
}

export{asyncHandler}


// const asyncHandler = () => async(re, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err, code || 404).json({
//             success: false,
//             message: err.meassage
//         })
//     }
// }
const asyncHandler = (fn = async (req, rep, nxt) => {
  try {
   await fn(req, rep, nxt);
  } catch (error) {
    res.status(error.code || 500).json({
      sucess: false,
      message: error.message,
    });
  }
});

module.exports = asyncHandler();

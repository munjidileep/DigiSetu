import User from '../models/User.js';

export const requireReviewer = async (req, res, next) => {
  const userId = req.session?.user?.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in.'
    });
  }

  try {
    const reviewer = await User.findOne({ _id: userId, role: 'reviewer', status: 'active' }).lean();
    if (!reviewer) {
      return res.status(403).json({
        success: false,
        message: 'Reviewer access required.'
      });
    }

    req.reviewer = reviewer;
    return next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Reviewer access could not be verified.'
    });
  }
};

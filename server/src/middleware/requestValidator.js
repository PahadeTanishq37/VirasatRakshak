// Request Validation Helper Middleware

export const validateBody = (requiredFields = []) => {
  return (req, res, next) => {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid request body. JSON object expected.'
      });
    }

    const missingFields = [];
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required field(s): ${missingFields.join(', ')}`
      });
    }

    next();
  };
};

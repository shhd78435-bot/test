const validation = (schema) => {
    return async (req, res, next) => {
        const data = {
            ...req.body,
            ...req.params,
            ...req.query
        };
        const validationRes = await schema.safeParseAsync(data);
        if (!validationRes.success) {
            return res.status(422).json({
                validationError: JSON.parse(validationRes.error)
            });
        }
        next();
    };
};
export default validation;

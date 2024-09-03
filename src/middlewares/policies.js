export const executePolicies = (policies) => {
    return (req, res, next) => {
        if (policies.includes('PUBLIC')) return next();

        if (policies.includes('AUTHORIZED') && !req.user) {
            return res.status(401).send("UNAUTHORIZED");
        }

        if (req.user && policies.includes(req.user.role.toUpperCase())) {
            return next();
        }

        return res.status(403).send("FORBIDDEN");
    };
};
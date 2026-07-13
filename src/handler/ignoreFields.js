const ignoreFields = (req, res, next) => {
    delete req.body.isDeleted;
    delete req.body.tenantId;
    next();
}

export default ignoreFields;
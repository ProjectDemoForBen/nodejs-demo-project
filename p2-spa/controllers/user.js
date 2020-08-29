const User = require('../models/user')

exports.getStatus = (req, res, next) => {
    const {userId} = req.params;

    User.findByPk(userId)
        .then(user => {
            if (!user) {
                const err = new Error('User not found');
                err.statusCode = 400;
                throw err
            }
            return res.status(200).json({
                status: user.status,
            })
        })
        .catch(err => {
            next(err);
        })
}

exports.updateStatus = (req, res, next) => {
    const {userId} = req.params;
    if (parseInt(userId) !== req.user.id) {
        const err = new Error('User not authorized');
        err.statusCode = 401;
        throw err
    }

    const {status} = req.body;

    req.user.status = status;
    req.user
        .save()
        .then(result => {
            return res.status(200).json({
                message: 'Status updated'
            })
        })
        .catch(err => {
            next(err);
        })
}

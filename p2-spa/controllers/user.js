const User = require('../models/user')

exports.getStatus = async (req, res, next) => {
    const {userId} = req.params;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            const err = new Error('User not found');
            err.statusCode = 400;
            throw err
        }
        return res.status(200).json({
            status: user.status,
        })
    } catch (err) {
        return next(err);
    }
}

exports.updateStatus = async (req, res, next) => {
    const {userId} = req.params;
    if (parseInt(userId) !== req.user.id) {
        const err = new Error('User not authorized');
        err.statusCode = 401;
        return next(err);
    }

    const {status} = req.body;

    req.user.status = status;
    try {
        await req.user.save()
        return res.status(200).json({
            message: 'Status updated'
        })
    } catch (err) {
        return next(err);
    }

}

const {expect} = require('chai');
const sinon = require('sinon');
const decache = require('decache');

describe('Auth Controller - Login', function () {
    let AuthController = null;
    let User = null;

    before(() => {
        sinon.stub(process,'env').value({
            "DB_DIALECT": "mysql",
        });
        decache('../controllers/auth');
        decache('../models/user');
        AuthController = require('../controllers/auth');
        User = require('../models/user');
    })

    it('should throw error when user not found', async function () {

        const req = {
            body: {
                email: 'email',
                password: 'password'
            }
        }
        let error = null;
        const next = (err) => {
            error = err;
        }

        sinon.stub(User, 'findOne');
        User.findOne.returns(null);
        await AuthController.login(req, {}, next);
        expect(error).to.have.property('statusCode', 400);
        expect(error).to.have.property('message', 'Invalid Email or Password');
        User.findOne.restore();
    });

    after(()=> {
    })
})


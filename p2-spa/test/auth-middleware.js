const jwt = require('jsonwebtoken');
const {expect} = require('chai');
const sinon = require('sinon');

const authMiddleware = require('../middlewares/auth');

describe('Auth Middleware', function () {
    it('should throw error if auth header is one string', function () {
        const req = {
            get: function () {
                return "bearerzzz";
            }
        }
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
    })

    it('should have userId', function () {
        const req = {
            header: function () {
                return 'Bearer zzzzz';
            }
        }
        sinon.stub(jwt, 'verify');
        jwt.verify.returns({id: 123456});
        authMiddleware(req, {}, () => {});
        expect(req).to.have.property('userId', 123456);
        expect(jwt.verify.called).to.be.true;  // if method has been called
        jwt.verify.restore();
    })
})


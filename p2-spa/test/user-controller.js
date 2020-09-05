const {expect} = require('chai');
const sinon = require('sinon');
const decache = require('decache');

describe('User Controller', function () {
    let UserController = null;
    let User = null;
    let Post = null;
    let testUser = null;

    before((done) => {
        sinon.stub(process, 'env').value({
            "PORT": 8081,
            "DB_NAME": "messages-test",
            "DB_USER": "root",
            "DB_PASSWORD": "1234",
            "DB_DIALECT": "mysql",
            "DB_HOST": "localhost",
            "DB_PORT": 3316
        });

        decache('../controllers/user');
        decache('../models/user');
        decache('../models/post');

        UserController = require('../controllers/user');
        User = require('../models/user');
        Post = require('../models/post');

        User.create({
            name: 'test',
            email: 'test@test.com',
            password: 'test',
        }).then(user => {
            testUser = user;
            done()
        }).catch(e => {
            console.log(e);
            done();
        })
    })

    it('should get default user status', async function () {
        const req = {
            params: {
                userId: testUser.id,
            }
        }
        const res = {
            result: null,
            status: function () {
                return this;
            },
            json: function ({status}) {
                this.result = status;
            }
        }

        let error = null;
        const next = (err) => {
            error = err;
        }

        await UserController.getStatus(req, res, next);
        expect(res.result).is.equal('Hey there! I am using this thing.');
    });

    after((done)=> {
        Post.destroy({
            where: {}
        }).then( () => {
            return User.destroy({
                where: {}
            })
        }).then(() => {
            done();
        }).catch(e => {
            console.log(e);
            done();
        })
    })
})


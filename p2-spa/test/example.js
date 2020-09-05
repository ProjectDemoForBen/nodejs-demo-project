const {expect} = require('chai');

// function defines test code (controller, ...)
it('should add numbers correctly', function () {
    const n1 = 2;
    const n2 = 5;

    const result = n1 + n2;
    const expected = 7;

    expect(result).to.equal(expected);
})
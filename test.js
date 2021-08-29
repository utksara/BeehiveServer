var assert = require('assert');

// const shapes = require('./lib/shapes.js')
// const beehive = require('./lib/beehive.js');
// const { SIGUSR2 } = require('constants');

// describe('Beehive functions', function() {
//     describe('copySystem()', function() {
//         it('should create clone of a system', function() {
//             s1 = {
//                 shape : shapes.line()
//             }
            
//             s2 = beehive.copySystem(s1)
            
//             s2.shape.center = "0,0"
//         assert(s1.shape.center, "500,500");
//         });
//     });
// });

describe('Hexdec numbers', function() {
    describe('hexdec()', function() {
        it('should create 6 digit hexdec num', function() {
            const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random()* 16).toString(16)).join('');
            let newnum = genRanHex(6); 
            console.log(newnum);
        assert(newnum, "000000");
        });
    });
});





// console.log(s1.shape.center)
// console.log(s2.shape.center)

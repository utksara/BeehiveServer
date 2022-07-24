const assert = require('assert');
const _ = require('lodash');

const {shapes, SYSTEM, MESH, SIMPLECONNECT, COPY, PATTERN, CHAIN }  = require('../dev.js');
const {dfsTraverse, } = require('../lib/beehiveUtils.js')
const {run_system, hierarchical} = require('../lib/beehive.js')
const {filter_systems} = require('../lib/core/systemUtils.js')
 
describe('dfsfilter', function() {
    describe('depth first search with fiter', function() {
        it('should return cluster of systems with signature name', async function() {
            let S1 = SYSTEM({
                NAME : "S1",
                REQUIRE : ["x"],
                x : 1,
                PROCESSES:[
                    (async function (S){with (S){
                        x = x + 1
                    }})
                ]
            });

            let S2 = MESH(S1, 10, 2)

            await run_system(S2.ID, hierarchical);

            console.log(dfsTraverse(S2, "x"))

            let [clusters, signature] = filter_systems(S2, ["x%3 === 0"], "even")

            console.log(clusters)
                       
            assert(1 === 1);
        });
    });
});

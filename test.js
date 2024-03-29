const assert = require('assert');
const _ = require('lodash');

const {shapes,reset, SYSTEM, SIMPLECONNECT, CHAIN, MESH, CONNECTIONS, COPY, PATTERN, bfsTraverse, VISOBJECT}  = require('./dev.js');
const {_push_sys, _search_by, run_system, RUNSIMULATION} = require('./lib/beehive.js')
const {register} = require('./lib/sendingData.js');
const {register_3} = require('./lib/visualization.js');
const {dfsTraverse, execution_order, sys_by_id} = require('./lib/beehiveUtils');

describe('Beehive functions', function() {
    describe('copy system', function() {
        it('should create clone of a system', function() {
            reset()
            let s1 = SYSTEM({
                "property" : 1,
                NAME : "s1",
            });
            let s2 = COPY(s1)
            assert(s2.property === s1.property, true);
            s2.NAME = "s2"
            assert(s2.NAME === "s2", true);
            assert(s1.NAME === "s1", true);
        });
    });

    describe('chain only', function() {
        it('check order of execution for SINGLE ELEMENT CHAINS', async function() {
            reset()
            let s1 = SYSTEM({NAME:"s1"});
            let s0 = CHAIN(s1, 4);

            let systemOrder = dfsTraverse(s0, "NAME")
            const orderShouldBe = ["s1", "s1", "s1", "s1"];
            console.log(" orderShouldBe ", orderShouldBe);
            console.log(" systemOrder ", systemOrder);
            assert(JSON.stringify(orderShouldBe) === JSON.stringify(systemOrder), true);
        });
    });

    describe('chain shelves', function() {
        it('check order of execution for CHAINED SHELVES', async function() {
            reset()
            let s0 = SYSTEM({NAME:"s0"});
            let s1 = SYSTEM({NAME:"s1"});
            let s2 = SYSTEM({NAME:"s2"});
            let s3 = SYSTEM({NAME:"s3"});
            SIMPLECONNECT (s1) (s2, s3);    
            SIMPLECONNECT (s0) (CHAIN(s1, 3));
            // SIMPLECONNECT (s2, s3) (s4)
            // SIMPLECONNECT (s4) (s5, s6)

            let systemOrder = dfsTraverse(s0, "NAME")
            let orderShouldBe = ["s0", "s1", "s2", "s1", "s2", "s1", "s2", "s3", "s3", "s3"];
            console.log(" orderShouldBe ", orderShouldBe);
            console.log(" systemOrder ", systemOrder);
            assert(JSON.stringify(orderShouldBe) === JSON.stringify(systemOrder), true);         
        });
    });

    describe('complex network', function() {
        it('check order of execution for a complex network', async function() {
            reset()
            let t0 = SYSTEM({NAME:"t0"});
            let t1 = SYSTEM({NAME:"t1"});
            let t2 = SYSTEM({NAME:"t2"});
            let t3 = SYSTEM({NAME:"t3"});
            let t4 = SYSTEM({NAME:"t4"});
            let t5 = SYSTEM({NAME:"t5"});
            let t6 = SYSTEM({NAME:"t6"});

            await CONNECTIONS(()=>{
                SIMPLECONNECT (t0) (t1)
                SIMPLECONNECT (t1) (t2, t3, t4)
                SIMPLECONNECT (t4) (t5)
                SIMPLECONNECT (t4) (t3)

            }, t0);

            const systemOrder = execution_order;
            console.log(systemOrder)
            const systemIDOrder = _.map(systemOrder, function (x) {
                return x.NAME;
            });
            const orderShouldBe = ["t0", "t1", "t2", "t4", "t5", "t3"];
            console.log(orderShouldBe);
            console.log(systemIDOrder);
            assert(JSON.stringify(orderShouldBe) === JSON.stringify(systemIDOrder), true);
        });
    });

    describe('pushsys', function() {
        it('push system forward', async function() {
            reset()
            let s0 = SYSTEM({NAME:"s0"});
            let s1 = SYSTEM({NAME:"s1"});
            let s2 = SYSTEM({NAME:"s2"});
            let s3 = SYSTEM({NAME:"s3"});

            SIMPLECONNECT (s0) (s1, s2);
            _push_sys ('forward')(s3) (s0);

            let traversal = dfsTraverse(s0, "NAME");
            let orderShouldBe = ["s0", "s1", "s3", "s2"];
            console.log(orderShouldBe);
            console.log(traversal)
            assert(JSON.stringify(orderShouldBe) === JSON.stringify(traversal), true);
        });
    });

    describe('endpoints', function() {
        it('find endpoint', async function() {
            reset()
            let s0 = SYSTEM({NAME:"s0"});
            let s1 = SYSTEM({NAME:"s1"});
            let s2 = SYSTEM({NAME:"s2"});
            let s3 = SYSTEM({NAME:"s3"});
            let s4 = SYSTEM({NAME:"s4"})

            SIMPLECONNECT (s0) (s1, s2);

            let endpoints = _.reduce(s0.endpoints, function (result, value) {
                result.push(sys_by_id[value].NAME)
                return result
            }, []);

            let endpointsShouldBe = ["s1", "s2"];
            console.log(endpointsShouldBe);
            console.log(endpoints)
            assert(JSON.stringify(endpoints) === JSON.stringify(endpointsShouldBe), true);

            _push_sys ('forward')(s3) (s0);
            
            endpoints = _.reduce(s0.endpoints, function (result, value) {
                result.push(sys_by_id[value].NAME)
                return result
            }, []);

            endpointsShouldBe = ["s3"];
            console.log(endpointsShouldBe);
            console.log(endpoints)
            assert(JSON.stringify(endpoints) === JSON.stringify(endpointsShouldBe), true);
            
            _push_sys ('forward') (s4) (s0)

            endpoints = _.reduce(s0.endpoints, function (result, value) {
                result.push(sys_by_id[value].NAME)
                return result
            }, []);

            endpointsShouldBe = ["s4"];
            console.log(endpointsShouldBe);
            console.log(endpoints)
            assert(JSON.stringify(endpoints) === JSON.stringify(endpointsShouldBe), true);
        });
    });

    describe('mesh', function() {
        it('creates mesh', async function() {
            reset()
            let s0 = SYSTEM({NAME:"s0"});

            console.log(s0)
            let smesh = MESH(s0, 3, 2);
            const dfsTraverse_should_be = [ '00001', '00002', '00003', '00005', '00007', '00004', '00006' ];
            const dfsTraverse_is = dfsTraverse(smesh);
            console.log(dfsTraverse_should_be);
            console.log(dfsTraverse_is); 
            assert(JSON.stringify(dfsTraverse_is) === JSON.stringify(dfsTraverse_should_be), true);
        });

    });

});

describe('Beehive functions', function() {
    describe('register', function() {
        it('checks registeration', async function() {
            reset()
            let S = SYSTEM({
                NAME : "S",
                Quantity1 : 200,
                Quantity2 : 0,
                x : 0,
                y :0,
                VISUALIZE : [
                    VISOBJECT({
                        REPRESENTS : "Quantity1",
                        GEOMETRY : shapes.point,
                        POSITION : ["x", "y"],
                        minval : 200,
                        maxval : 220,
                    }),
                    VISOBJECT({
                        REPRESENTS : "Quantity2",
                        GEOMETRY : shapes.point,
                        POSITION : ["x", "y"],
                        minval : 0,
                        maxval : 10,
                    })
                ],
            });
            const expectedJsObject = 
            [
                {
                  represent: 'Quantity1',
                  shape_type: 'point',
                  center: '0,0',
                  quantity: '200',
                  length: '1'
                },
                {
                  represent: 'Quantity2',
                  shape_type: 'point',
                  center: '0,0',
                  quantity: '0',
                  length: '1'
                }
              ];
              
            let arr = [];
            register_3 (S, arr);
            console.log(arr);
            console.log(expectedJsObject);
            assert(JSON.stringify(arr) === JSON.stringify(expectedJsObject), true);
        }); 
    });

    describe('runtime', function() {
        it('checks runtime', async function() {
            reset()
            let control_vol = SYSTEM ({
                NAME : "control_vol",
                Pressure : 200,
                x : 0,
                y :0,
                VISUALIZE : [
                    VISOBJECT({
                        REPRESENTS : "Pressure",
                        GEOMETRY : shapes.point,
                        POSITION : ["x", "y"],
                        minval : 0,
                        maxval : 10,
                    })
                ],
                REQUIRE : ["Pressure"],    
                PROCESSES : [
                    (async function (S){with (S){
                        Pressure = 0.95 * Pressure
                    }})
                ],
            });
            
            let Sparent = SYSTEM();
            
            let Nchain = 10;
            let Nshelf = 10;
            let N = 3;
            let PressureGen =(N)=> {
                Pressurearray = []
                for (let n = 0; n<N; n++){
                    Pressurearray.push(200);
                }
                return Pressurearray;
            }
            // let Schained = CHAIN(control_vol, N);
            // SIMPLECONNECT (Sparent) (STACK(Schained, N, { Pressure : PressureGen(Nshelf) }));
            SIMPLECONNECT (Sparent) (MESH(control_vol, N, N))

            simulation_to_run = {
                main : ()=>{},
                Sparent :Sparent
            }
            await RUNSIMULATION(simulation_to_run);
            
            assert(1 === 1, true);

        });
    });

    describe('search', function() {
        it('checks search by', async function() {
            reset()
            let Sparent = SYSTEM();

            let S1= SYSTEM ({
                NAME : "S1",
            });

            let S2 = SYSTEM ({
                NAME : "S2",
            });

            let S3 = SYSTEM ({
                NAME : "S3",
            });

            let S4 = SYSTEM ({
                NAME : "S4",
            });

            let S5 = SYSTEM ({
                NAME : "S5",
            });

            SIMPLECONNECT (Sparent) (S1)
            SIMPLECONNECT (S1) (S2, S3)
            SIMPLECONNECT (S2) (S3)
            SIMPLECONNECT (S3) (S5)
            SIMPLECONNECT (S2) (S4)
            SIMPLECONNECT (S4) (S5)

            let result = _search_by(Sparent, 'NAME', ['S3'])
            console.log(result)
            assert(result['S3'] === '00003', true);
            // assert(1 === 1, true);
        });
    });

    describe('pattern', function() {
        it('checks pattern formation', async function() {
            reset()
            let Sparent = SYSTEM();

            let S1= SYSTEM ({
                NAME : "S1",
            });

            let S2 = SYSTEM ({
                NAME : "S2",
            });

            let S3 = SYSTEM ({
                NAME : "S3",
            });

            let S4 = SYSTEM ({
                NAME : "S4",
            });

            SIMPLECONNECT (S1) (S2, S3)
            SIMPLECONNECT (S2) (S3, S4)
            SIMPLECONNECT (S3) (S4)
            let SS = PATTERN(S1, {'S1' : 'S4'}, 3)
            bfsTraverse(SS)
            assert(1 === 1, true);
        });
    });

    describe('second order diff eqn', function() {
        it('checks second order diff eqn', async function() {
            reset()
            let Sparent = SYSTEM();

            let S1= SYSTEM ({
                NAME : "S1",
            });

            let S2 = SYSTEM ({
                NAME : "S2",
            });

            let S3 = SYSTEM ({
                NAME : "S3",
            });

            SIMPLECONNECT (S1) (S2, S3)
            SIMPLECONNECT (S2) (S3)
            let SS = PATTERN(S1, {'S2' : 'S3', 'S1' : 'S2'}, 20)
            bfsTraverse(SS)
            assert(1 === 1, true);
        });
    });
});

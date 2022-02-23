# Beehive

Beehive is a web-based interface for modelling and simulation with utility to provide a custom visualistion. Using Beehive, you can design any system, discrete as well as continous you want to simulate. 

## Examples

Just see for yourself how it looks :)

- [Simple second order differenttial equation](http://ec2-18-234-227-168.compute-1.amazonaws.com:3000/second-order-ode)
- [Laplace equation](http://ec2-18-234-227-168.compute-1.amazonaws.com:3000/simple-laplace)

## How it works

A lot of things being done in Beehive is very similar to GraphLab( an opensource machine learning module). In GraphLab, the machine learning problem has been broken down into MRF (Markov Random Fields) and processed in form of Loopy Belief Propogation. There are user definedupdate Function is analogous to the Map in MapReduce, but unlike in MapReduce, update functions are are able to process shared parameters as well. There is a shared data table(SDT) whcih stores the blocks of data in the graph ni a key value pair. More on GraphLab can be found at 

- [GraphLab](https://arxiv.org/ftp/arxiv/papers/1408/1408.2041.pdf)

In beehive, the user is able to design the structure of the graph and define properties of each node along with its local paramters, shared parameters and "processes". The nodes are named as SYSTEM and multiple insrtances can be created of a given SYSTEM with each of its properties replicated. The processes in beehive are analogius to update functions in graphlab and can process local parameters as well as shared parameters. Similarly like SDT, all the nodal data are directly stored as key value pair with key as "ID" of a system and value as the js object containing the information of a system instance.

Inspiration of the name **Beehive** is from the idea of the complex network in which honeybees in a beehive interact. The key idea behind the beehive is to design any simulation via architecture of a graphical network.

### Core components

1. SYSTEM : object

    System is a basic unit of any beehive simulation. It is essentialy an object which is collection of all the details about the operations to be performed simulation

    >Example: While simulation flow in a pipe, a cylindrical element is a system

    ```
    let S1 = SYSTEM ();
    ```

2. VARIABLES AND CONSTANTS : object, variables

    Every simulation has numerical/logical quantities that are being processed and changed (like pressure, velocity, population etc), and quantities used as constant parameters (graviational constant, reaction rate constant etc). All these are also defined in a Beehive system.

    > Example: In the above example, Pressure, velocity are the variables and Viscousity can be a variavle as well as a constant.

    ```
    let S1 = SYSTEM ({
            velocity : 10
            pressure : 200, 
            pressure_drop_const : 0,
            viscosity : 10,
            del_L = 0.1,
            Area : 0.1,
            flow_rate : 1,
        });
    ```

    **Core parameters in a SYSTEM**

    Some of the paramters are defined for all the systems by default, whcih are essesntial for running beehive situation and hence are the keywords (i.e no other variable/paramters should be named or used as these). The list of pre-defined parameters are
    
    - ID
    - NAME
    - PROCESSES
    - VISUALIZATION

    Details of these pre-defined parameters are discussed later



3. PROCESS : function

    Any calculation, any process occuring inside a system is a process

    > Example: Pressure drop and velocity gradient are proocesses of the cylindrical element in our previous example

```
    let Pressure_drop_const_calcuation  = function () {with (S){
        pressure_drop_const  = 8 * viscosity * del_l * flow_rate / (Area*Area)
    }}

    let Pressure_drop  = function () {with (S){
        pressure = pressure - pressure_drop_const 
    }}
```


Finally, here is an example of a system written as a javascript object

```
    let Pressure_drop_const_calcuation  = function () {with (S){
        pressure_drop_const  = 8 * viscosity * del_l * flow_rate / (Area*Area)
    }}

    let Pressure_drop  = function () {with (S){
        pressure = pressure - pressure_drop_const 
    }}

    let S1 = SYSTEM ({
        velocity : 10
        pressure : 200, 
        pressure_drop_const : 0,
        viscosity : 10,
        del_L = 0.1,
        Area : 0.1,
        flow_rate : 1,

        PROCESSES : [
            Pressure_drop,
        ],
    });
```

###  Design of the systems network

So far we have just specified properties of our system, but we nowhere have mentioned how the processing of the system will start. Also we have just specified a single system. A real word scenario we have interconnection of several system. Taking the analogy of beehive, we have just specified what are the bee types (worked bee, fighter bee, queen bee) and their function, but we also have to specify how these bees interact with each other to run a beehive

We require a new bunch of functions for network architechture. We will go through each function step-by-step.

1. SIMPLECONNECT (pareent_system : SYSTEM)(child_system : SYSTEM) : None

    This function establishes a simple directed connection between two systems s1 and s2 passed an arguement. By simple we mean all variables in s2 which are also present in s1 will be updated to the values of s1.

    >Example:
    ```
    S1 = SYSTEM({
        Q1 : 10,
        Q1 : 20,
        PROCESSES : [p1, p2]
    })

    S2 = SYSTEM({
        Q1 : 20,
        Q3 : 30,
        PROCESSES : [p1, p2]
    })

    SIMPLECONNECT (S1) (S2)
    ```
    Above example forms connection S1--->S2
    On running simulation, value of Q1 will be changed from 20 to 10, as Q1 is present in both S1 and S2 and S1 is the parent system. The value of Q3 will be unaffected as it is not present in S1

2. CONNECT (parent_system : SYSTEM) (list_of_variables : varargs) (child_system : SYSTEM) : None

    This function is same as SIMPLECONNECT, except you can provide a list of variables shared across system you want to update from parent system than updating every single variable.
    If the middle arguement in blank, all the shared paramters are updated, just as in the case of SIMPLECONNECT

    >Example:

    ```
    let S1 = SYSTEM({
        Q1 : 10,
        Q2 : 20,
        Q3 : 30,
    })

    let S2 = SYSTEM({
        Q1 : 100,
        Q2 : 200,
        Q3 : 300,
    })

    CONNECT (S1 (Q1, Q2) (S2)
    ```

    In above example, we have connection S1--->S2 like the previous case, and we have shared quantities as Q1, Q2, Q3. But on running the program, it will only update Q1 and Q2 in the child system S2 from 100 to 10 and 200 to 20 respectively, as Q1 and Q2 are the only specified variables in the middle arguement

3. COPYSYSTEM (system_to_be_copied : SYSTEM, paramters_specification : jsonObject) : SYSTEM 

    This function duplicates a given system for every **varam** (from now on we will use varam as acronym for variables and paramters) except the one specified in the second arguement of parameters_specifaction

    >Example :

    ```
    let S1 = {
        NAME : "S1",
        Q : 10,
        R : 20,
    }

    let S2 = COPYSYSTEM(S1, {NAME : "S2"})

    //  the S2 will look like 
    // {
    //     NAME : "S2",
    //     Q : 10,
    //     R : 20,
    // }
    ```

    In the above example, everything except NAME is copied in S2


Now, so far whatever functions we have discussed, are sufficient to create any kind of SYSTEMS network, but we need more functions to create networks in an easier and efficient way, as real life simulations require very complex and large networks to work with, just like a beehive!

4. CHAIN (system : SYSTEM, number_of_systems_in_chain : Integer) : SYSTEM

    Creates identical copies of a system and sumpleconnect them in a sequentially, returning the first element of the chain. Remember that the connection occurs only between the copies of the object passed initially, and not the object itsef. This makes the object resuable in its original form.

    >Example

    ```
        let S1 = {
            NAME : "S1",
            Q : 10,
            R : 20,
        }
        let Schained = CHAIN(S, 4)
    ```
    Above code will form chain as shown below

    ![Chained system](https://github.com/utksara/cellmech_server/blob/main/images/chain.png?raw=true)


5. STACK (system : SYSTEM, number_of_systems_in_chain : Integer): SYSTEM

    The stack function allows you to 1) Process similar systems independently at once 2)
    Expand or split your system into smaller units. It does is by making identical copies of a system as done in chain but instead of lining them up, all copies are connected in parallel

    >Example
    ```
        let S1 = {
            NAME : "S1",
            Q : 10,
            R : 20,
        }
        let Sstacked = STACK(S, 4)
    ```
    ![Stacked system](https://github.com/utksara/cellmech_server/blob/main/images/stack.png?raw=true)

6. MESH (system : SYSTEM, M : Integer, N  : Integer, x_flow_parameters : Array[variables], y_flow_parameters : Array[variables])

    As the name suggest, this function create MxN mesh network of MxN identical copies of a system with given x flow and y flow paramters

    >Example
    ```
        let S1 = {
            NAME : "S1",
            Q : 10,
            R : 20,
        }
        let Smeshed = MESH(S1, 3, 3, [Q],[R])
    ```

    ![Mesh system](https://github.com/utksara/cellmech_server/blob/main/images/mesh.png?raw=true)

7. CHAIN + STACK

    >Example
    ```
        let S1 = {
            NAME : "S1",
            Q : 10,
            R : 20,
        }
        let S = CHAIN(MESH(S1, 2), 3))
    ```

    ![CHAIN + STACK](https://github.com/utksara/cellmech_server/blob/main/images/chainstack.png?raw=true)


8. CHAIN + MESH
    >Example
    ```
        let S1 = {
            NAME : "S1",
            Q : 10,
            R : 20,
        }
        let S = CHAIN(MESH(S1, 2), 3))
    ```
    ![STACK + CHAIN](https://github.com/utksara/cellmech_server/blob/main/images/stackchain.png?raw=true)

9. PATTERN (system : SYSTEM, relocationobejct : jsonObject, N : Integer) : SYSTEM

    Most complex recurring network cannot be designed by MESH, CHAIN or STACK. To design any kind of recurring network, PATTERN function is used.
    >Example
    ```
        let S1 = {
            NAME : "S1",
            Q0 : 10,
            Q1 : 20,
        }

        let S2 = {
            NAME : "S1",
            Q0 : 10,
            Q1 : 20,
        }

        let S3 = {
            NAME : "S1",
            Q0 : 10,
            Q1 : 20,
        }

        CONNECT (S1) ("Q0") (S2)
        CONNECT (S1) ("Q1") (S3)
        CONNECT (S2) ("Q0") (S3)
        let Spattern = PATTERN(S1, {'S1' : 'S2', 'S2' : 'S3'}, 3)
    ```

    By the second argument relocationobejct, what we provide is in the recurring pattern of a given unit via telling which subunit of given unit has to replace which subunit in next unit. In the given example, to make the recurring pattern of the unit in the first figure, S1 has to be replaced S2 and S3 has to be replaced by S2. 

    ![STACK + CHAIN](https://github.com/utksara/cellmech_server/blob/main/images/pattern.png?raw=true)
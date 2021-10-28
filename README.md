# Beehive

Beehive is a web-based interface for modelling and simulation with utility to provide a custom visualistion. Using Beehive, you can design any system, discrete as well as continous you want to simulate. 

## Examples

Just see for yourself how it looks :)

- Simple second order differenttial equation
- Laplace equation
- Simple plug flow reactor
- simple calculation of traction from a cell

## How it works

THere are three main concepts that are used in Beehive

- [Actor model](https://en.wikipedia.org/wiki/Actor_model)
- [Directed graphs](https://en.wikipedia.org/wiki/Directed_graph)
- [Dataflow programming](https://en.wikipedia.org/wiki/Dataflow_programming)

Inspiration of the name **Beehive** is from the idea of the complex network in which honeybees in a beehive interact. The key idea behind the beehive is to design any simulation via architecture of a graphical network.

### Core components

1. SYSTEM

    System is a basic unit of any beehive simulation. It is essentialy an object which is collection of all the details about the operations to be performed simulation

    >Example: While simulation flow in a pipe, a cylindrical element is a system

```
let S1 = SYSTEM ();
```

2. VARIABLES AND CONSTANTS

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


3. PROCESS

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

### Core components

So far we have just specified properties of our system, but we nowhere have mentioned how the processing of the system will start. Also we have just specified a single system. A real word scenario we have interconnection of several system. Taking the analogy of beehive, we have just specified what are the bee types (worked bee, fighter bee, queen bee) and their function, but we also have to specify how these bees interact with each other to run a beehive

For this purspose we have a function CONNECTSYSTEMS, where we speciffy all the connections and properties. And CONNECTSYSTEMS requires its own bunch of sub functions for network architechture. We will go through each function step-by-step


# OPC UA CAR SERVER with NodeOPCUA
A simple server that represents a car with the follow structure:

* Car (obj)
    * Speed (attr)
    * Accelerate (meth)
    * Stop (meth)
    * Engine (obj)
        * Temperature (attr)
        * Oxygen (attr)

![alt text](https://github.com/is3labengrd/opc-ua-car-server/blob/master/img/car_schema.png)
### Install from source

    $ git clone "https://github.com/is3labengrd/opc-ua-car-server"
    $ cd opc-ua-car-server
    $ npm install
    $ node car.js

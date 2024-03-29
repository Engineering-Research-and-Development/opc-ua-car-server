
# OPC UA CAR SERVER with NodeOPCUA
A simple server that represents a car with the follow structure:

* Car (obj)
    * Speed (attr)
    * Accelerate (meth)
    * Stop (meth)
    * Engine (obj)
        * Temperature (attr)
        * Oxygen (attr)
        * Pressures (attr)
    * Sensors
        * Any number of user-defined sensors

![Car Schema](https://github.com/Engineering-Research-and-Development/opc-ua-car-server/blob/master/img/car_schema.png)


### Install from source

    $ git clone "https://github.com/Engineering-Research-and-Development/opc-ua-car-server"
    $ cd opc-ua-car-server
    $ npm install --unsafe-perm
    $ node car.js

### Car model behavioural specs

| Motion Status | Engine | Acceleration | Oxigen | Temperature          | Pressures              | Speed |
| ------------- | ------------- | ------------- | ------------- |----------------------|------------------------| ------------- |
| Stopped | Off  | 0  | 0  | Environmental 20 °C  | [0,0,0]                | 0 |
| Stopped | On  | 0  | 5  | Tends to 80 °C    | Tends to [100,100,100] | 0                        |
| Accelerated | On  | > 0 | Varies with speed. When the acceleration increases an overshoot is triggered, otherwise if acceleration decreases an undershoot is triggered. | Tends to 80 °C     | Tends to [100,100,100] | Varies with acceleration |
| Constant | On | 0 | Constant | Tends to 80 °C     | Tends to [100,100,100] | Constant                 |
| Decelerated | On | < 0 | Varies with speed | Tends to 80 °C    | Tends to [100,100,100] | Varies with deceleration |
| In motion (Decelerated) | Off | 0 | 0 (Transmission Neutral / Engine Brake) | Tends to 20 °C    | Tends to [0,0,0]       | Tends to 0               |
| From decelerated to constant | Off -> On | 0 | Follows the current speed  | Tends to 80 °C    | Tends to [100,100,100]     | Constant               |

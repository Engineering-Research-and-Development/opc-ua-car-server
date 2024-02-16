# OPC UA CAR SERVER with NodeOPCUA

[![FIWARE IoT Agents](https://nexus.lab.fiware.org/repository/raw/public/badges/chapters/iot-agents.svg)](https://www.fiware.org/developers/catalogue/)
[![](https://nexus.lab.fiware.org/repository/raw/public/badges/stackoverflow/iot-agents.svg)](https://stackoverflow.com/questions/tagged/fiware+iot)

A simple [OPC-UA](https://opcfoundation.org/about/opc-technologies/opc-ua/) server that simulates a car with the following structure:

-   Car (object)
    -   Speed (attribute)
    -   Accelerate (method)
    -   Stop (method)
    -   Engine (object)
        -   Temperature (attribute)
        -   Oxygen (attribute)
        -   Pressures (attr)
    -   Sensors
        -   Any number of user-defined sensors

![Car Schema](https://github.com/Engineering-Research-and-Development/opc-ua-car-server/blob/master/img/car_schema.png)

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



## How to build an image

The [Dockerfile](https://github.com/Engineering-Research-and-Development/opc-ua-car-server/blob/master/docker/Dockerfile) associated with this image
can be used to build an image in several ways:

-   By default, the `Dockerfile` retrieves the **latest** version of the codebase direct from GitHub (the `build-arg` is
    optional):

```console
docker build -t opc-ua-car-server . --build-arg DOWNLOAD=latest
```

-   You can alter this to obtain the last **stable** release run this `Dockerfile` with the build argument
    `DOWNLOAD=stable`

```console
docker build -t opc-ua-car-server . --build-arg DOWNLOAD=stable
```

-   You can also download a specific release by running this `Dockerfile` with the build argument `DOWNLOAD=<version>`

```console
docker build -t opc-ua-car-server . --build-arg DOWNLOAD=1.3.4
```

## Building from your own fork

To download code from your own fork of the GitHub repository add the `GITHUB_ACCOUNT`, `GITHUB_REPOSITORY` and
`SOURCE_BRANCH` arguments (default `master`) to the `docker build` command.

```console
docker build -t opc-ua-car-server . \
    --build-arg GITHUB_ACCOUNT=<your account> \
    --build-arg GITHUB_REPOSITORY=<your repo> \
    --build-arg SOURCE_BRANCH=<your branch>
```

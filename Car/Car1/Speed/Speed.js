var opcua = require("node-opcua");

module.exports = {
  Speed: function(server, namespaceIndex, namespace /* addressSpace */, Car, SharedCarProperties, TimingSharedProperties) {
    var refreshIntervalId = 0;
    var oldAcceleration = 0;
    var oldSpeed = 0;

    function accelerate(accelerationStep) {
      SharedCarProperties.acceleration += accelerationStep;

      var Accelerate = SharedCarProperties.acceleration;

      SharedCarProperties.stopped = false;
      SharedCarProperties.oxigenBoost = 0;        

      // The overshoot is available only during acceleration

      // Uncomment rows (1) to disable undershoots for negative accelerations
      // (1) if(Accelerate > 0) {

      if((SharedCarProperties.speed != SharedCarProperties.MAX_SPEED || Accelerate < 0) && (SharedCarProperties.speed != 0 || Accelerate > 0)) {
        accelerationDelta = Accelerate - oldAcceleration;           
      
        if(accelerationDelta != 0) {
          if(accelerationDelta > 0) {                    
            SharedCarProperties.boostDirection = 1;
            SharedCarProperties.boost = 1; // triggering overshoot
          } else if(accelerationDelta < 0 && SharedCarProperties.speed != 0) {
            SharedCarProperties.boostDirection = -1;                 
            SharedCarProperties.boost = 1; // triggering undershoot  
          }
        }
      }
      // (1) }

      oldAcceleration = Accelerate;

      // Minimun acceleration delta time is 100ms
      if(TimingSharedProperties.accelerationDeltaTime == 0) {
          TimingSharedProperties.accelerationDeltaTime = 100;
      }       

      if (refreshIntervalId != 0){
          clearInterval(refreshIntervalId);
      };

      refreshIntervalId = setInterval(function(){
        // The second factor enables the change of the time resolution
        SharedCarProperties.speed += Accelerate * (TimingSharedProperties.accelerationDeltaTime / 1000);
        
        if(SharedCarProperties.speed >= SharedCarProperties.MAX_SPEED) {
          SharedCarProperties.speed = SharedCarProperties.MAX_SPEED;
        } else if(SharedCarProperties.speed <= 0) {
          SharedCarProperties.speed = 0;
        }

        // Update instantaneous acceleration
        SharedCarProperties.acceleration = SharedCarProperties.speed - oldSpeed;
        oldSpeed = SharedCarProperties.speed;
      }, TimingSharedProperties.accelerationDeltaTime);

      console.log("Accelerating... !");
    }

    /*
    var Speed = addressSpace.addObject({
    organizedBy: addressSpace.rootFolder.objects.cars,
    browseName: "Speed"
    });
    */

    namespace.addVariable({
      componentOf: Car,
      nodeId: "ns=" + namespaceIndex + ";s=Speed", // some opaque NodeId in namespace 4
      browseName: "Speed",
      dataType: "Double",
      value: {
        get: function () {
          return new opcua.Variant({dataType: opcua.DataType.Double, value: SharedCarProperties.speed});
        },
        set: function (dataValue) {
          SharedCarProperties.speed = dataValue.value;
          return new opcua.Variant({dataType: opcua.DataType.Double, value: SharedCarProperties.speed});
        }
      }
    });

    namespace.addVariable({
      componentOf: Car,
      nodeId: "ns=" + namespaceIndex + ";s=Acceleration", // some opaque NodeId in namespace 4
      browseName: "Acceleration",
      dataType: "Double",
      value: {
        get: function () {
          return new opcua.Variant({dataType: opcua.DataType.Double, value: SharedCarProperties.acceleration});
        }
      }
    });

    namespace.addVariable({
      componentOf: Car,
      nodeId: "ns=" + namespaceIndex + ";s=EngineStopped", // some opaque NodeId in namespace 4
      browseName: "EngineStopped",
      dataType: "Boolean",
      value: {
        get: function () {
          return new opcua.Variant({dataType: opcua.DataType.Boolean, value: SharedCarProperties.stopped});
        }
      }
    });

    // Start/Stop function
    var Stop = namespace.addMethod(Car,{
      nodeId: "ns=" + namespaceIndex + ";s=Stop", // some opaque NodeId in namespace 4
      browseName: "Stop"
    });

    Stop.bindMethod(function(inputArguments, context, callback) {
      // if (refreshIntervalId != 0) {
      //  clearInterval(refreshIntervalId);
      // };
      if(SharedCarProperties.stopped == false) {
        // Car isn't stopped, stop it
        accelerate(-(SharedCarProperties.acceleration + 5));
        SharedCarProperties.stopped = true;
      } else {
        // Car is stopped, start it
        SharedCarProperties.stopped = false;
        accelerate(-SharedCarProperties.acceleration);
      }

      console.log("CAR STOPPED!");

      var callMethodResult = {
        statusCode: opcua.StatusCodes.Good,
        outputArguments: [
          {
            dataType: opcua.DataType.String,
            arrayType: opcua.VariantArrayType.Array,
            value :["Stopped to " + SharedCarProperties.speed]
          }
        ]
      };
      callback(null, callMethodResult);
    });


    var Accelerate = namespace.addMethod(Car, {
      nodeId: "ns=" + namespaceIndex + ";s=Accelerate", // some opaque NodeId in namespace 4
      browseName: "Accelerate",

      inputArguments:  [
        {
          name:"Intensity",
          description: { text: "specifies the acceleration intensity [0 = slow ,10 = fast]" },
          dataType: opcua.DataType.Int32
        }
      ],

      outputArguments: [
        {
          name:"Accelerated",
          description:{ text: "Accelerated" },
          dataType: opcua.DataType.String,
          arrayType: opcua.VariantArrayType.Array,
          value :["Accelerated from " + SharedCarProperties.speed]
        }
      ]
    });


    Accelerate.bindMethod(function(inputArguments, context, callback) {

      accelerate(inputArguments[0].value);

      var callMethodResult = {
        statusCode: opcua.StatusCodes.Good,
        outputArguments:[ 
          {
            dataType: opcua.DataType.String,
            arrayType: opcua.VariantArrayType.Array,
            value :["Accelerated from "+SharedCarProperties.speed]
          }
        ]
      };
      
      callback(null,callMethodResult);
    });
  }
}

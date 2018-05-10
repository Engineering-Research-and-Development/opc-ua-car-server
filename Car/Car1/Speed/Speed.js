var opcua = require("node-opcua");

module.exports = {
  Speed: function(server,addressSpace,Car) {
    var refreshIntervalId=0;

    /*var Speed = addressSpace.addObject({
      organizedBy: addressSpace.rootFolder.objects.cars,
      browseName: "Speed"
    });
*/
    var carSpeed = 0;
    addressSpace.addVariable({
      componentOf: Car,
      nodeId: "ns=1;s=Speed", // some opaque NodeId in namespace 4
      browseName: "Speed",
      dataType: "Double",
      value: {
        get: function () {
          return new opcua.Variant({dataType: opcua.DataType.Double, value: carSpeed });
        }
      }
    });

    var Stop = addressSpace.addMethod(Car,{
      nodeId: "ns=1;s=Stop", // some opaque NodeId in namespace 4
      browseName: "Stop",

    });

    Stop.bindMethod(function(inputArguments,context,callback) {

      if (refreshIntervalId!=0){
        clearInterval(refreshIntervalId);
      };
    carSpeed = 0;

    console.log("CAR STOPPED!");

    var callMethodResult = {
            statusCode: opcua.StatusCodes.Good,
            outputArguments: [{
                     dataType: opcua.DataType.String,
           arrayType: opcua.VariantArrayType.Array,
          value :["Stopped to "+carSpeed]
            }]
        };
        callback(null,callMethodResult);
});


    var Accelerate = addressSpace.addMethod(Car,{
      nodeId: "ns=1;s=Accelerate", // some opaque NodeId in namespace 4
      browseName: "Accelerate",

      inputArguments:  [
        {
          name:"Intensity",
          description: { text: "specifies the acceleration intensity [0 = slow ,10 = fast]" },
          dataType: opcua.DataType.UInt32
        }
      ],






      outputArguments: [

        {
          name:"Accelerated",
          description:{ text: "Accelerated" },
          dataType: opcua.DataType.String,
           arrayType: opcua.VariantArrayType.Array,
          value :["Accelerated from "+carSpeed]
        }],
      });

      Accelerate.bindMethod(function(inputArguments,context,callback) {

        var Accelerate =  inputArguments[0].value;
		if (refreshIntervalId!=0){
       	 	clearInterval(refreshIntervalId);
     	 };

        refreshIntervalId = setInterval(function(){
          if(carSpeed<150){
            carSpeed+=1;
          };
          if(carSpeed>=150){
            carSpeed=150;
          };

        }, 5000/Accelerate);

        console.log("Accelerating... !");

        var callMethodResult = {
            statusCode: opcua.StatusCodes.Good,
            outputArguments: [{
                     dataType: opcua.DataType.String,
           arrayType: opcua.VariantArrayType.Array,
          value :["Accelerated from "+carSpeed]
            }]
        };
        callback(null,callMethodResult);
  });
}
}

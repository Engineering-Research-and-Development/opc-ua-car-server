var opcua = require("node-opcua");

module.exports = {
  Temperature_datagenerator: function(addressSpace, Engine) {

    var Temperature = 80;
    setInterval(function(){
      if(Temperature<100){
        Temperature+=1;
      };
      if(Temperature>=100){
        Temperature=80;
      };

    }, 10000);

    addressSpace.addVariable({
      componentOf: Engine,
      nodeId: "ns=1;s=Temperature", // some opaque NodeId in namespace 4
      browseName: "Temperature",
      dataType: "Double",
      value: {
        get: function () {
          return new opcua.Variant({dataType: opcua.DataType.Double, value: Temperature });
        }
      }
    });
  }
}

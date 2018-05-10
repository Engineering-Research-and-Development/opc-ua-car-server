var opcua = require("node-opcua");

module.exports = {
  Oxigen_datagenerator: function(addressSpace, Engine) {

    var Oxigen = 10;
    setInterval(function(){
      if(Oxigen<100){
        Oxigen+=0.1;
      };
      if(Oxigen>=100){
        Oxigen=10;
      };

    }, 10000);

    addressSpace.addVariable({
      componentOf: Engine,
      nodeId: "ns=1;s=Oxigen", // some opaque NodeId in namespace 4
      browseName: "Oxigen",
      dataType: "Double",
      value: {
        get: function () {
          return new opcua.Variant({dataType: opcua.DataType.Double, value: Oxigen });
        }
      }
    });
  }
}

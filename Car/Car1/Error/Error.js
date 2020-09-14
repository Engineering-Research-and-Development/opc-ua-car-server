var opcua = require("node-opcua");

module.exports = {
  Error: function(server, namespaceIndex, namespace /* addressSpace */, Car, SharedCarProperties, TimingSharedProperties) {
  
    // Error/Unknown test function
    var Error = namespace.addMethod(Car,{
      nodeId: "ns=" + namespaceIndex + ";s=Error", // some opaque NodeId in namespace 4
      browseName: "Error",
      inputArguments:  [
        {
          name:"Error Type",
          description: { text: "specifies existing ConstantStatusCode [Bad, Uncertain, BadInternalError, BadOutOfMemory, .. ]" },
          dataType: opcua.DataType.String
        }
      ],
      outputArguments: [
        {
            name:"Thrown",
            description:{ text: "Error has been thrown" },
            dataType: opcua.DataType.String,
            arrayType: opcua.VariantArrayType.Array,
            value :["Error has been thrown"]
        }
      ]
    });

    Error.bindMethod(function(inputArguments, context, callback) {
      console.log("Throwing error");
      var callMethodResult = {
        statusCode: inputArguments[0].value,
        outputArguments: [
          {
            dataType: opcua.DataType.String,
            arrayType: opcua.VariantArrayType.Array,
            value :[inputArguments[0].value + " thrown"]
          }
        ]
      };
      callback(null, callMethodResult);
    });
  }
}
var opcua = require("node-opcua");

module.exports = {
  Sensors: function(server, namespaceIndex, namespace /* addressSpace */, Car, sensors) {
    var refreshIntervalIds = {};
    var sensorStatus = {}; // for each sensor activated/deactivatedcon
    
    // Temporary map
    // TODO: Fix this asap

    var sensorNamesMap = ["DataBlocksGlobal_3_dbRfidCntr_3_ID1_3_xBusy", "DataBlocksGlobal_3_dbRfidCntr_3_ID1_3_xDone", "ene2_rfid1", "ene2_rfid2"];
    var seqNums = [1, 1, 1, 1];

    // Utility function
    function zeroPadding(value, numOfDigits, leading) {
		var padding = '';
		for(var i = 0 ; i < numOfDigits ; ++i) {
			padding += '0';
		}
	    	
		var valueString = value.toString();
		
		if(leading) {
			padded = padding + valueString;
			padded = padded.slice(-numOfDigits);
		} else {
			padded = valueString + padding;
			padded = padded.substr(0, numOfDigits);
		}
		return padded;
	}
	
    // Core functions
    function clearSensorInterval(sensorName) {
        if (refreshIntervalIds[sensorName] != 0) {
            clearInterval(refreshIntervalIds[sensorName]);
        };
    }
    
    function activateSensor(sensorName, sensorIndex) {
        sensorStatus[sensorName] = true;

        clearSensorInterval(sensorName);

        refreshIntervalIds[sensorName] = setInterval(function(){
            var now = new Date();
            
            var monthStr = zeroPadding(now.getMonth() + 1, 2, true);
            var dayStr = zeroPadding(now.getDate(), 2, true);
            
            var hoursStr = zeroPadding(now.getHours(), 2, true);
            var minutesStr = zeroPadding(now.getMinutes(), 2, true);
            var secondsStr = zeroPadding(now.getSeconds(), 2, true);
            var millisecondsStr = zeroPadding(now.getMilliseconds(), 3, true);
            
            var datetimeStr = "time=" + now.getFullYear() + "-" + monthStr + "-" + dayStr + "T" + hoursStr + ":" + minutesStr + ":" + secondsStr + "." + millisecondsStr + "Z"; 
            // sensors[sensorName]["logicStatus"] = !sensors[sensorName]["logicStatus"];      
            sensors[sensorName]["logicStatus"] = datetimeStr + " " + seqNums[sensorIndex];
            seqNums[sensorIndex] = seqNums[sensorIndex] + 1;      
            console.log("[CARMSG] " + sensorName + " " + datetimeStr + " " + sensors[sensorName]["logicStatus"].toString().toUpperCase());
        }, sensors[sensorName]["refreshPeriod"]);
    }

    function deactivateSensor(sensorName, sensorIndex) {
        sensorStatus[sensorName] = false;
        // sensors[sensorName]["logicStatus"] = false;
        sensors[sensorName]["logicStatus"] = "1970-01-01T00:00:00.000Z";
        seqNums[sensorIndex] = 1;
        clearSensorInterval(sensorName);
    }
	
    // Adding variables to addressSpace
    for (var sensorName in sensors) {
        if (sensors.hasOwnProperty(sensorName)) {
            var code = `
            namespace.addVariable({
                componentOf: Car,
                nodeId: "ns=` + namespaceIndex + `;s=`+sensorName+`",
                browseName: "`+sensorName+`",
                dataType: "String",
                value: {
                    get: function () {
                        return new opcua.Variant({dataType: opcua.DataType.String, value: sensors["`+sensorName+`"]["logicStatus"]});
                    }
                }
            });
            
			sensorStatus["` + sensorName + `"] = false;
            namespace.addVariable({
                componentOf: Car,
                nodeId: "ns=` + namespaceIndex + `;s=`+sensorName+`Status",
                browseName: "`+sensorName+`Status",
                dataType: "Boolean",
                value: {
                    get: function () {
                        return new opcua.Variant({dataType: opcua.DataType.Boolean, value: true}); // sensorStatus["`+sensorName+`"]
                    }
                }
            });
            refreshIntervalIds["` + sensorName + `"] = 0;
            `;
            eval(code);
        }
    }

    var ActivateSensor = namespace.addMethod(Car, {
        nodeId: "ns=" + namespaceIndex + ";s=ActivateSensor",
        browseName: "ActivateSensor",

        inputArguments:  [
            {
                // (*) name:"SensorName",
                name:"SensorIndex",
                description: { text: "specifies the sensor name" },
                dataType: opcua.DataType.Int32
            }
        ],

        outputArguments: [
        {
            name:"SensorActivated",
            description:{ text: "SensorActivated" },
            dataType: opcua.DataType.String,
            arrayType: opcua.VariantArrayType.Array,
            value :["Sensor activated"]
        }],
    });

    ActivateSensor.bindMethod(function(inputArguments, context, callback) {
        // (*) var sensorName = inputArguments[0].value;
        var sensorIndex = inputArguments[0].value;
        var sensorName = sensorNamesMap[sensorIndex];
        
        activateSensor(sensorName, sensorIndex);
		
        var callMethodResult = {
            statusCode: opcua.StatusCodes.Good,
            outputArguments: [{
                     dataType: opcua.DataType.String,
                     arrayType: opcua.VariantArrayType.Array,
                     // value :["Sensor activated " + sensorName]
					value :["Sensor activated " + sensorIndex]
            }]
        };
        callback(null, callMethodResult);
    });

    var DeactivateSensor = namespace.addMethod(Car, {
        nodeId: "ns=" + namespaceIndex + ";s=DeactivateSensor",
        browseName: "DeactivateSensor",

        inputArguments:  [
            {
                // (*) name:"SensorName",
                name:"SensorIndex",
                description: { text: "specifies the sensor name" },
                dataType: opcua.DataType.Int32
            }
        ],

        outputArguments: [
        {
            name:"SensorDeactivated",
            description:{ text: "SensorDeactivated" },
            dataType: opcua.DataType.String,
            arrayType: opcua.VariantArrayType.Array,
            value :["Sensor deactivated"]
        }],
    });

    DeactivateSensor.bindMethod(function(inputArguments, context, callback) {
        // (*) var sensorName = inputArguments[0].value;

		var sensorIndex = inputArguments[0].value;
        var sensorName = sensorNamesMap[sensorIndex];
        

        deactivateSensor(sensorName, sensorIndex);

        var callMethodResult = {
            statusCode: opcua.StatusCodes.Good,
            outputArguments: [{
                     dataType: opcua.DataType.String,
                     arrayType: opcua.VariantArrayType.Array,
                     value :["Sensor deactivated " + sensorName]
            }]
        };
        callback(null, callMethodResult);
    });

    var ToggleSensorActivation = namespace.addMethod(Car, {
        nodeId: "ns=" + namespaceIndex + ";s=ToggleSensorActivation",
        browseName: "ToggleSensorActivation",

        inputArguments:  [
            {
                // (*) name:"SensorName",
                name:"SensorIndex",
                description: { text: "specifies the sensor name" },
                dataType: opcua.DataType.Int32
            }
        ],

        outputArguments: [
        {
            name:"SensorActivationToggled",
            description:{ text: "SensorActivationToggled" },
            dataType: opcua.DataType.String,
            arrayType: opcua.VariantArrayType.Array,
            value :["Sensor activation toggled"]
        }],
    });

    ToggleSensorActivation.bindMethod(function(inputArguments, context, callback) {
        // (*) var sensorName = inputArguments[0].value;

		var sensorIndex = inputArguments[0].value;
        var sensorName = sensorNamesMap[sensorIndex];
        

        if(sensorStatus[sensorName] == false) {
            activateSensor(sensorName, sensorIndex);
        } else {
            deactivateSensor(sensorName, sensorIndex);
        }

        var callMethodResult = {
            statusCode: opcua.StatusCodes.Good,
            outputArguments: [{
                     dataType: opcua.DataType.String,
                     arrayType: opcua.VariantArrayType.Array,
                     value :["Sensor activation toggled " + sensorName]
            }]
        };
        callback(null, callMethodResult);
	});
  }
}

(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {		
		var cols = [{
			id: "data_type_code", 
			alias: "Data Type", 
			dataType: tableau.dataTypeEnum.string
		},{
			id: "time_slot_id", 
			alias: "Time Slot ID", 
			dataType: tableau.dataTypeEnum.float
		},{
			id: "category_code", 
			alias: "Category", 
			dataType: tableau.dataTypeEnum.string
		},{
			id: "cell_value", 
			alias: "Amount (2009 USD)", 
			dataType: tableau.dataTypeEnum.float
		},{
			id: "seasonally_adj", 
			alias: "Seasonally Adjusted", 
			dataType: tableau.dataTypeEnum.string
		},{
			id: "time", 
			alias: "Date", 
			dataType: tableau.dataTypeEnum.date
		}];
		
        var tableSchema = {
            id: "ConstructionSpending",
            alias: "Construction Spending",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://api.census.gov/data/timeseries/eits/vip?get=data_type_code,time_slot_id,category_code,cell_value,seasonally_adj&time=from+2002", function(resp) {
            // var feat = resp.features,
            var tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = resp.length; i < len; i++) {
                tableData.push({
					"data_type_code": resp[i].data_type_code,
					"time_slot_id": resp[i].time_slot_id,
					"category_code": resp[i].category_code,
					"cell_value": resp[i].cell_value,
					"seasonally_adj": resp[i].seasonally_adj,
					"time": resp[i].time
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "US Census Construction Spending"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();

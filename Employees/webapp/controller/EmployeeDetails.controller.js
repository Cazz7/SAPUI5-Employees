sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("logaligroup.Employees.controller.EmployeeDetails", {
        onInit: function () {

        },
        onCreateIncidence: function () {
            /*             var tableIncidence = this.getView().byId("tableIncidence");
                        var newIncidence = sap.ui.xmlfragment("logaligroup.Employees.fragment.NewIncidence", this);
                        //Controller>View>
                        var incidenceModel = this.getView().getModel("incidenceModel");
                        var odata = incidenceModel.getData();
                        var index = odata.length;
                        odata.push({index : index + 1});
                        incidenceModel.refresh();
                        newIncidence.bindElement("incidenceModel/" + index);
                        tableIncidence.addContent(newIncidence); */
            var tableInc = this.getView().byId("tableIncidence");
            var newIncidence = sap.ui.xmlfragment("logaligroup.Employees.fragment.NewIncidence", this);
            var incidenceModel = this.getView().getModel("incidenceModel");
            var arrayData = incidenceModel.getData();
            var index = arrayData.length;
            arrayData.push({ index: index + 1 });
            incidenceModel.refresh();
            newIncidence.bindElement("incidenceModel>/" + index);
            tableInc.addContent(newIncidence);
        }
    });
    
});
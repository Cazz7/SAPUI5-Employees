sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "logaligroup/Employees/model/formatter"
], function (Controller, formatter) {
    "use strict";

    return Controller.extend("logaligroup.Employees.controller.EmployeeDetails", {
        onInit: function () {
            this._bus = sap.ui.getCore().getEventBus();
        },
        onCreateIncidence: function () {
            var tableIncidence = this.getView().byId("tableIncidence");
            var newIncidence = sap.ui.xmlfragment("logaligroup.Employees.fragment.NewIncidence", this);
            //Controller>View>
            var incidenceModel = this.getView().getModel("incidenceModel");
            var odata = incidenceModel.getData();
            var index = odata.length;
            odata.push({ index: index + 1 });
            incidenceModel.refresh();
            newIncidence.bindElement("incidenceModel>/" + index);
            tableIncidence.addContent(newIncidence);

        },
        onDeleteIncidence: function (oEvent) {
            
            var contextObject = oEvent.getSource().getBindingContext("incidenceModel").getObject();
            this._bus.publish("incidence", "onDeleteIncidence", {
                IncidenceId: contextObject.IncidenceId,
                SapId: contextObject.SapId,
                EmployeeId : contextObject.EmployeeId
            });

        },
        onSaveIncidence: function(oEvent) {
            var incidence = oEvent.getSource().getParent().getParent();
            var incidenceRow = incidence.getBindingContext("incidenceModel");
            this._bus.publish("incidence", "onSaveIncidence", {
                incidenceRow : incidenceRow.sPath.replace('/','')
            });
        },
        Formatter: formatter,
        updateIncidenceCreationDate: function(oEvent){
            var context = oEvent.getSource().getBindingContext("incidenceModel");
            var contextObject = context.getObject();
            contextObject.CreationDateX = true;
        },
        updateIncidenceReason: function(oEvent){
            var context = oEvent.getSource().getBindingContext("incidenceModel");
            var contextObject = context.getObject();
            contextObject.ReasonX = true;            
        },
        updateIncidenceType: function(oEvent){
            var context = oEvent.getSource().getBindingContext("incidenceModel");
            var contextObject = context.getObject();
            contextObject.TypeX = true;            
        }         
    });

});
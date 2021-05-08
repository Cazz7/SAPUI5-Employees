sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "logaligroup/Employees/model/formatter",
    "sap/m/MessageBox"
], function (Controller, formatter, MessageBox) {
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
            //New Incidences have invalid values by default
            odata.push({ index: index + 1, _ValidateDate: false });
            incidenceModel.refresh();
            newIncidence.bindElement("incidenceModel>/" + index);
            tableIncidence.addContent(newIncidence);


        },
        onDeleteIncidence: function (oEvent) {

            var contextObject = oEvent.getSource().getBindingContext("incidenceModel").getObject();
            this._bus.publish("incidence", "onDeleteIncidence", {
                IncidenceId: contextObject.IncidenceId,
                SapId: contextObject.SapId,
                EmployeeId: contextObject.EmployeeId
            });

        },
        onSaveIncidence: function (oEvent) {
            var incidence = oEvent.getSource().getParent().getParent();
            var incidenceRow = incidence.getBindingContext("incidenceModel");
            this._bus.publish("incidence", "onSaveIncidence", {
                incidenceRow: incidenceRow.sPath.replace('/', '')
            });
        },
        Formatter: formatter,
        updateIncidenceCreationDate: function (oEvent) {

            let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            let context = oEvent.getSource().getBindingContext("incidenceModel");
            let contextObject = context.getObject();

            //We don't use the model incidenceModel>CreationDate directly because it does not change if it is invalid
            if (!oEvent.getSource().isValidValue()) {
                contextObject._ValidateDate = false;
                contextObject.CreationDateState = "Error";
                MessageBox.error(oResourceBundle.getText("errorCreationDateValue"), {
                    title: "Error",
                    onClose: null,
                    styleClass: "",
                    actions: MessageBox.Action.Close,
                    emphasizedAction: null,
                    initialFocus: sap.ui.core.TextDirection.Inherit
                });
            } else {
                contextObject.CreationDateX = true;
                contextObject._ValidateDate = true;
                contextObject.CreationDateState = "None";
            };

            context.getModel().refresh();

        },
        updateIncidenceReason: function (oEvent) {

            let context = oEvent.getSource().getBindingContext("incidenceModel");
            let contextObject = context.getObject();

            if (oEvent.getSource().getValue()) {
                contextObject.ReasonX = true;
                contextObject.ReasonState = "None";
            } else {
                contextObject.ReasonState = "Error";
            };

            context.getModel().refresh();
        },
        updateIncidenceType: function (oEvent) {
            var context = oEvent.getSource().getBindingContext("incidenceModel");
            var contextObject = context.getObject();
            contextObject.TypeX = true;
        }
    });

});
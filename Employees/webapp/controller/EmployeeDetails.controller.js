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
            odata.push({ index: index + 1, _ValidateDate: false, EnabledSave: false });
            incidenceModel.refresh();
            newIncidence.bindElement("incidenceModel>/" + index);
            tableIncidence.addContent(newIncidence);


        },
        onDeleteIncidence: function (oEvent) {

            let contextObject = oEvent.getSource().getBindingContext("incidenceModel").getObject();
            let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            //Confirmation from user before saving
            MessageBox.confirm(oResourceBundle.getText("confirmDeleteIncidence"), {
                onClose: function (oAction) {
                    if (oAction === "OK") {
                        this._bus.publish("incidence", "onDeleteIncidence", {
                            IncidenceId: contextObject.IncidenceId,
                            SapId: contextObject.SapId,
                            EmployeeId: contextObject.EmployeeId
                        });
                    }
                }.bind(this)
            });
        },
        onSaveIncidence: function (oEvent) {
            let incidence = oEvent.getSource().getParent().getParent();
            let incidenceRow = incidence.getBindingContext("incidenceModel");
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

            if (oEvent.getSource().isValidValue() && contextObject.Reason) {
                contextObject.EnabledSave = true;
            } else {
                contextObject.EnabledSave = false;
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

            if (contextObject._ValidateDate && oEvent.getSource().getValue()) {
                contextObject.EnabledSave = true;
            } else {
                contextObject.EnabledSave = false;
            };

            context.getModel().refresh();
        },
        updateIncidenceType: function (oEvent) {
            let context = oEvent.getSource().getBindingContext("incidenceModel");
            let contextObject = context.getObject();

            if (contextObject._ValidateDate && contextObject.Reason) {
                contextObject.EnabledSave = true;
            } else {
                contextObject.EnabledSave = false;
            };

            contextObject.TypeX = true;
            context.getModel().refresh();
        },
        toOrderDetails: function (oEvent){
            let orderID = oEvent.getSource().getBindingContext("odataNorthwind").getObject().OrderID;
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteOrderDetails",{
                OrderID : orderID
            });
        }        
    });

});
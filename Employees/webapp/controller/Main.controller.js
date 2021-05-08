sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("logaligroup.Employees.controller.Main", {
            onBeforeRendering: function () {
                //get attributes from employee details
                this._detailEmployeeView = this.getView().byId("detailEmployeeView");

            },
            onInit: function () {
                var oView = this.getView();

                //Cargar los datos desde el modelo JSON
                var oJSONModelEmpl = new JSONModel();
                oJSONModelEmpl.loadData("./localService/mockdata/Employees.json", false);
                oView.setModel(oJSONModelEmpl, "jsonEmployees");

                var oJSONModelCountries = new JSONModel();
                oJSONModelCountries.loadData("./localService/mockdata/Countries.json", false);
                oView.setModel(oJSONModelCountries, "jsonCountries");

                var oJSONModelLayout = new JSONModel();
                oJSONModelLayout.loadData("./localService/mockdata/Layout.json", false);
                oView.setModel(oJSONModelLayout, "jsonLayout");

                var oJSONModelConfig = new JSONModel({
                    visibleID: true,
                    visibleName: true,
                    visibleCountry: true,
                    visibleCity: false,
                    visibleButtonShowCity: true,
                    visibleButtonHideCity: false
                });
                oView.setModel(oJSONModelConfig, "jsonConfig");

                this._bus = sap.ui.getCore().getEventBus();
                // Using susbscribed object from MasterEmployee controller
                // showEmployeeDetail is called
                this._bus.subscribe("flexible", "showEmployee", this.showEmployeeDetails, this);
                // Using susbscribed object from EmployeeDetails controller
                this._bus.subscribe("incidence", "onSaveIncidence", this.onSaveODataIndicence, this);
            },
            showEmployeeDetails: function (category, nameEvent, path) {
                var detailView = this.getView().byId("detailEmployeeView");
                detailView.bindElement("odataNorthwind>" + path);
                //Set value of model
                this.getView().getModel("jsonLayout").setProperty("/ActiveKey", "TwoColumnsMidExpanded");

                var incidenceModel = new sap.ui.model.json.JSONModel([]);
                detailView.setModel(incidenceModel, "incidenceModel");
                //clear content of incident          
                detailView.byId("tableIncidence").removeAllContent();

            },
            onSaveODataIndicence: function (channelId, eventId, data) {
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                var employeeId = this._detailEmployeeView.getBindingContext("odataNorthwind")
                    .getObject().EmployeeID;
                var incidenceModel = this._detailEmployeeView.getModel("incidenceModel").getData();

                //Saved only once
                if (typeof(incidenceModel[data.incidenceRow].IncidenceId) == 'undefined') {


                    //body of incidence
                    var body = {
                        SapId: this.getOwnerComponent().SapId,
                        EmployeeId: employeeId.toString(),
                        CreationDate: incidenceModel[data.incidenceRow].CreationDate,
                        Type: incidenceModel[data.incidenceRow].Type,
                        Reason: incidenceModel[data.incidenceRow].Reason
                    };
                    //Model
                    //We do not know when success will be executed so it is binded
                    this.getView().getModel("incidenceModel").create("/IncidentsSet", body, {
                        success: function () {
                            sap.m.MessageToast.show(oResourceBundle.getText("odataSaveOK"));
                        }.bind(this),
                        error: function (e) {
                            sap.m.MessageToast.show(oResourceBundle.getText("odataSaveKO"));
                        }.bind(this)
                    });
                } else {
                    sap.m.MessageToast.show(oResourceBundle.getText("odataNoChanges"));
                };
            },
        });
    });
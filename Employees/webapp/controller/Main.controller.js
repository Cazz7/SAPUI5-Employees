// @ts-nocheck
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
                // We create the function directly
                this._bus.subscribe("incidence", "onDeleteIncidence", function(channelId, eventId, data){

                        var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

                        this.getView().getModel("incidenceModel")
                        .remove("/IncidentsSet(IncidenceId='" + data.IncidenceId +
                            "',SapId='" + data.SapId +
                            "',EmployeeId='" + data.EmployeeId +
                            "')", {
                        success: function () { 
                            this.onReadODataIncidence.bind(this)(data.EmployeeId);//To update tableindicences after success
                            sap.m.MessageToast.show(oResourceBundle.getText("odataDeleteOK"));
                        }.bind(this),
                        error: function (e) {
                            sap.m.MessageToast.show(oResourceBundle.getText("odataDeleteKO"));
                        }.bind(this)
                    });                        
                } , this);
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

                //read data from OData service
                this.onReadODataIncidence(this._detailEmployeeView.getBindingContext("odataNorthwind")
                    .getObject().EmployeeID);

            },
            onSaveODataIndicence: function (channelId, eventId, data) {
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                var employeeId = this._detailEmployeeView.getBindingContext("odataNorthwind")
                    .getObject().EmployeeID;
                var incidenceModel = this._detailEmployeeView.getModel("incidenceModel").getData();

                //Saved only once
                if (typeof (incidenceModel[data.incidenceRow].IncidenceId) == 'undefined') {


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
                    this.getView().getModel("incidenceModel")
                        .create("/IncidentsSet", body, {
                            success: function () {
                                this.onReadODataIncidence.bind(this)(employeeId);//To update tableindicences after success
                                sap.m.MessageToast.show(oResourceBundle.getText("odataSaveOK"));
                            }.bind(this),
                            error: function (e) {
                                sap.m.MessageToast.show(oResourceBundle.getText("odataSaveKO"));
                            }.bind(this)
                        });
                    // if one of these fields has changed
                } else if (incidenceModel[data.incidenceRow].CreationDateX ||
                    incidenceModel[data.incidenceRow].ReasonX ||
                    incidenceModel[data.incidenceRow].TypeX) {
                    var body = {
                        CreationDate: incidenceModel[data.incidenceRow].CreationDate,
                        CreationDateX: incidenceModel[data.incidenceRow].CreationDateX,
                        Type: incidenceModel[data.incidenceRow].Type,
                        TypeX: incidenceModel[data.incidenceRow].TypeX,
                        Reason: incidenceModel[data.incidenceRow].Reason,
                        ReasonX: incidenceModel[data.incidenceRow].ReasonX
                    };

                    this.getView().getModel("incidenceModel")
                        .update("/IncidentsSet(IncidenceId='" + incidenceModel[data.incidenceRow].IncidenceId +
                            "',SapId='" + incidenceModel[data.incidenceRow].SapId +
                            "',EmployeeId='" + incidenceModel[data.incidenceRow].EmployeeId +
                            "')", body, {
                        success: function () {
                            this.onReadODataIncidence.bind(this)(employeeId);//To update tableindicences after success
                            sap.m.MessageToast.show(oResourceBundle.getText("odataUpdateOK"));
                        }.bind(this),
                        error: function (e) {
                            sap.m.MessageToast.show(oResourceBundle.getText("odataUpdateKO"));
                        }.bind(this)
                    });
                } else {
                    sap.m.MessageToast.show(oResourceBundle.getText("odataNoChanges"));
                };
            },
            onReadODataIncidence: function (employeeID) {

                this.getView().getModel("incidenceModel").read("/IncidentsSet", {
                    filters: [
                        new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId),
                        new sap.ui.model.Filter("EmployeeId", "EQ", employeeID.toString())
                    ],
                    success: function (data) {
                        var incidenceModel = this._detailEmployeeView.getModel("incidenceModel");
                        incidenceModel.setData(data.results);
                        //Table of incidences
                        var tableIncidence = this._detailEmployeeView.byId("tableIncidence");
                        tableIncidence.removeAllContent();//to prevent duplicate incidences

                        for (var incidence in data.results) {
                            var newIncidence = sap.ui.xmlfragment("logaligroup.Employees.fragment.NewIncidence",
                                this._detailEmployeeView.getController());
                            this._detailEmployeeView.addDependent(newIncidence);
                            newIncidence.bindElement("incidenceModel>/" + incidence);
                            tableIncidence.addContent(newIncidence);
                        }
                    }.bind(this),
                    error: function (e) {

                    }
                });
            }
        });
    });
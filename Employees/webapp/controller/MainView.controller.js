// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     */
    function (Controller, JSONModel, Filter, FilterOperator) {
        "use strict";

        function onInit() {


            var oView = this.getView();

            //Cargar los datos desde el modelo JSON
            var oJSONModelEmpl = new JSONModel();
            oJSONModelEmpl.loadData("./localService/mockdata/Employees.json", false);
            oView.setModel(oJSONModelEmpl, "jsonEmployees");

            var oJSONModelCountries = new JSONModel();
            oJSONModelCountries.loadData("./localService/mockdata/Countries.json", false);
            oView.setModel(oJSONModelCountries, "jsonCountries");

            var oJSONModelConfig = new JSONModel({
                visibleID: true,
                visibleName: true,
                visibleCountry: true,
                visibleCity: false,
                visibleButtonShowCity: true,
                visibleButtonHideCity: false
            });
            oView.setModel(oJSONModelConfig, "jsonConfig");
        };

        function onFilter() {
            var oJSONCountries = this.getView().getModel("jsonCountries").getData();

            var filters = [];

            if (oJSONCountries.EmployeeId !== "") {
                filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSONCountries.EmployeeId));
            }

            if (oJSONCountries.CountryKey !== "") {
                filters.push(new Filter("Country", FilterOperator.EQ, oJSONCountries.CountryKey));
            }

            var oList = this.getView().byId("tableEmployee");
            var oBinding = oList.getBinding("items");
            oBinding.filter(filters);
        };

        function onClearFilter() {
            var oModel = this.getView().getModel("jsonCountries");
            oModel.setProperty("/EmployeeId", "");
            oModel.setProperty("/CountryKey", "");
        };

        function showPostalCode(oEvent) {
            var itemPressed = oEvent.getSource();
            var oContext = itemPressed.getBindingContext("jsonEmployees");
            var objectContext = oContext.getObject();

            sap.m.MessageToast.show(objectContext.PostalCode);
        };

        function onShowCity() {
            var oJSONModelConfig = this.getView().getModel("jsonConfig");
            oJSONModelConfig.setProperty("/visibleButtonShowCity", false);
            oJSONModelConfig.setProperty("/visibleButtonHideCity", true);
            oJSONModelConfig.setProperty("/visibleCity", true);
        };

        function onHideCity() {
            var oJSONModelConfig = this.getView().getModel("jsonConfig");
            oJSONModelConfig.setProperty("/visibleButtonShowCity", true);
            oJSONModelConfig.setProperty("/visibleButtonHideCity", false);
            oJSONModelConfig.setProperty("/visibleCity", false);
        };

        function showOrders(oEvent) {
            //get selected controller. Context selected
            var iconPressed = oEvent.getSource();
            //Context or JSON from the model
            var oContext = iconPressed.getBindingContext("jsonEmployees");

            //Verify if Dialog was previously created
            if (!this._oDialogOrders) {
                //fragment route
                this._oDialogOrders = sap.ui.xmlfragment("logaligroup.Employees.fragment.DialogOrders", this);
                //Add Dialog as a dependency
                this.getView().addDependent(this._oDialogOrders);
            };

            //Dialog binding to the context to have access to the data of selected item
            this._oDialogOrders.bindElement("jsonEmployees>" + oContext.getPath());
            this._oDialogOrders.open();
        };

        function onCloseOrder(oEvent) {
            //This attribute was already saved 
            this._oDialogOrders.close();
        };        

        // Se implementan la lógica de otra forma para evitar que marque errores
        const Main = Controller.extend("logaligroup.Employees.controller.MainView", {});

        Main.prototype.onInit = onInit;
        Main.prototype.onFilter = onFilter;
        Main.prototype.onClearFilter = onClearFilter;
        Main.prototype.showPostalCode = showPostalCode;
        Main.prototype.onShowCity = onShowCity;
        Main.prototype.onHideCity = onHideCity;
        Main.prototype.showOrders = showOrders;
        Main.prototype.onCloseOrder = onCloseOrder;

        return Main;
    });

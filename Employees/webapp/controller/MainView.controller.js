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
        };

        function onFilter(){
            var oJSON = this.getView().getModel().getData();

            var filters = [];

            if(oJSON.EmployeeId !== ""){
                filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSON.EmployeeId));
            }

            if(oJSON.CountryKey !== ""){
                filters.push(new Filter("Country", FilterOperator.EQ, oJSON.CountryKey));
            }            
            
            var oList = this.getView().byId("tableEmployee");
            var oBinding = oList.getBinding("items");
            oBinding.filter(filters);
        };

        function onClearFilter(){
            var oModel = this.getView().getModel();
            oModel.setProperty("/EmployeeId", "");
            oModel.setProperty("/CountryKey", "");
        };
        
        function showPostalCode(oEvent){            
            var itemPressed = oEvent.getSource();
            var oContext = itemPressed.getBindingContext();
            var objectContext = oContext.getObject();

            sap.m.MessageToast.show(objectContext.PostalCode);
        };         

        // Se implementan la lógica de otra forma para evitar que marque errores
        const Main = Controller.extend("logaligroup.Employees.controller.MainView", {});

        // Main.prototype.onValidate = function () {
        //     var inputEmployee = this.byId("inputEmployee");
        //     var valueEmployee = inputEmployee.getValue();

        //     if (valueEmployee.length === 6) {
        //         this.getView().byId("labelCountry").setVisible(true);
        //         this.getView().byId("slCountry").setVisible(true);
        //     } else {
        //         this.getView().byId("labelCountry").setVisible(false);
        //         this.getView().byId("slCountry").setVisible(false);
        //     }
        // };

        Main.prototype.onInit = onInit;
        Main.prototype.onFilter = onFilter;
        Main.prototype.onClearFilter = onClearFilter;
        Main.prototype.showPostalCode = showPostalCode;

        return Main;
    });

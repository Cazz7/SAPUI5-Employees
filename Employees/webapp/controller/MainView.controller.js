sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     */
    function (Controller, JSONModel) {
        "use strict";

        function onInit() {

            var oJSONModel = new JSONModel();
            var oView = this.getView();
            var i18nBundle = oView.getModel("i18n").getResourceBundle();

            // Carga de datos mediante el codigo
            // var oJSON = {
            //     employeeId: "12345",
            //     countryKey: "UK",
            //     listCountry: [
            //         {
            //             key: "US",
            //             text: i18nBundle.getText("countryUS")
            //         },
            //         {
            //             key: "UK",
            //             text: i18nBundle.getText("countryUK")
            //         },
            //         {
            //             key: "ES",
            //             text: i18nBundle.getText("countryES")
            //         },
            //     ]

            // };

            //oJSONModel.setData(oJSON);
            //Cargar los datos desde el modelo JSON
            oJSONModel.loadData("./localService/mockdata/Employees.json", false);
            //Se define una funcion que se llama cuando se cargan todos los datos
            // oJSONModel.attachRequestCompleted(function(oEventModel){
            //     console.log(JSON.stringify(oJSONModel.getData()));
            // });
            oView.setModel(oJSONModel);
        };

        // Se implementan la lógica de otra forma para evitar que marque errores
        const Main = Controller.extend("logaligroup.Employees.controller.MainView", {});

        Main.prototype.onValidate = function () {
            var inputEmployee = this.byId("inputEmployee");
            var valueEmployee = inputEmployee.getValue();

            if (valueEmployee.length === 6) {
                this.getView().byId("labelCountry").setVisible(true);
                this.getView().byId("slCountry").setVisible(true);
            } else {
                this.getView().byId("labelCountry").setVisible(false);
                this.getView().byId("slCountry").setVisible(false);
            }
        };

        Main.prototype.onInit = onInit;

        return Main;
    });

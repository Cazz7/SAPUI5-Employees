sap.ui.define([
		"sap/ui/core/mvc/Controller"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller) {
        "use strict";    
        
        // Se implementan la lógica de otra forma para evitar que marque errores
		const Main = Controller.extend("logaligroup.Employees.controller.MainView", {}); 
            
        Main.prototype.onValidate = function() {
                var inputEmployee = this.byId("inputEmployee");
                var valueEmployee = inputEmployee.getValue();

                if(valueEmployee.length === 6){
                    this.getView().byId("labelCountry").setVisible(true);
                    this.getView().byId("slCountry").setVisible(true);
                }else{
                    this.getView().byId("labelCountry").setVisible(false);
                    this.getView().byId("slCountry").setVisible(false);
                }
            };
        return Main;
	});

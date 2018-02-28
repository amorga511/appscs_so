// JS Eventos SMS

/*function leeSMSs(){
    var vFilt = {box:'', address:'BOCAPP',maxCount:1000};
    var vSMSs = [];
    var vArrTemp = [];
    //window.plugins.toast.showShortBottom('Actualizando DB');
    //window.plugins.toast.show('Actualizando DB', 1000, 'bottom');
   	if(SMS) 
    {
        SMS.listSMS(vFilt, function(data){
            for(var i=0;i<data.length;i++){
                if(data[i].address == 'BOCAPP'){
                    vArrTemp.push(hex2a(data[i].body));
                }
            }
            for(j=vArrTemp.length-1;j>=0;j--){
            	vSMSs.push(vArrTemp[j]);
            }
    		//alert(vSMSs.length);
    		getIdSMS(vSMSs);
        },function(){});      
    }
}*/


function administraDB(vArrDtos){
	var vArrComando = [];
	var vArrRows = [];
	var vArrColumns = [];
	var flag_dbprocess = 0;
	var notTitle = "";

	var arr_temp;
	var idTemp = "";

	//Descompone en Rows
	for(var i=0;i<vArrDtos.length; i++){
		vArrComando = vArrDtos[i].split('&');
		//Valida si el mensaje ya fue procesado
		if(parseInt(vArrComando[0])>vIdSMS){
			//alert(vArrComando[0] + '/' + vIdSMS);
			flag_dbprocess = 1;
			switch(parseInt(vArrComando[1]))
			{
				case 1001: // Insert de Nuevos Usuarios
					//window.plugins.toast.show(vArrComando[1], 3000, 'bottom');
					vArrRows = vArrComando[2].split('$');
					for(j=0;j<vArrRows.length; j++){
						vArrColumns = vArrRows[j].split('|');
						var tempQuery = '';
						for(k=0;k<vArrColumns.length;k++){
							tempQuery += "'" + vArrColumns[k] + "',";
						}
						//window.plugins.toast.show(tempQuery, 8000, 'bottom');
						ejecutaSQL("INSERT INTO users (id, pwd, name, phone, status,login,type) VALUES (" + tempQuery.substring(0, tempQuery.length -1) + ")");
						
					}				
				break;
				case 1002: //Update de Usuarios
					//window.plugins.toast.show(vArrComando[1], 3000, 'bottom');
					vArrRows = vArrComando[2].split('$');
					for(j=0;j<vArrRows.length; j++){
						vArrColumns = vArrRows[j].split('|');
						var tempQuery2 = "SET";
						tempQuery2	+= "  pwd = '" + vArrColumns[1] + "'";					
						tempQuery2	+= ", name = '" + vArrColumns[2] + "'";
						tempQuery2	+= ", phone = '" + vArrColumns[3] + "'";
						tempQuery2	+= ", status = '" + vArrColumns[4] + "'";
						tempQuery2	+= ", login = '" + vArrColumns[5] + "'";
						tempQuery2	+= ", type = '" + vArrColumns[6] + "'";
						tempQuery2	+= " where id='" + vArrColumns[0] + "'";
						//window.plugins.toast.show(tempQuery, 8000, 'bottom');
						ejecutaSQL("UPDATE users " + tempQuery2);
						
					}				
				break;
				case 1003: // Habilita/Deshabilita Usuarios
					//window.plugins.toast.show(vArrComando[1], 3000, 'bottom');
					vArrRows = vArrComando[2].split('$');
					for(j=0;j<vArrRows.length; j++){
						vArrColumns = vArrRows[j].split('|');
						var tempQuery3 = "SET";
						tempQuery3	+= " status = '" + vArrColumns[1] + "'";
						tempQuery3 	+= " where id='" + vArrColumns[0] + "'";
						//window.plugins.toast.show(tempQuery, 8000, 'bottom');
						ejecutaSQL("UPDATE users " + tempQuery3);
						
					}				
				break;
				case 2001: // Inserta DataKPI Territorios
					//window.plugins.toast.show(vArrComando[1], 3000, 'bottom');					
					vArrRows = vArrComando[2].split('$');
					for(j=0;j<vArrRows.length; j++){
						vArrColumns = vArrRows[j].split('|');
						var tempQuery3 = "";
						for(k=0;k<vArrColumns.length;k++){
							tempQuery3 += "'" + vArrColumns[k] + "',";
						}
						//window.plugins.toast.show(tempQuery, 8000, 'bottom');
						arr_temp = tempQuery3.split(',');
						ejecutaSQL("DELETE FROM kpi_data_territorio WHERE id="+ arr_temp[0] + " and territorio=" + arr_temp[1] + " and fecha=" + arr_temp[5]);
						sleep(100);
						ejecutaSQL("INSERT INTO kpi_data_territorio (id,territorio,ejecutado,forecast,budget,fecha,year,month,unit) VALUES(" + tempQuery3.substring(0, tempQuery3.length -1) + ")");						
					
						idTemp = arr_temp[0].replace("'", "").replace("'", "");

						//alert(kpis_list.length);
						for(kp=0; kp<kpis_list.length;kp++){
							if(idTemp==kpis_list[kp].id){
								notTitle= kpis_list[kp].name;
								break;
							}
						}
						if(showAlerts == true){
				        	shownot('KPI ' + notTitle + ' Updated..');
				    	}		        
					}				
				break;
				case 2003: // Delete DataKPI 
					//window.plugins.toast.show(vArrComando[1], 3000, 'bottom');
					vArrRows = vArrComando[2].split('$');
					for(j=0;j<vArrRows.length; j++){
						vArrColumns = vArrRows[j].split('|');
						deleteKPI(vArrColumns[0], vArrColumns[1]);
					}				
				break;

				case 2004: // Insert KPI by ZonesChanels kpi_data_zonas 
					//window.plugins.toast.show(vArrComando[1], 3000, 'bottom');
					vArrRows = vArrComando[2].split('$');
					for(j=0;j<vArrRows.length; j++){
						vArrColumns = vArrRows[j].split('|');
						var tempQuery3 = "";
						for(k=0;k<vArrColumns.length;k++){
							tempQuery3 += "'" + vArrColumns[k] + "',";
						}
					}
					arr_temp = tempQuery3.split(',');
					ejecutaSQL("DELETE FROM kpi_data_zonas WHERE id="+ arr_temp[0] + " and zona=" + arr_temp[1] + " and cnl=" + arr_temp[2] + " and sub_cnl=" + arr_temp[3]);
					sleep(100);
					ejecutaSQL("INSERT INTO kpi_data_zonas (id, zona, cnl, sub_cnl, ejecutado,forecast,budget,fecha,year,month,unit) VALUES(" + tempQuery3.substring(0, tempQuery3.length -1) + ")");						
					
					idTemp = arr_temp[0].replace("'", "").replace("'", "");

					//alert(kpis_list.length);
					for(kp=0; kp<kpis_list.length;kp++){
						if(idTemp==kpis_list[kp].id){
							notTitle= kpis_list[kp].name;
							break;
						}
					}
					//if(showAlerts == true){
			        //	shownot('KPI ' + notTitle + ' Updated..');
			      	//}		  			
				break;

				case 2005: // Insert KPI by ZonesChanels kpi_data_zonas Hist 
					//window.plugins.toast.show(vArrComando[1], 3000, 'bottom');
					vArrRows = vArrComando[2].split('$');
					for(j=0;j<vArrRows.length; j++){
						vArrColumns = vArrRows[j].split('|');
						var tempQuery3 = "";
						for(k=0;k<vArrColumns.length;k++){
							tempQuery3 += "'" + vArrColumns[k] + "',";
						}
					}
					arr_temp = tempQuery3.split(',');
					ejecutaSQL("DELETE FROM kpi_data_zonas_hist WHERE id="+ arr_temp[0] + " and zona=" + arr_temp[1] + " and cnl=" + arr_temp[2] + " and sub_cnl=" + arr_temp[3] + " and fecha=" + arr_temp[7]);
					sleep(100);
					ejecutaSQL("INSERT INTO kpi_data_zonas_hist (id, zona, cnl, sub_cnl, ejecutado,forecast,budget,fecha,year,month, unit) VALUES(" + tempQuery3.substring(0, tempQuery3.length -1) + ")");						
					
					idTemp = arr_temp[0].replace("'", "").replace("'", "");

					//alert(kpis_list.length);
					for(kp=0; kp<kpis_list.length;kp++){
						if(idTemp==kpis_list[kp].id){
							notTitle= kpis_list[kp].name;
							break;
						}
					}
					//if(showAlerts == true){
			        //	shownot('KPI ' + notTitle + ' Updated..');
			      	//}		  			
				break;

				case 4001: // Inserta KPIMaster
					//window.plugins.toast.show(vArrComando[1], 3000, 'bottom');
					vArrRows = vArrComando[2].split('$');
					for(j=0;j<vArrRows.length; j++){
						vArrColumns = vArrRows[j].split('|');
						var tempQuery3 = "";
						for(k=0;k<vArrColumns.length;k++){
							tempQuery3 += "'" + vArrColumns[k] + "',";
						}
						ejecutaSQL("INSERT INTO kpi_master (id, bu, name, fav, cn, zn) VALUES(" + tempQuery3.substring(0, tempQuery3.length -1) +")");
					}				
				break;
				case 4002: // Delete KPI
					//window.plugins.toast.show(vArrComando[1], 3000, 'bottom');
					vArrRows = vArrComando[2].split('$');
					for(j=0;j<vArrRows.length; j++){
						vArrColumns = vArrRows[j].split('|');
						ejecutaSQL("DELETE FROM kpi_master where id='" + vArrColumns[0] + "'");
					}				
				break;
			}
			//ejecutaSQL("UPDATE controlSMS set idsms =" + vArrComando[0] + " where id=100");
		}		
	}
	if(flag_dbprocess==1){
		//KPIsmain();
	}
}

//Decodificador de datos
function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}


var db = openDatabase('dbTackSCS', '1.0', 'TrackSCS Data Base', 10 * 1024 * 1024);

db.transaction(function(cmd){
    var vFlag = 0;
    cmd.executeSql('CREATE TABLE IF NOT EXISTS users (id unique, pwd, name, phone, status, login, type)');
    cmd.executeSql('CREATE TABLE IF NOT EXISTS records (fecha, lat, lng, user)');


    db.transaction(function(cmd){   
        cmd.executeSql('SELECT * FROM users where id =?', ['admin'], function (cmd, results) {
        var len = results.rows.length, i;
        for (i = 0; i < len; i++) {
            //alert(results.rows.item(i).id);
            vFlag = 1;
        }
        if(vFlag == 0){
            cmd.executeSql('INSERT INTO users (id, pwd, name, phone, status,login,type) VALUES (?,?,?,?,?,?,?)', ['admin','Tigo.18', 'Administrador', '99999999', '1','0','admin']);     
        }
        //cmd.executeSql('INSERT INTO kpi_data_zonas_hist (id,zona, cnl, sub_cnl, ejecutado,forecast,budget,fecha,year,month,unit) VALUES (?,?,?,?,?,?,?,?,?,?,?)', ['1101','0', '1', '1','152325','15262','15626','20170502','2017','5','UND']);
        });
    });
    
});

function ejecutaSQL(vQuery, vFlag){
    db.transaction(function(cmd){              
            console.log(vQuery);
            cmd.executeSql(vQuery, [], function(){ 
                //alert('d');
                /*if(vFlag == 1 || vFlag == 3 || vFlag == 4){                    
                    vGcountRegs_Flag += 1;
                }*/

                //console.log('Done '+ String(vGcountRegs_Flag) + '/'+ String(vGcountRegs + ' Flag:' + vFlag));
                /*if(vGcountRegs>0 && vGcountRegs==vGcountRegs_Flag){
                    //alert('Datos Actualizados Completamente');
                    $.mobile.loading("hide");
                    vGcountRegs_Flag = 0;
                    vGcountRegs = 0;
                    switch(vFlag){
                        case 3:
                            console.log('Getting Configs');
                            getConfigs();
                        break;
                        case 1:
                            console.log('KPImain');
                            KPIsmain(0);
                        break;
                        case 4:
                            console.log('canales');
                            carga_cnls();
                        break;
                        default:
                            console.log('NA');
                        break;
                    }
                }*/
                //window.plugins.toast.show('Done..', 1000, 'bottom'); 
            },function(e){
                //alert('e');
                console.log('Error' + e.error);
                //window.plugins.toast.show('Error..', 1000, 'bottom');
            });
    });
}

function logInOut(vUser, vTipe){
    db.transaction(function(cmd){   
        cmd.executeSql('UPDATE users SET login=? where id=?', [vTipe, vUser]);
    });
}

function getIdSMS(vArrS)
{
    db.transaction(function(cmd){   
        cmd.executeSql("SELECT idsms FROM controlSMS where id=100", [], function (cmd, results) {
            if(results.rows.length>0){
                //window.plugins.toast.show(results.rows.length, 3000, 'bottom'); 
                vIdSMS = results.rows.item(0).idsms;
                administraDB(vArrS);
            }
        });
    });
}

function showUsers(){
    db.transaction(function(cmd){   
        cmd.executeSql('SELECT * FROM users', [], function (cmd, results) {
            var len = results.rows.length, i;

            if(len>0){
                //alert(len);
                for (i = 0; i < len; i++) {
                    //alert(results.rows.item(i).login);
                    alert(results.rows.item(i).id + '/Status:' + results.rows.item(i).status + '/LOG:' + results.rows.item(i).login + '/PWD:' + results.rows.item(i).pwd);                       
                    //alert(results.rows.item(i).id);          
                }
            }
        });
    });
}

// Funcion para eliminar data his
function deleteKPI(vFecha, vKPI){
    if(parseInt(vKPI) != 0){        
        db.transaction(function(cmd){   
            cmd.executeSql("delete from kpi_data_territorio where fecha < ? and id = ?", [vFecha, vKPI]);
            //cmd.executeSql("delete from kpi_data_canal where fecha < ? and id = ?", [vFecha, vKPI]);
        });
    }else{        
        db.transaction(function(cmd){   
            cmd.executeSql("delete from kpi_data_territorio where fecha < ?", [vFecha]);
            //cmd.executeSql("delete from kpi_data_canal where fecha < ?", [vFecha]);
            cmd.executeSql("delete from kpi_data_zonas where fecha < ?", [vFecha]);
            cmd.executeSql("delete from kpi_data_zonas_hist where fecha < ?", [vFecha]);
        });
    }
}
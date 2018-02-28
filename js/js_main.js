// JavaScript General App

var userWS = 'BOC';
var pdwWS  = '5al3sOp3ration';
var vFlagTracking = false;

var vDatosUsuario ={"user":"", "login":""};
var vTitle ="Tracking Service Comercial Support";


var vIntersept = true;
var vIntervalGeo;
//var webSvrListener =  setInterval(function(){ consultSVR()}, 59000);

var app = {
    
    //alert(getParams('user'));
    
    initialize: function() {        
        document.addEventListener("deviceready", this.onDeviceReady, false);
    },
    
    onDeviceReady: function() {
        //shownot('Hello World');
        console.log(device.cordova);  
        //cordova.plugins.backgroundMode.overrideBackButton();
        cordova.plugins.backgroundMode.setEnabled(false);       
        cordova.plugins.backgroundMode.setDefaults({title:'Tracking SCS', text: 'Tracking', resume:true, hidden:true}); 
       
        cordova.plugins.backgroundMode.on('activate',function(){
           // navigator.vibrate(800)
           //setInterval(function(){ navigator.vibrate(80);}, 10000);
           //cordova.plugins.backgroundMode.configure({ silent: true });
        });
        
        cordova.plugins.backgroundMode.on('deactivate',function(){
            navigator.vibrate(50);
        });

        /*if(SMS) SMS.enableIntercept(vIntersept, function(){}, function(){});
        if(SMS) SMS.startWatch(function(){}, function(){});
            
        document.addEventListener('onSMSArrive', function(e){
            var sms = e.data;
            var arrinfo = [];
            //shownot();
            if(sms.address == 'BOCAPP'){
                //alert(sms.body + "/From:" + sms.address);
                arrinfo.push(hex2a(sms.body));                    
                getIdSMS(arrinfo);
            }
        });*/

        document.addEventListener('resume', function(e){
            /*KPIsmain(0);
            $("#dvtitle").html('Sales Operation-BOC');
            screen.orientation.unlock();
            $("#dvMap").hide();*/
            console.log('Resume Event');
        });

        document.addEventListener('backbutton', function(e){
            cordova.plugins.backgroundMode.moveToBackground();           
        });

        /*var notificationOpenedCallback = function(jsonData) {
            console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
            setTimeout(function(e){ 
                $.mobile.loading("show", {
                    text: "Actualizando Datos",
                    textVisible:true,
                    theme: "a",
                    html:'<center><img src="img/dbicon.png" width="35px"/><br /><span>Actualizando...</span></center>'
                });
                consultSVR(); 
            }, 2000);
        };*/

        /*window.plugins.OneSignal
            .startInit("0bc4d5a9-2951-4262-8590-d24068acb2a1")
            .handleNotificationOpened(notificationOpenedCallback)
            .endInit();
        window.plugins.OneSignal.sendTag('USR', vDatosUsuario.user);*/
    }

}

$(document).ready(function(e){

    $("#page").hide();
    $("#dvHead").hide();

	$("#dvMain").hide();
	$("#dvtitle").html(vTitle);



function validaLogin(){
    var tempLogin = getParams();
    vLogin = tempLogin.login;

    vDatosUsuario.user = tempLogin.user;
    vDatosUsuario.login = vLogin;

        if(parseInt(vLogin) != 1){ 
            db.transaction(function(cmd){   
                cmd.executeSql("SELECT * FROM users where login = '1'", [], function (cmd, results) {
                    var len = results.rows.length, i;
                    i = 0;
                    if(len>0){
                        vDatosUsuario.user = results.rows.item(i).id;
                        vDatosUsuario.login = 1;
                        logInOut(vDatosUsuario.user, '1');		   
                        
                        $("#page").show();
                        $("#dvHead").show();
                        $("#dvMain").show();
                        $("#bg_login").hide();	                                           
                    }else{   
                        window.location.replace('login.html');                         
                    }
                    //leeSMSs(); 
                });
            });
        }else{ 
            $("#page").show();
            $("#dvHead").show();
        	$("#dvMain").show(); 
        	$("#bg_login").hide(); 
            logInOut(tempLogin.user, '1'); 	
            //sleep(400);
        }
}



setTimeout(function(){ 
    validaLogin();
}, 10);



});

function getMapLocation() {

    navigator.geolocation.getCurrentPosition
    (onSuccess, onErrorF, { enableHighAccuracy: true });
}

function onSuccess(position){
    d = new Date();
    vQre = 'INSERT INTO records (fecha, lat, lng, user) VALUES(\'' + getYMD(0) + d.getHours() + d.getMinutes() + '\',';
    vQre += position.coords.latitude + ',' + position.coords.longitude + ',\''+ vDatosUsuario.user + '\')';
    ejecutaSQL(vQre, 0);
    $("#test").append(d.getHours() +':'+ d.getMinutes() + '<br />' + position.coords.latitude + '/' +position.coords.longitude + '<br />');
    
}
function onErrorF(error){
    console.log('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

function tracking(){
    if(vFlagTracking ==  false){
        console.log('starting..');
        $("#btn_tack").attr('src', 'img/tracking.png');
        $("#msj").html('Sending...');
        vFlagTracking = true;
        getMapLocation();
        vIntervalGeo = setInterval(function(){ getMapLocation() }, 61000);

    }else{
        $("#btn_tack").attr('src', 'img/play.png');
        $("#msj").html('Start Tracking');
        clearInterval(vIntervalGeo);
        vFlagTracking = false;
    }
}

function logout(){
    console.log(vDatosUsuario.user);
    logInOut(vDatosUsuario.user, '0');
    window.location.replace('index.html?user=0&login=0');
}
function login(){
		var usr = String($("#user").val()).trim().toLowerCase();
		var pwd = String($("#pwd").val()).trim();        

		db.transaction(function(cmd){   
            cmd.executeSql("SELECT * FROM users where id=? and status='1'", [usr], function (cmd, results) {
                var len = results.rows.length, i;

                if(len>0){
                    //alert(len);
                    for (i = 0; i < len; i++) {
                        //alert(results.rows.item(i).login);
                        if(results.rows.item(i).pwd == pwd){
                            //logInOut($scope.usuario, '1');
                            sleep(300);
                            window.location.replace('index.html?user=' + usr +  '&login=1');
                        }else{
                            $("#msj_err").html('Clave Incorrecta');
                        }
                       //alert(results.rows.item(i).id);          
                    }
                }else{
                    $("#msj_err").html("Usuario Incorecto");
                }
            });
        });
}










function getDataDB2(vQry, vZn, vKpi, vTypeD){
    var dataDrill = [];

    db.transaction(function(cmd2){  
        //console.log(vQry);        
        cmd2.executeSql(vQry,[], function (cmd2, results2) {
            //console.log('Sub Cnl por Zona ' + results2.rows.length); 

            if(vTypeD==0){
                for(var j=0; j<results2.rows.length; j++){
                    dataDrill.push([results2.rows.item(j).sub_cnl, results2.rows.item(j).ejecutado]);
                } 
                dataDrill1.push({"name":"Zona " + vZn, "id": vKpi + " Zona "+vZn, "data":dataDrill});
            }else{
                for(var j=0; j<results2.rows.length; j++){
                    dataDrill.push(['Zona ' + results2.rows.item(j).zona, results2.rows.item(j).ejecutado]);
                } 
                dataDrill1.push({"name":vZn, "id": vKpi + '-' + vZn, "data":dataDrill});
            }
            

            //console.log(JSON.stringify(dataDrill1));
        });
    }, function(e){console.log(e);});

}




function consultSVR(){
    //alert('hello');
    var varJSNkpis;
    var vCountRegs = 0;
    var vQry1 = '';
    var vQry2 = '';
    var vYMD =  getYMD(-1);
    var vDataDecode = '';

    //console.log('consulting server');
    //$.post('http://localhost/proyects_amg/web/websvr/svrkpi/svrConsultas.php', {op:2, kpi:0, date:vYMD, user:userWS, pdw:pdwWS}, function(rData){    //'https://svrconsultas.appspot.com/test/', function(rData){
    $.post('http://localhost:8081/ws_so1/ws_consultas_boc/kpis/2017/09/1101', function(rData){
    //$.post('https://svrconsultas.appspot.com/test/', {user:userWS, pdw:pdwWS}, function(rData){
        //console.log(str2Hex(rData));
        alert(rData);
        //console.log(rData);
        //vDataDecode = hex2a(rData);
        vDataDecode = rData;

        varJSNkpis = JSON.parse(vDataDecode);
        vCountRegs = varJSNkpis.kpis.length;
        console.log(vCountRegs);

        vGcountRegs = vCountRegs*2;
        vGcountRegs_Flag = 0;

        for(var i=0; i<vCountRegs; i++){
            //Delete from Main Data KPI
            //vQry1 = "DELETE FROM kpi_data WHERE id="+ varJSNkpis.kpis[i].id;
            vQry1 = "DELETE FROM kpi_data WHERE id="+ varJSNkpis.kpis[i].id + " and zona=" + varJSNkpis.kpis[i].zona + " and cnl='" + varJSNkpis.kpis[i].cnl + "' and sub_cnl='" + varJSNkpis.kpis[i].sb_cnl
                    + "' and territorio=" + varJSNkpis.kpis[i].ter;
            ejecutaSQL(vQry1, 0);

            //Delete from Hist Data KPI
            vQry1 = "DELETE FROM kpi_data_hist WHERE id="+ varJSNkpis.kpis[i].id + " and zona=" + varJSNkpis.kpis[i].zona + " and cnl='" + varJSNkpis.kpis[i].cnl + "' and sub_cnl='" + varJSNkpis.kpis[i].sb_cnl
                    + "' and territorio=" + varJSNkpis.kpis[i].ter + " and fecha=" + varJSNkpis.kpis[i].fecha + '';
            ejecutaSQL(vQry1, 0);            
        }
        sleep(2000);

        for(var i=0; i<vCountRegs; i++){

            //Insert into Main Data KPI
            vQry2 = "INSERT INTO kpi_data VALUES(" + varJSNkpis.kpis[i].id + ",'" + varJSNkpis.kpis[i].kpi + "'," + varJSNkpis.kpis[i].ter + "," + varJSNkpis.kpis[i].year + "," + varJSNkpis.kpis[i].month
                    + "," + varJSNkpis.kpis[i].fecha + "," + varJSNkpis.kpis[i].zona + ",'" + varJSNkpis.kpis[i].cnl + "','" + varJSNkpis.kpis[i].sb_cnl 
                    + "'," + varJSNkpis.kpis[i].ejecutado + ',' + varJSNkpis.kpis[i].forecast +',' + varJSNkpis.kpis[i].budget + ",'" + varJSNkpis.kpis[i].unit
                     + "','" + varJSNkpis.kpis[i].bu + "')";
            //console.log(vQry2);
            ejecutaSQL(vQry2, 1);
            sleep(500);

            //Insert into Hist Data KPI
            vQry2 = "INSERT INTO kpi_data_hist VALUES(" + varJSNkpis.kpis[i].id + ",'" + varJSNkpis.kpis[i].kpi + "'," + varJSNkpis.kpis[i].ter + "," + varJSNkpis.kpis[i].year + "," + varJSNkpis.kpis[i].month
                    + "," + varJSNkpis.kpis[i].fecha + "," + varJSNkpis.kpis[i].zona + ",'" + varJSNkpis.kpis[i].cnl + "','" + varJSNkpis.kpis[i].sb_cnl 
                    + "'," + varJSNkpis.kpis[i].ejecutado + ',' + varJSNkpis.kpis[i].forecast +',' + varJSNkpis.kpis[i].budget + ",'" + varJSNkpis.kpis[i].unit
                     + "','" + varJSNkpis.kpis[i].bu + "')";
            //console.log(vQry2);
            ejecutaSQL(vQry2, 1);
        }
    });
}



//Sleep 
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function getParams(param) {
    var vars = {};
    window.location.href.replace( location.hash, '' ).replace( 
        /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
        function( m, key, value ) { // callback
            vars[key] = value !== undefined ? value : '';
        }
    );

    if ( param ) {
        return vars[param] ? vars[param] : null;    
    }
    return vars;
}

function getYearMoth(vM){
    var vResult = '';
    var year = 0;
    var mes = 0;
    year = parseInt(getYMD(0).substring(0,4));
    mes = parseInt(getYMD(0).substring(4,6));

    mes = mes + vM
    if(mes < 1){
        mes = 12 + mes;
        year = year - 1
    }
    if(mes <10){
        vResult = year + "0" + mes;
    }else{
        vResult = year + "" + mes;
    }

    return vResult;
}

function getYMD(vDays){
    var vToday = new Date();
    var time = vToday.getTime();
    var milsecs = parseInt(vDays*24*60*60*1000);
    vToday.setTime(time + milsecs);

    var strDate = '';
    strDate = vToday.getFullYear();

    if(parseInt(vToday.getMonth() + 1) < 10 ){
        strDate += '0' + (vToday.getMonth()+1);
    }else{
        strDate += '' + (vToday.getMonth()+1);
    }
    if(parseInt(vToday.getDate()) < 10 ){
        strDate += '0' + vToday.getDate();
    }else{
        strDate += '' + vToday.getDate();
    }
    return strDate;
}

function getMonthName(vMonth){
    var ArrNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul','Ago','Sep','Oct', 'Nov', 'Dic'];
    return ArrNames[parseInt(vMonth)-1];
}
  


//Decodificador de datos
function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}


//Codificador de datos
function str2Hex(strVar) {
    var hex = '';//force conversion
    var str = '';
    for (var i = 0; i < strVar.length; i ++)
        hex += '' + strVar.charCodeAt(i).toString(16); //  String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return hex;
}

//Decodificador Base64
function b64_to_str(vStr){
	return decodeURIComponent(escape(window.atob(vStr)));
}
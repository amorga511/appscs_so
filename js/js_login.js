



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
        cordova.plugins.backgroundMode.setDefaults({title:'SO KPIs', text: 'Running', resume:true, hidden:true}); 
       
        cordova.plugins.backgroundMode.on('activate',function(){
           // navigator.vibrate(800)
           //setInterval(function(){ navigator.vibrate(80);}, 10000);
           //cordova.plugins.backgroundMode.configure({ silent: true });
        });
        
        cordova.plugins.backgroundMode.on('deactivate',function(){
            navigator.vibrate(50);
        });

        if(SMS) SMS.enableIntercept(vIntersept, function(){}, function(){});
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
        });

        document.addEventListener('resume', function(e){
            KPIsmain(0);
            $("#dvtitle").html('Sales Operation-BOC');
            screen.orientation.unlock();
            $("#dvMap").hide();
        });

        document.addEventListener('backbutton', function(e){
            if(parseInt(vFlagFrame)==0){
                cordova.plugins.backgroundMode.moveToBackground();
            }else{
                if(vFlagFrame == 10 || vFlagFrame == 20 || vFlagFrame == 30 || vFlagFrame == 40 || vFlagFrame == 50 || vFlagFrame == 1){
                    switchMenu(1, 'Sales Operation-BOC',0,0);
                }else if(vFlagFrame == 11){
                    switchMenu(4, 'KPIs by SubChannel',0,0)
                }else if(vFlagFrame == 31){
                    switchMenu(5, 'KPIs Favorites',0,00)
                }
            }
        });

        var notificationOpenedCallback = function(jsonData) {
            console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
            consultSVR();
        };

        window.plugins.OneSignal
            .startInit("0bc4d5a9-2951-4262-8590-d24068acb2a1")
            .handleNotificationOpened(notificationOpenedCallback)
            .endInit();
    }

}

$(document).ready(function(e){

});

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
                            //sleep(300);
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
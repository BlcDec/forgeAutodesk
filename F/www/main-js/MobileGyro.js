// var socket = io('http://myforgetest.herokuapp.com');
var socket = io('http://localhost:3001');


var cylinder = null;

var cylinderPos ={lastx:0,lasty:0,lastz:0}; 
var rotInterval ={lastx:0,lasty:0,lastz:0}; 

var _viewer = null;

function MobileGyroExtension(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);

}

MobileGyroExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
MobileGyroExtension.prototype.constructor = MobileGyroExtension;

MobileGyroExtension.prototype.load = function() {
    console.log('MobileGyroExtension.prototype.load');
    _viewer = this.viewer;
    this._Move_Obj_OnOff = true;
     this._Drive_Camera_OnOrOff = true;

    return true;

};

MobileGyroExtension.prototype.unload = function() {
    this._Move_Obj_OnOff = false;
         this._Drive_Camera_OnOrOff = false;

    return true;
};

MobileGyroExtension.prototype.Move_Obj_OnOrOff = function() {

      if(this._Move_Obj_OnOff)
      {
          cylinder = null;
          cylinderPos ={lastx:0,lasty:0,lastz:0}; 

          //draw a cylinder
          var geometry_cylinder = new THREE.CylinderGeometry( 5, 10, 10, 32 );
          var material_cylinder= new THREE.MeshBasicMaterial( {color: 0xffff00} );
          cylinder = new THREE.Mesh( geometry_cylinder, material_cylinder );
          _viewer.impl.scene.add(cylinder);
          _viewer.impl.invalidate(true);

          //hard-coded the initial position of the cylinder
          cylinder.translateX( 0 );
          cylinder.translateY( 0 );
          cylinder.translateZ( 30 );
          cylinder.rotateX( 1.57 );

          socket.on('au_Gyro', function (msg) {
              var GyroJson = eval("(" + msg + ")");

             //element ID has not been used by this demo yet. reserve for future
              var windowNum = GyroJson.windowNum;
              //Gyro data
              var GyroData = GyroJson.GyroData;

              var newx = GyroData.alpha;
              var newy = GyroData.beta;
              var newz = GyroData.gamma;

              console.log('x=' + newx + ' ' + 'y=' + newy + 'z=' + newz);

              //move the pbject
              cylinder.translateX(newx - cylinderPos.lastx);
              cylinder.translateY(newy - cylinderPos.lasty);
              cylinder.translateZ(newz - cylinderPos.lastz);

              _viewer.impl.invalidate(true);
              cylinderPos = {lastx:newx,lasty:newy,lastz:newz}; 
          } );
      }
      else
      {
          //remove the cylinder
          _viewer.impl.scene.remove(cylinder);
          _viewer.impl.invalidate(true);
          //remove the listeners
          socket.removeAllListeners("au_Gyro");
      }
     this._Move_Obj_OnOff = !this._Move_Obj_OnOff;
}
 
MobileGyroExtension.prototype.Drive_Camera_OnOrOff = function() {

      if(this._Drive_Camera_OnOrOff)
      {          

           rotInterval = {lastx:0,lasty:0,lastz:0}; 
           //inital camera when the socket listening starts
          var iniCam = _viewer.navigation.getCamera();

          socket.on('au_Gyro', function (msg) {
              var GyroJson = eval("(" + msg + ")");

             //element ID has not been used by this demo yet. reserve for future
              var windowNum = GyroJson.windowNum;
              //Gyro data
              var GyroData = GyroJson.GyroData;

              newx = GyroData.alpha;
              newy = GyroData.beta;
              newz = GyroData.gamma;  

             //rotate the camera
              var localCam = iniCam.clone();
              var newPosition = localCam.position;
              var newTarget = localCam.target;
              var directionFwd = iniCam.target.clone().sub(iniCam.position);
              var directionRight = directionFwd.clone().cross(iniCam.up).normalize();

             //rotate around up vector
              var yawX = new THREE.Quaternion();
              var changed = ( Math.abs(newx-rotInterval.lastx) >1 );
              if(changed) 
                yawX.setFromAxisAngle(localCam.up, 2*Math.PI*(newx-rotInterval.lastx)/360);

               //rotate around right vector
              var yawY= new THREE.Quaternion();
              changed = ( Math.abs(newy-rotInterval.lasty) >1 );
              if(changed) 
                yawY.setFromAxisAngle(directionRight, 2*Math.PI*(newy-rotInterval.lasty)/360);
               
              var yawQ = new THREE.Quaternion();
              yawQ.multiply(yawX).multiply(yawY);//.multiply(yawZ);

              directionFwd.applyQuaternion(yawQ);
              localCam.up.applyQuaternion(yawQ);
              var _navapi = _viewer.navigation;
              newTarget = newPosition.clone().add(directionFwd);
              _navapi.setView(newPosition, newTarget);
              _navapi.orientCameraUp(); 

              rotInterval = {lastx:newx,lasty:newy,lastz:newz};  
            
          } );

          socket.on('au_Touchdata', function (msg) {
              var TouchJson = eval("(" + msg + ")"); 
              //Touch data
              var TouchData = TouchJson.TouchData;

              newx = TouchData.x;
              newy = TouchData.y;
           
              //move camera along the view direction
              //currently, use newx only
             var _camera = _viewer.navigation.getCamera();
             var localCam = _camera.clone();   
             localCam.translateZ(newx);
             var directionFwd = _camera.target.clone().sub(_camera.position);

             var newPosition = localCam.position;
              var newTarget = localCam.target;
              newTarget = newPosition.clone().add(directionFwd);

              var _navapi = _viewer.navigation;
             _navapi.setView(newPosition, newTarget);
              _navapi.orientCameraUp();
          } );

      }
      else
      {
          //remove the cylinder
          _viewer.impl.scene.remove(cylinder);
          _viewer.impl.invalidate(true);
          //remove the listeners
          socket.removeAllListeners("au_Gyro");
           socket.removeAllListeners("au_Touchdata");
      }
     this._Drive_Camera_OnOrOff = !this._Drive_Camera_OnOrOff;
}

Autodesk.Viewing.theExtensionManager.registerExtension('MobileGyroExtension', MobileGyroExtension);

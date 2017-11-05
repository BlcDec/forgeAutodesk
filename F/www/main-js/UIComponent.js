 var _gyroext = null;

function MyUIExtension(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
}

MyUIExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
MyUIExtension.prototype.constructor = MyUIExtension;

MyUIExtension.prototype.onToolbarCreated = function() {
    this.viewer.removeEventListener(av.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
    this.onToolbarCreatedBinded = null;
    this.createUI();
};

MyUIExtension.prototype.createUI = function() {

    var viewer = this.viewer;
    
    // Button - Gyro for moving object
    var button_Gyro_for_Moving_Obj = new Autodesk.Viewing.UI.Button('btn-move-obj');
    button_Gyro_for_Moving_Obj.icon.style.backgroundImage = 'url(images/move.png)';


     button_Gyro_for_Moving_Obj.onClick = function(e) {
        _gyroext.Move_Obj_OnOrOff();
    };

    button_Gyro_for_Moving_Obj.addClass('btn-move-obj');
    button_Gyro_for_Moving_Obj.setToolTip('Mobile Gyro for Moving Object');

    // Button - Gyro and Touch for driving camera
    var button_Gyro_for_Driving_Camera = new Autodesk.Viewing.UI.Button('btn-driving-camera');
     button_Gyro_for_Driving_Camera.icon.style.backgroundImage = 'url(images/compass.png)';

     button_Gyro_for_Driving_Camera.onClick = function(e) {
        _gyroext.Drive_Camera_OnOrOff();
    };

    button_Gyro_for_Driving_Camera.addClass('btn-driving-camera');
    button_Gyro_for_Driving_Camera.setToolTip('Mobile Gyro for Driving Camera');

    // SubToolbar
    this.subToolbar = new Autodesk.Viewing.UI.ControlGroup('my-custom-buttons-toolbar');
    this.subToolbar.addControl(button_Gyro_for_Moving_Obj);
    this.subToolbar.addControl(button_Gyro_for_Driving_Camera);


    viewer.toolbar.addControl(this.subToolbar);
};

MyUIExtension.prototype.load = function() {

    var viewer = this.viewer;

    if (this.viewer.toolbar) {
        // Toolbar is already available, create the UI
        this.createUI();
        var options = {};
        _gyroext = new  MobileGyroExtension(viewer, options);
        _gyroext.load();
    } else {
        // Toolbar hasn't been created yet, wait until we get notification of its creation
        this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
        this.viewer.addEventListener(av.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
    }

    return true;
};

MyUIExtension.prototype.unload = function() {

    this.viewer.toolbar.removeControl(this.subToolbar);

    return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('MyUIExtension', MyUIExtension);

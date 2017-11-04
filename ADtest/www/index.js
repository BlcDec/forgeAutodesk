// var _viewer3D  = null;
// var _currentShape= null;
//
// //for clear interval
// var _interval_ID = null;
//
// $(document).ready (function () {
//     Autodesk.Viewing.Navigation
//     $('#btnAlertorShape').click (function (evt) {
//
//         if(_viewer3D == null){
//             alert('Viewer 3D not initialized!');
//         }
//         else {
//             $(_viewer3D.container).
//             bind("click", onMouseClick);
//         }
//
//     });
// });

$(document).keydown(function(event){
    var camera1 = new THREE.OrthographicCamera(-2, 2, 1.5, -1.5, 1, 10);
    camera1.position.set(0,0,5);
    new Autodesk.Viewing.Navigation(camera1);
});

// //when the mouse clicks
// function onMouseClick (event) {
//
//     var screenPoint = {
//         x: event.clientX,
//         y: event.clientY
//     };
//
//     var n = normalizeCoords(screenPoint);
//
//     //get hit point
//     var hitTest = _viewer3D.utilities.getHitPoint(
//         n.x,
//         n.y);
//
//     if(hitTest)
//     {
//         //add a sphere.
//         var sprad = 10;
//         var material= new THREE.MeshBasicMaterial( {color: 0xff0000} );
//
//         var geometry_sphere = new THREE.SphereGeometry( sprad, 60, 40 );
//         geometry_sphere.applyMatrix( new THREE.Matrix4().makeTranslation( hitTest.x, hitTest.y, hitTest.z ) );
//         _currentShape = new THREE.Mesh( geometry_sphere, material );
//
//         _viewer3D.impl.scene.add(_currentShape);
//         _viewer3D.impl.invalidate(true) ;
//
//         //start an interval to change the color of the shape
//         // _interval_ID = setInterval(function(){
//         //
//         //     var curColor = _currentShape.material.color;
//         //     curColor = (curColor.getHex()==0xff0000?0x00ff00:0xff0000);
//         //     _currentShape.material.color.setHex (curColor);
//         //     _viewer3D.impl.invalidate(false,true,true);
//         //
//         // },100);
//
//         $(_viewer3D.container).
//         unbind("click", onMouseClick);
//     }
// }
//
// //normalize the screenpoint
// function normalizeCoords (screenPoint) {
//
//     var viewport =
//         _viewer3D.navigation.getScreenViewport();
//
//     var n = {
//         x: (screenPoint.x - viewport.left) / viewport.width,
//         y: (screenPoint.y - viewport.top) / viewport.height
//     };
//
//     return n;
// }
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Xiaodong Liang 2016 - ADN/Developer Technical Services
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
////////////////////////////////////////////////////////////////////////////////-->

// var socket = io('http://myforgetest.herokuapp.com');
var socket = io('http://localhost:3001');
var lastr = 0;
var lastg = 0;
var lastb = 0;

var canvas  = null;
var iniTouchPt = {x:0,y:0};


$(document).ready(function () {

    $('#EmmitGyroData').click(function (evt) {

        if($(this)[0].checked)
        {
            //Monitor Device Orientation
            if(window.DeviceOrientationEvent){
                window.addEventListener("deviceorientation", orientation, false); 

            }else{
                alert("DeviceOrientationEvent is not supported");
            }
        }
        else {
            //undelegate Device Orientation
            window.removeEventListener("deviceorientation",orientation);
            socket.disconnect();
            $('#gyrobig').text('Check [Emmit Gyro Data] to Start');
        }
    });


    canvas = document.getElementById("canDrag");
     canvas.addEventListener("touchstart", onTouchStart);   
});



//when touch start on mobile
function onTouchStart(evt) {
    

    var bRect = canvas.getBoundingClientRect();

    iniTouchPt = {x:(evt.changedTouches[0].clientX - bRect.left)*(canvas.width/bRect.width),
                  y:(evt.changedTouches[0].clientY - bRect.top)*(canvas.height/bRect.height)
                 }; 


    window.addEventListener("touchmove", onTouchMove, false);           
    canvas.removeEventListener("touchstart", onTouchStart, false);
    window.addEventListener("touchend", onTouchEnd, false);
    
    //code below prevents the mouse down from having an effect on the main browser window:
    if (evt.preventDefault) {
        evt.preventDefault();
    } //standard
    else if (evt.returnValue) {
        evt.returnValue = false;
    } //older IE
    
    return false;
}

//for touch end on mobile
function onTouchEnd(evt) {
    canvas.addEventListener("touchstart", onTouchStart); 
    window.removeEventListener("touchend", onTouchEnd, false);
    window.removeEventListener("touchmove", onTouchMove, false);  

}

//for touch move on mobile
function onTouchMove(evt) { 
  
    //getting mouse position correctly 
    var bRect = canvas.getBoundingClientRect();
    var mouseX = (evt.changedTouches[0].clientX - bRect.left)*(canvas.width/bRect.width);
    var mouseY = (evt.changedTouches[0].clientY - bRect.top)*(canvas.height/bRect.height);  
                     
    var IoTJson = {TouchData:{x:mouseX - iniTouchPt.x ,y:mouseY - iniTouchPt.y }};
                     
    socket.emit('au_Touchdata', JSON.stringify(IoTJson));

}  

function orientation(event){

    //just for demo, rephrase the data
    var r = parseInt(event.alpha);///10.0 ;
    var g =  parseInt(event.beta) ;
    var b =  parseInt(event.gamma) ;

    var thistext = r + ', '
        + g + ', '
        + b;
    $('#gyrobig').text(thistext);

    //avoid frequent emmit
     var tol = 2;
    if(Math.abs(r-lastr ) >tol|| Math.abs(g-lastg ) >tol || Math.abs(b-lastb ) >tol)
    {
        //element ID has not been used by this demo yet. reserve for future
        var IoTJson = {elementID:'183911',GyroData:{alpha:r,beta:g,gamma:b}};
        socket.emit('au_Gyro',JSON.stringify(IoTJson));

        lastr = r;
        lastg = g;
        lastb = b;
    }
}

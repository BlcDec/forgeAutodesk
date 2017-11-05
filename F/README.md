# Forge-Viewer-Mobile-Sensor

## Description

This harness is mainly for test data from mobile sensors by JavaScripter

## Setup

* $ npm install
* Request your own API keys from our developer portal [developer.autodesk.com](http://developer.autodesk.com).
* replace the credentials with your own keys in `ForgeRoute.js`:

   var CLIENT_ID = '<  your key  >' , CLIENT_SECRET = '<  your secret  >';

* Modify scope per your test requirement.
* Prepare a model by Forge web services, provide the model urn at  `TestMain.js`

   var defaultUrn = ' your urn ';
   
* Configure the port in `server.js` per your requirement.
* deploy the app to your website, say http://mytest.com
* replace socket root server with yours in MobileGyro.js and MobileSensors.js

   var socket = io( ' http://mytest.com ');

## Test

* Open the main page in the browswer: say http://mytest.com/TestMain.html
* Click [Mobile Gyro] in the viewer, a temporary cylinder will be drawn.The viewer is listening the data from socket
* Open the main page in the browswer of a mobile and open the page: say http://mytest.com/MobileSensors.html
* Check [Emmit Gyro Data], the Gyro data will be received and emmit to the server. The data will be also displayed on the page of the mobile.
* In the main page, the  cylinder will be moved with the data from the mobile.

## To Do
* Add more sensors demos

## License

This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT). Please see the [LICENSE](LICENSE) file for full details.
The Autodesk Viewer is not under MIT License but copyright by Autodesk, Inc.


## Written by

- [Xiaodong Liang](http://adndevblog.typepad.com/cloud_and_mobile/xiaodong-liang.html)

Autodesk Forge, 2016




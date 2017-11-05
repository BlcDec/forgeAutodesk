
var defaultUrn = 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6ZXljZnNqZC10bWFwdWduN2Vta3Zva29sbndjajAxdnN5cW12NGVyMS9yYWNfYWR2YW5jZWRfc2FtcGxlX3Byb2plY3QucnZ0';


function loadView(urn)
{
    $.ajax ({
        url: 'http://' + window.location.host + '/ForgeRoute/gettoken',
        type: 'get',
        data: null,
        contentType: 'application/json',
        complete: null
    }).done (function (response) {
        if(response.err){
            console.log('get token error:' + response.err);
        }
        else {

            var token =  response.access_token;
            console.log(token);

            var options = {
                env: 'AutodeskProduction',
                accessToken: token
            };
            Autodesk.Viewing.Initializer(options, function onInitialized(){

                var config3d = {
                     extensions: ['MyUIExtension']
                };
                viewerApp = new Autodesk.A360ViewingApplication('viewer3D');
                viewerApp.registerViewer(viewerApp.k3D, Autodesk.Viewing.Private.GuiViewer3D,config3d);
                viewerApp.loadDocumentWithItemAndObject(urn);
            });
        }
    }).fail (function (xhr, ajaxOptions, thrownError) {
        console.log('get token error:' + response.err);
    }) ;
}

$(document).ready(function () {
    var paramUrn = Autodesk.Viewing.Private.getParameterByName('urn');
    var urn = (paramUrn !== '' ? paramUrn : defaultUrn);
    loadView(urn);
});

function onError(error) {
    console.log('Error: ' + error);
};

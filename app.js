var _ = require('lodash');
const fetch = require('node-fetch');
const ApiInvodker = require('./apiInvoke');

const socketioManager = 'http://localhost:3017';
const socketio = 'http://localhost:3018';
//const detectionsChannel = 'detectionsChannel'
const detectionsChannel = 'workspaceItemAddedChannel'
const channels = detectionsChannel;


const overlayUrl = 'http://app.dev.gg.wwest.local/api-gw-noauth/api/v1/overlays';
const frameUrl = 'http://app.dev.gg.wwest.local/api-gw-noauth/api/v1/frames/framesByQuery'
const apiInvoker =  new ApiInvodker(overlayUrl, frameUrl);

//const overlayId = 'Pleiades_PAN_MSI_DS_PHR1A_201907130701391_FR1_PX_E056N27_0506_00675_a0e6b8e3-f060-4ccd-b482-86deaeee545d';


(async () => {
    try {

        const response = await fetch(`${socketioManager}/socket-io-manager/api/v1/generate`)
        const clientId = await response.json()
        var socket = require('socket.io-client')(`${socketio}?customId=${clientId}&channels=${channels}`);
        socket.on('connect', function(){
            console.log(new Date().toISOString(), 'connected');

        });
        socket.on(detectionsChannel, function(data){
            console.log(new Date().toISOString(), 'data', data);
            const message = JSON.parse(data);
            const overlayId = _.get(message, 'entityId');
            console.log('##########################');
            console.log('overlayId:', overlayId);

            apiInvoker.getOverlayByOverlayId(overlayId).then(data=> console.log('overlay', data));
            apiInvoker.postFramesByOverlayId(overlayId).then(data=> console.log('frames', data));

        });
        socket.on('disconnect', function(){
            console.log('disconnect')
        });
    } catch (error) {
        console.log(error.response.body);
    }
})();



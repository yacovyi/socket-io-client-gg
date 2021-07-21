//  kubectl -n globus port-forward svc/socket-io-manager 3017:80 3018:81

const fetch = require('node-fetch');

const socketioManager = 'http://localhost:3017';
const socketio = 'http://localhost:3018';

const updateFramesChannel = "updatedFramesChannel";
const channels = updateFramesChannel;
let i = 0;
(async () => {
    try {
        const response = await fetch(`${socketioManager}/socket-io-manager/api/v1/generate`)
        const clientId = await response.json()
        console.log(`clientId= ${clientId}`);
        var socket = require('socket.io-client')(`${socketio}?customId=${clientId}&channels=${channels}`);
        socket.on('connect', function(){
            console.log(new Date().toISOString(), 'connected');
        });
        socket.on(updateFramesChannel, function(data){
            console.log(new Date().toISOString(), 'data', data);
            i++;
            console.log(`Messages received: ${i} ${updateFramesChannel}`);
        });
        socket.on('disconnect', function(){
            console.log('disconnect')
        });
    } catch (error) {
        console.log(error);
    }
})();



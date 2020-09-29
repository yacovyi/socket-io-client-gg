const fetch = require('node-fetch');
const socketioManager = 'http://localhost:3017';
const socketio = 'http://localhost:3018';
const detectionsChannel = 'detectionsChannel'
const channels = detectionsChannel;

(async () => {
    try {

        const response = await fetch(`${socketioManager}/socket-io-manager/api/v1/generate`)
        const clientId = await response.json()
        var socket = require('socket.io-client')(`${socketio}?customId=${clientId}&channels=${channels}`);
        socket.on('connect', function(){
            console.log('connected')
        });
        socket.on(detectionsChannel, function(data){
            console.log('data', data)
        });
        socket.on('disconnect', function(){
            console.log('disconnect')
        });


    } catch (error) {
        console.log(error.response.body);
    }
})();



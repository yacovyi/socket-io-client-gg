var _ = require('lodash');
const fetch = require('node-fetch');
var moment = require('moment')
var request = require('request');
const util = require('util');
let counter = 0;

const overlayUrlStage = 'http://app.staging.gg.wwest.local/api-gw-noauth/api/v1/frames/framesOperationsByOverlayId?overlayId=';
const overlayUrlDev = 'http://app.dev.gg.wwest.local/api-gw-noauth/api/v1/frames/framesOperationsByOverlayId?overlayId=';
const overlayUrl = overlayUrlStage;
const overlayIds = require('./overlays/overlays');
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const stats = {
}
async function callApi(overlayId) {
    const before = moment();
    const response = await fetch(`${overlayUrl}${overlayId}`);
    const content = await response.json();
    var after = moment();
    var timeDifference = after.diff(before, 'seconds')
    return {content, timeDifference}
}
function call(overlayId, counter) {

    console.log( `${counter}) ** ${new Date().toISOString()} ** Request : ${overlayId}`);
    request.get({ url: `${overlayUrl}${overlayId}`, time: true, headers: {"X-UserName": "tt123"} }, function (err, response) {
        const json = response.toJSON();
        try {
            const obj = JSON.parse(json.body);
            console.log( `${counter}) ** ${new Date().toISOString()} ** Response ${overlayId}, response length is ${obj.length}, The actual time elapsed:, ${response.elapsedTime} `);
        } catch (e) {
            console.error( `ERROR --- ${counter}) ** ${new Date().toISOString()} ** Response ${overlayId}, response is ${json.body}, The actual time elapsed:, ${response.elapsedTime}, ${e} `);
        }

    });
}
(async () => {
    try {

        for (const overlayId of overlayIds) {
            counter++;
            call(overlayId, counter);
            //await sleep(1000);
        }
    } catch (error) {
        console.log(error.response.body);
    }
})();



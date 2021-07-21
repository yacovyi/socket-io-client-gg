var _ = require('lodash');
var request = require('request');
let counter = 0;
//10.53.162.36
const eshostStage = 'http://10.53.162.168:9200/imilite-data-framemetadata-all/_search';
const eshostDev = 'http://10.53.162.36:9200/imilite-data-framemetadata-all/_search';
const host = eshostStage;
const overlayIds = require('./overlays/overlays-dev-150');
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function call(overlayId, counter) {

    console.log( `${counter}) ** ${new Date().toISOString()} ** Request : ${overlayId}`);
    const json = {  "size": 5000,
                    "query": {
                        "term": {
                            "overlayId": {
                                "value": overlayId,
                                "boost": 1.0
                            }
                        }}};
    request({ url: `${host}`,
                    time: true,
                    method: 'POST',
                    json,
                    headers: {'content-type' : 'application/json'}
    }, function (err, response) {
        const json = response.toJSON();
        try {
            const hits = json.body.hits.hits;
            console.log( `${counter}) ** ${new Date().toISOString()} ** Response ${overlayId}, response length is ${hits.length}, The actual time elapsed:, ${response.elapsedTime} `);
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
            //await sleep(1);
        }
    } catch (error) {
        console.log(error.response.body);
    }
})();



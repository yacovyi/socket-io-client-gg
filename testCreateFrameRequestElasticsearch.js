const Elasticsearch = require('./elasticsearch');
const ApiInvodker = require('./apiInvoke');

const overlayUrl = 'http://app.dev.gg.wwest.local/api-gw-noauth/api/v1/overlays';
const frameUrl = 'http://app.dev.gg.wwest.local/api-gw-noauth/api/v1/frames/framesByQuery'
const apiInvoker =  new ApiInvodker(overlayUrl, frameUrl);

const host = 'http://es-db.dev.gg.wwest.local:9200/';
const index = 'imilite-data-framemetadata'
const elasticsearchClient = new Elasticsearch(host, index);
const overlayId = 'Pleiades_PAN_MSI_DS_PHR1A_201907130701391_FR1_PX_E056N27_0506_00675_cb5a80d7-ff20-4de2-8b43-8bf38ce67405_2'
const frame = {
    sensorName: 'Pleiades',
    imagingTime: "2019-07-13T07:02:16.000Z",
    overlayId
}
const roi = {
    'coordinates': [
        [
            [
                56.36080171887789,
                27.26033785478304
            ],
            [
                56.41450847775511,
                27.26057281534595
            ],
            [
                56.41485848674547,
                27.19363145281156
            ],
            [
                56.3611838288672,
                27.19339716306795
            ],
            [
                56.36080171887789,
                27.26033785478304
            ]
        ]
    ]
}


elasticsearchClient.getMatchFrame(frame, roi)
    .then(data2send => {
        return apiInvoker.invokeMatchChangeDetections(data2send);
    }).then(matchedFrame =>{
        console.log(matchedFrame)
    });

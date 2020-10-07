const ApiInvodker = require('./apiInvoke');
const overlayUrl = 'http://app.dev.gg.wwest.local/api-gw-noauth/api/v1/overlays';
const frameUrl = 'http://app.dev.gg.wwest.local/api-gw-noauth/api/v1/frames/framesByQuery'
const apiInvoker =  new ApiInvodker(overlayUrl, frameUrl);
const overlayId = 'Pleiades_PAN_MSI_DS_PHR1A_201603030826571_FR1_PX_E036N33_0619_00503_19b65ff2-7d28-443c-83f7-af69c24e45b6';

apiInvoker.getOverlayByOverlayId(overlayId)
.then(data => {
    console.log('overlay',data)
});

apiInvoker.postFramesByOverlayId(overlayId)
    .then(data => {
        console.log('frames',data)
    });

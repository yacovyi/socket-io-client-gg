const fetch = require('node-fetch');

module.exports = class ApiInvoke {
    constructor(overlayUrl, framesUrl) {
        this.overlayUrl = overlayUrl;
        this.framesUrl = framesUrl;
    }

    async getOverlayByOverlayId(overlayId) {
        const response = await fetch(`${this.overlayUrl}/${overlayId}`);
        const overlays = response.json();
        return overlays;
    }
    async postFramesByOverlayId(overlayId) {
        const requestBody = this.buildFrameRequst(overlayId);

        const response = await fetch(this.framesUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-UserName': 'ttaaa',
                'Accept': 'application/json'
            },
            body: JSON.stringify(requestBody) // body data type must match "Content-Type" header
        });
        if (response.status == 200 || response.status == 201 ) {
            const frames =  response.json();
            return frames;
        } else if(response.status == 404) {
            return '404'
        }else {
            return 'erro'
        }

        return frames;
    }
    buildFrameRequst(overlayId) {
    const requstBody  = {
        "sortByInfo": [],
        "paginationInfo": {
            "size": 2147483647,
            "from": 0
        },
        "conditions": [
            [
                {
                    "matchQueries": [
                        {
                            "field": "overlayId",
                            "value": overlayId
                        }
                    ]
                }
            ]
        ]
    }
        return requstBody;
    }
}


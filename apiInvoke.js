const bluebird = require('bluebird');
const fetch = require('node-fetch');
const request = bluebird.promisifyAll(require('request'));

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
    async invokeMatchChangeDetections(data2send) {
        try {
            const configRequest = {
                url: `${this.framesUrl}`,
                json: true,
                body: data2send,
                agent: this._agent,
                headers: {
                    'Content-Type': 'application/json',
                    'X-UserName': 'ttaaa',
                    'Accept': 'application/json'
                }
            };
            let response = await request.postAsync(configRequest);
            if (response.statusCode >= 200 && response.statusCode <= 299) {
                console.log('debug', 'send to frames got response statusCode: %d body: %s', response.statusCode, JSON.stringify(response.body));
                return response.body;
            } else {
                throw new Error(`Error invokeMatchChangeDetections ${JSON.stringify(response.body)}`);
            }
        } catch (error) {
            console.log('error', `Request invokeMatchChangeDetections was failed because ${error.message || error}`);
            throw(error);
        }
    }
}


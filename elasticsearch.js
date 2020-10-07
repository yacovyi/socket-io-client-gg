const {Client, errors} = require('@elastic/elasticsearch');
var _ = require('lodash');

module.exports = class Elasticsearch {
    constructor(host, frameIndex) {
        this.client = new Client({node: host});
        this._frameIndex = frameIndex;
    }
    async updateFrameByQuery(frameId, overlayId) {
        try {
            let {body: res} = await this.client.updateByQuery({
                index: `${this._frameIndex}-all`,
                body: {
                    script: {
                        source: `ctx._source.overlayId=params.overlayId;`,
                        lang: "painless",
                        params: {
                            overlayId: [overlayId],
                        }
                    },
                    query: {term: {id: frameId}}
                }

            });
            if (!res.updated) {
                throw new Error(`Error update overlayId ${overlayId} for frameId : ${frameId}`);
            }
            console.log(res);
            console.log('info', `frame with id: ${frameId} updated successfully with overlayId: ${overlayId}`);
        } catch (err) {
            console.log('error', `update frame with overlayId ${overlayId} err: ${JSON.stringify(err)}`);
            throw (err);
        }
    }
    async updateFrame(frameId, overlayId) {
        try {

            const fieldsToUpdate = {
                overlayId: [overlayId]
            }
            let req = {
                index: `${this._frameIndex}-latest`,
                id: frameId,
                body: {
                    doc: fieldsToUpdate
                }
                , refresh: "wait_for"
            };

            let {body: res} = await this.client.update(req);
            const updated = _.get(res, 'result');
            if (updated !== 'updated') {
                throw new Error(`Error update overlayId ${overlayId} for frameId : ${frameId}`);
            }
            console.log('info', `frame with id: ${frameId} updated successfully with overlayId: ${overlayId}`);
        } catch (err) {
            console.log('error', `update frame with overlayId ${overlayId} err: ${JSON.stringify(err)}`);
            throw (err);
        }
    }
}
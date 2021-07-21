const {Client, errors} = require('@elastic/elasticsearch');
var _ = require('lodash');

module.exports = class Elasticsearch {
    constructor(host, frameIndex) {
        this.client = new Client({node: host});
        this._frameIndex = frameIndex;
    }
    async searchFramesByOverlayId(id) {
        try {
            let {body: res} = await this.client.search({
                index: `${this._frameIndex}-all`,
                size: 5000,
                body: {
                    query: {
                        term: {
                            overlayId: id
                        }
                    }
                }
            });
            if (res.hits.hits.length === 0) {
                return [];
            } else {
                return this.parseElasticResults(res);
            }
        } catch (err) {
            this._logger.log('error', `Error in searchFramesByOverlayId ${id} because ${JSON.stringify(err)}`);
            throw err;
        }
    }
    parseElasticResults(res) {
        return _.map(res.hits.hits, hit => hit._source)
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
                },
                refresh: "wait_for"
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

    // ############################
    // createFramesRequest

    async getMatchFrame(frame, roi)
    {
        try {
            const data2send = this.createFramesRequest(frame, roi);
            return data2send;
        } catch (err) {
            throw err;
        }
    }

    createFramesRequest(frame, roi)
    {
        let genericQuery = {
            "conditions": [
                [
                    {
                        "matchQueries": [
                            {
                                "field": "sensorName",
                                "value": frame.sensorName
                            }
                        ],
                        "rangeQueries": [
                            {
                                "field": "imagingTime",
                                "to": frame.imagingTime
                            }
                        ],
                        "regexpQueries": [
                            {
                                "field": "overlayId",
                                "value": `@&~(${frame.overlayId})`
                            }
                        ],
                        "geoQueries": [
                            {
                                "field": "footprint",
                                "relation": "intersects",
                                "polygon": {
                                    "type": "Polygon",
                                    "coordinates": roi? roi.coordinates[0]:frame.footprint.coordinates
                                }
                            }
                        ]
                    }

                ]

            ]
        };

        genericQuery.sortByInfo = [{
            "field": "imagingTime",
            "order": "desc"
        }
        ]
        genericQuery.paginationInfo = {
            "size": 2147483647,
            "from": 0
        };

        return genericQuery;

    }
    // ############################
}

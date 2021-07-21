const Elasticsearch = require('./elasticsearch');

const host = 'http://es-db.dev.gg.wwest.local:9200/';
const index = 'imilite-data-framemetadata'
const elasticsearchClient = new Elasticsearch(host, index);
const frameId = 'DS_PHR1A_201907130701391_FR1_PX_E056N27_0506_00675';
const overlayId = 'Pleiades_PAN_MSI_DS_PHR1A_201907130701391_FR1_PX_E056N27_0506_00675_cb5a80d7-ff20-4de2-8b43-8bf38ce67405_2'

elasticsearchClient.updateFrame(frameId, overlayId);

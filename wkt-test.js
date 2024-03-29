var wkx = require('wkx');
var Buffer = require("buffer").Buffer;


function parseGeometry(geometry) {
    var wkbBuffer = new Buffer(geometry, "base64");
    return wkx.Geometry.parse(wkbBuffer).toGeoJSON();
}


const geometry = wkx.Geometry.parseGeoJSON({ type: 'Point', coordinates: [35.00446204507807, 32.810578469114, null] });
const geometryWkb = geometry.toWkb();

const geometryBase64 = geometryWkb.toString('base64');
console.log(geometryBase64);

const parsedGeometry = parseGeometry(geometryBase64);
console.log(JSON.stringify(parsedGeometry));
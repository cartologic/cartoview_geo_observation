import GeoJSON from 'ol/format/geojson'
import WMSGetFeatureInfo from 'ol/format/wmsgetfeatureinfo'
import proj4 from 'proj4'
const wmsGetFeatureInfoFormats = {
    'application/json': new GeoJSON(),
    'application/vnd.ogc.gml': new WMSGetFeatureInfo()
}
class FeatureHelper {
    getFormat=(format)=>{
        return wmsGetFeatureInfoFormats[format]
    }
    getFeatureInfoUrl = (layer, coordinate, view, infoFormat) => {
        const resolution = view.getResolution(),
            projection = view.getProjection()
        const url = layer.getSource().getGetFeatureInfoUrl(coordinate,
            resolution, projection, {
                'INFO_FORMAT': infoFormat
            })
        return `${url}&FEATURE_COUNT=10`
    }
    getFeatureByURL = (urlsClass, url) => {
        return fetch(urlsClass.getProxiedURL(url)).then((response) =>
            response.json())
    }
    transformFeatures = (layer, features, map, crs) => {
        let transformedFeatures = []
        features.forEach((feature) => {
            feature.getGeometry().transform('EPSG:' + crs, map.getView()
                .getProjection())
            feature.set("_layerTitle", layer.get('title'))
            transformedFeatures.push(feature)
        })
        return transformedFeatures
    }
    getCRS = (crs) => {
        let promise = new Promise((resolve, reject) => {
            if (proj4.defs('EPSG:' + crs)) {
                resolve(crs)
            } else {
                fetch("https://epsg.io/?format=json&q=" + crs).then(
                    response => response.json()).then(
                    projres => {
                        proj4.defs('EPSG:' + crs, projres.results[
                            0].proj4)
                        resolve(crs)
                    })
            }
        })
        return promise
    }
    readFeaturesThenTransform = (urlsClass, layer, coordinate, view, map) => {
        const url = this.getFeatureInfoUrl(layer, coordinate, view,
            'application/json')
        return this.getFeatureByURL(urlsClass, url).then(
            (result) => {
                var promise = new Promise((resolve, reject) => {
                    const features = wmsGetFeatureInfoFormats[
                        'application/json'].readFeatures(
                        result)
                    if (features.length > 0) {
                        const crs = result.features.length > 0 ?
                            result.crs.properties.name.split(":").pop() : null
                        this.getCRS(crs).then((newCRS) => {
                            const transformedFeatures = this.transformFeatures(
                                layer, features,
                                map, newCRS)
                            resolve(transformedFeatures)
                        }, (error) => {
                            reject(error)
                        })
                    } else {
                        resolve([])
                    }
                })
                return promise
            })
    }
    
}
export default new FeatureHelper()
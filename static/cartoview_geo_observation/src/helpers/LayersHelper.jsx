import AnimationHelper from 'Source/helpers/AnimationHelper'
import GeoJSON from 'ol/format/geojson'
import Group from 'ol/layer/group'
import ImageWMS from 'ol/source/imagewms'
import TileWMS from 'ol/source/tilewms'
import Vector from 'ol/source/vector'
import {default as VectorLayer} from 'ol/layer/vector'

class LayersHelper {
    isWMSLayer = (layer) => {
        return layer.getSource() instanceof TileWMS || layer.getSource() instanceof ImageWMS
    }
    layerName = (typeName) => {
        return typeName.split(":").pop()
    }
    layerNameSpace = (typeName) => {
        return typeName.split(":")[0]
    }
    getLayers = (mapLayers) => {
        let children = []
        mapLayers.forEach((layer) => {
            if (layer instanceof Group) {
                children = children.concat(this.getLayers(layer.getLayers()))
            } else if (layer.getVisible() && this.isWMSLayer(
                layer)) {
                children.push(layer)
            }
        })
        return children
    }
    addSelectionLayer = (map, featureCollection, styleFunction) => {
        let source = new Vector({ features: featureCollection })
        new VectorLayer({
            source: source,
            style: styleFunction,
            title: "Selected Features",
            zIndex: 10000,
            format: new GeoJSON({
                defaultDataProjection: map.getView().getProjection(),
                featureProjection: map.getView().getProjection()
            }),
            map: map
        })
        source.on('addfeature', (e) => {
            AnimationHelper.flash(e.feature, map)
        })
    }
    getWMSLayer = (name, layers) => {
        let wmsLayer = null
        layers.forEach((layer) => {
            if (layer instanceof Group) {
                wmsLayer = this.getWMSLayer(name, layer.getLayers())
            } else if (this.isWMSLayer(layer) && layer.getSource()
                .getParams().LAYERS == name) {
                wmsLayer = layer
            }
            if (wmsLayer) {
                return false
            }
        })
        return wmsLayer
    }
}
export default new LayersHelper()
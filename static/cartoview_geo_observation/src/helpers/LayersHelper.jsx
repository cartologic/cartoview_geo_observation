import Group from 'ol/layer/group'
import ImageWMS from 'ol/source/imagewms'
import TileWMS from 'ol/source/tilewms'
class LayersHelper {
    isWMSLayer = ( layer ) => {
        return layer.getSource() instanceof TileWMS || layer.getSource() instanceof ImageWMS
    }
    layerName = ( typeName ) => {
        return typeName.split( ":" ).pop()
    }
    layerNameSpace = ( typeName ) => {
        return typeName.split( ":" )[ 0 ]
    }
    getLayers = ( mapLayers ) => {
        let children = []
        mapLayers.forEach( ( layer ) => {
            if ( layer instanceof Group ) {
                children = children.concat( this.getLayers( layer.getLayers() ) )
            } else if ( layer.getVisible() && this.isWMSLayer(
                    layer ) ) {
                children.push( layer )
            }
        } )
        return children
    }
    getWMSLayer = ( name, layers ) => {
        let wmsLayer = null
        layers.forEach( ( layer ) => {
            if ( layer instanceof Group ) {
                wmsLayer = this.getWMSLayer( name, layer.getLayers() )
            } else if ( this.isWMSLayer( layer ) && layer.getSource()
                .getParams().LAYERS == name ) {
                wmsLayer = layer
            }
            if ( wmsLayer ) {
                return false
            }
        } )
        return wmsLayer
    }
}
export default new LayersHelper()
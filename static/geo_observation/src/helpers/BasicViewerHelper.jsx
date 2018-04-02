import DragRotateAndZoom from 'ol/interaction/dragrotateandzoom'
import FileSaver from 'file-saver'
import FullScreen from 'ol/control/fullscreen'
import Map from 'ol/map'
import OSM from 'ol/source/osm'
import OverviewMap from 'ol/control/overviewmap'
import Tile from 'ol/layer/tile'
import View from 'ol/view'
import extent from 'ol/extent'
import interaction from 'ol/interaction'
import proj from 'ol/proj'
class BasicViewerHelper {
    getCenterOfExtent = ( ext ) => {
        const center = extent.getCenter( ext )
        return center
    }
    getMap = () => {
        let osmLayer = new Tile( {
            title: 'OpenStreetMap',
            source: new OSM()
        } )
        let map = new Map( {
            interactions: interaction.defaults().extend( [
                new DragRotateAndZoom()
            ] ),
            layers: [ osmLayer ],
            view: new View( {
                center: proj.fromLonLat( [ 0, 0 ] ),
                minZoom: 4,
                maxZoom: 16,
                zoom: 6
            } )
        } )
        map.addControl( new OverviewMap() )
        map.addControl( new FullScreen( { source: "root" } ) )
        return map
    }
    zoomToLocation = ( pointArray, map ) => {
        const zoom = map.getView().getMaxZoom()
        const lonLat = this.reprojectLocation( pointArray, map )
        map.getView().setCenter( lonLat )
        map.getView().setZoom( zoom - 4 )
    }
    reprojectLocation = ( pointArray, map ) => {
        /**
         * Reproject x,y .
         * @constructor
         * @param {array} point - [longitude,latitude].
         */
        return proj.transform( pointArray, 'EPSG:4326', map.getView().getProjection() )
    }
    reprojectExtent = ( extent, map ) => {
        /**
         * Reproject extent .
         * @constructor
         * @param {array} extent - [minX,minY,maxX,maxY].
         */
        return proj.transformExtent( extent, 'EPSG:4326', map.getView().getProjection() )
    }
    exportMap = ( map ) => {
        map.once( 'postcompose', ( event ) => {
            let canvas = event.context.canvas
            if ( navigator.msSaveBlob ) {
                navigator.msSaveBlob( canvas.msToBlob(), 'map.png' )
            } else {
                canvas.toBlob( ( blob ) => {
                    FileSaver.saveAs( blob, 'map.png' )
                } )
            }
        } )
        map.renderSync()
    }
}
export default new BasicViewerHelper()

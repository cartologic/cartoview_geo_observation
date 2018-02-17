import Circle from 'ol/style/circle'
import Observable from 'ol/observable'
import Stroke from 'ol/style/stroke'
import Style from 'ol/style/style'
import easing from 'ol/easing'
class AnimationHelper {
    flash = ( feature, map ) => {
        let start = new Date().getTime()
        let listenerKey
        const duration = 5000

        function animate( event ) {
            let vectorContext = event.vectorContext
            let frameState = event.frameState
            let flashGeom = feature.getGeometry().clone()
            let elapsed = frameState.time - start
            let elapsedRatio = elapsed / duration
            // radius will be 5 at start and 30 at end.
            let radius = easing.easeOut( elapsedRatio ) * 25 + 5
            let opacity = easing.easeOut( 1 - elapsedRatio )
            let featureStyle = new Style( {
                image: new Circle( {
                    radius: radius,
                    snapToPixel: false,
                    stroke: new Stroke( {
                        color: 'rgba(21, 84, 75,' +
                            opacity + ')',
                        width: 0.25 + opacity
                    } )
                } )
            } )
            vectorContext.setStyle( featureStyle )
            vectorContext.drawGeometry( flashGeom )
            if ( elapsed > duration ) {
                Observable.unByKey( listenerKey )
                return
            }
            // tell OpenLayers to continue postcompose animation
            map.render()
        }
        listenerKey = map.on( 'postcompose', animate )
    }
    flyTo = ( location, view, zoom, done ) => {
        let duration = 3000
        let parts = 2
        let called = false

        function callback( complete ) {
            --parts
            if ( called ) {
                return
            }
            if ( parts === 0 || !complete ) {
                called = true
                done( complete )
            }
        }
        view.animate( {
            center: location,
            duration: duration
        }, callback )
        view.animate( {
            zoom: zoom - 1,
            duration: duration / 2
        }, {
            zoom: zoom,
            duration: duration / 2
        }, callback )
    }
}
export default new AnimationHelper()
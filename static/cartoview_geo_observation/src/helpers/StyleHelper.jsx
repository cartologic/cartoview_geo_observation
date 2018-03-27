import Circle from 'ol/style/circle'
import Fill from 'ol/style/fill'
import Icon from 'ol/style/icon'
import Image from 'Source/img/marker.png'
import Stroke from 'ol/style/stroke'
import Style from 'ol/style/style'
import Text from 'ol/style/text'

class StyleHelper {
    getMarker = () => {
        const marker = new Style({
            image: new Icon({
                anchor: [
                    0.5, 31
                ],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',

                src: Image
            }),
            text: new Text({
                text: '+',
                fill: new Fill({ color: '#fff' }),
                stroke: new Stroke({
                    color: '#fff',
                    width: 2
                }),
                textAlign: 'center',
                offsetY: -20,
                font: '18px serif'
            })
        })
        return marker
    }
}
export const styleHelper = new StyleHelper()
const image = new Circle({
    radius: 5,
    fill: null,
    stroke: new Stroke({ color: 'black', width: 2 })
})
const styles = {
    'Point': new Style({ image: image }),
    'LineString': new Style({
        stroke: new Stroke({ color: 'green', width: 1 })
    }),
    'MultiLineString': new Style({
        stroke: new Stroke({ color: 'green', width: 1 })
    }),
    'MultiPoint': new Style({ image: image }),
    'MultiPolygon': new Style({
        stroke: new Stroke({ color: 'yellow', width: 1 }),
        fill: new Fill({ color: 'rgba(255, 255, 0, 0.1)' })
    }),
    'Polygon': new Style({
        stroke: new Stroke({
            color: 'blue',
            lineDash: [
                4],
            width: 3
        }),
        fill: new Fill({ color: 'rgba(0, 0, 255, 0.1)' })
    }),
    'GeometryCollection': new Style({
        stroke: new Stroke({ color: 'magenta', width: 2 }),
        fill: new Fill({ color: 'magenta' }),
        image: new Circle({
            radius: 10,
            fill: null,
            stroke: new Stroke({ color: 'magenta' })
        })
    }),
    'Circle': new Style({
        stroke: new Stroke({ color: 'red', width: 2 }),
        fill: new Fill({ color: 'rgba(255,0,0,0.2)' })
    })
}
export const styleFunction = (feature) => {
    const style = feature ? styles[feature.getGeometry().getType()] :
        null
    return style
}

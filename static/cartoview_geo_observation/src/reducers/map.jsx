import ol from 'openlayers'
let map_obj = new ol.Map( {
    layers: [ new ol.layer.Tile( {
        title: 'OpenStreetMap',
        source: new ol.source.OSM( )
    } ) ],
    view: new ol.View( {
        center: [
            0, 0
        ],
        zoom: 3
    } )
} )
export function map( state = map_obj, action ) {
    switch ( action.type ) {
    case 'SET_MAP':
        return action.map
    default:
        return state
    }
}
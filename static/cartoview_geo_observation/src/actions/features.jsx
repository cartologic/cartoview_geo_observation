import ol from 'openlayers'
import { store } from '../store/configureStore';
import { wfsQueryBuilder } from "../helpers/helpers.jsx"
export function featuresIsLoading( bool ) {
    return {
        type: 'FEATURES_IS_LOADING',
        isLoading: bool
    }
}
export function totalFeatures( totalFeatures ) {
    return {
        type: 'TOTAL_FEATURES',
        totalFeatures
    }
}
export function getFeaturesSuccess( features ) {
    return {
        type: 'GET_FEATURES_SUCCESS',
        features
    }
}
export function getFeatures( url, typeName, count, startIndex ) {
    return ( dispatch ) => {
        dispatch( featuresIsLoading( true ) )
        const requestUrl = wfsQueryBuilder( url, {
            service: 'wfs',
            version: '2.0.0',
            request: 'GetFeature',
            typeNames: typeName,
            outputFormat: 'json',
            count,
            startIndex
        } )
        fetch( requestUrl ).then( ( response ) => response.json( ) ).then(
            ( data ) => {
                dispatch( featuresIsLoading( false ) );
                let features = new ol.format.GeoJSON( ).readFeatures(
                    data, {
                        featureProjection: store.getState( ).map.getView( )
                            .getProjection( )
                    } )
                const total = data.totalFeatures
                dispatch( totalFeatures( total ) )
                dispatch( getFeaturesSuccess( features ) )
            } )
    }
}

import ol from 'openlayers'
import { viewStore } from '../store/stores'
import { wfsQueryBuilder } from "../helpers/helpers.jsx"
export function featuresIsLoading( bool ) {
    return {
        type: 'FEATURES_IS_LOADING',
        isLoading: bool
    }
}
export function searchResultIsLoading( bool ) {
    return {
        type: 'SEARCH_RESULT_IS_LOADING',
        isLoading: bool
    }
}
export function attachmentFilesIsLoading( bool ) {
    return {
        type: 'ATTACHMENT_FILES_IS_LOADING',
        isLoading: bool
    }
}
export function searchMode( bool ) {
    return {
        type: 'SEARCH_MODE',
        searchMode: bool
    }
}
export function selectMode( bool ) {
    return {
        type: 'SELECT_MODE',
        selectMode: bool
    }
}
export function totalFeatures( totalFeatures ) {
    return {
        type: 'TOTAL_FEATURES',
        totalFeatures
    }
}
export function searchTotalFeatures( searchTotalFeatures ) {
    return {
        type: 'SEARCH_TOTAL_FEATURES',
        searchTotalFeatures
    }
}
export function getFeaturesSuccess( features ) {
    return {
        type: 'GET_FEATURES_SUCCESS',
        features
    }
}
export function getAttachmentFilesSuccess( files ) {
    return {
        type: 'GET_ATTACHMENT_FILES_SUCCESS',
        files
    }
}
export function searchSuccess( searchResult ) {
    return {
        type: 'SEARCH_SUCCESS',
        searchResult
    }
}
export function selectedFeatures( selectedFeatures ) {
    return {
        type: 'SET_SELECTED_FEATURES',
        selectedFeatures
    }
}
export function getFeatures( url = "/geoserver/", typeName, count, startIndex ) {
    return ( dispatch ) => {
        dispatch( featuresIsLoading( true ) )
        const requestUrl = wfsQueryBuilder( url, {
            service: 'wfs',
            version: '2.0.0',
            request: 'GetFeature',
            typeNames: typeName,
            outputFormat: 'json',
            srsName:viewStore.getState( ).map.getView( ).getProjection( ).getCode(),
            count,
            startIndex
        } )
        fetch( requestUrl ).then( ( response ) => response.json( ) ).then(
            ( data ) => {
                dispatch( featuresIsLoading( false ) );
                let features = new ol.format.GeoJSON( ).readFeatures(
                    data, {
                        featureProjection: viewStore.getState( ).map.getView( )
                            .getProjection( )
                    } )
                const total = data.totalFeatures
                if ( viewStore.getState( ).totalFeatures == 0 ) {
                    dispatch( totalFeatures( total ) )
                }
                dispatch( getFeaturesSuccess( features ) )
            } )
    }
}
export const search = ( url = '/geoserver/wfs', text, layerNameSpace,
    selectedLayerName, property ) => {
    return ( dispatch ) => {
        /* 
        Openlayer build request to avoid errors
        undefined passed to filter to skip paramters and
        use default values
        */
        dispatch( searchResultIsLoading( true ) )
        dispatch( searchMode( true ) )
        var request = new ol.format.WFS( ).writeGetFeature( {
            srsName: viewStore.getState( ).map.getView( ).getProjection( )
                .getCode( ),
            featureNS: 'http://www.geonode.org/',
            featurePrefix: layerNameSpace,
            outputFormat: 'application/json',
            featureTypes: [ selectedLayerName ],
            filter: ol.format.filter.like( property, '%' +
                text + '%', undefined, undefined,
                undefined, false )
        } )
        fetch( url, {
            method: 'POST',
            body: new XMLSerializer( ).serializeToString(
                request )
        } ).then( ( response ) => {
            return response.json( )
        } ).then( ( json ) => {
            dispatch( searchResultIsLoading( false ) )
            let features = new ol.format.GeoJSON( ).readFeatures(
                json )
            const total = json.totalFeatures
            if ( viewStore.getState( ).searchTotalFeatures == 0 ) {
                dispatch( searchTotalFeatures( total ) )
            }
            dispatch( searchSuccess( features ) )
        } )
    }
}
export const loadAttachments = ( selectedLayerName ) => {
    return ( dispatch ) => {
        dispatch( attachmentFilesIsLoading( true ) )
        fetch(
            `/apps/cartoview_attachment_manager/${selectedLayerName}/file`
        ).then( ( response ) => response.json( ) ).then( ( data ) => {
            dispatch( attachmentFilesIsLoading( false ) )
            dispatch( getAttachmentFilesSuccess( data ) )
        } ).catch( ( error ) => {
            throw Error( error )
        } )
    }
}

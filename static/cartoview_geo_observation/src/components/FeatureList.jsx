import '../css/slider.css'

import {
    getFeatures,
    loadAttachments,
    search,
    searchMode,
    selectMode,
    selectedFeatures
} from '../actions/features'

import AlertContainer from 'react-alert'
import FeatureListItem from "./FeatureListItem"
import FeatureListMap from "./FeatureListMap"
import ItemDetails from "./ItemDetails"
import MapConfigService from '@boundlessgeo/sdk/services/MapConfigService'
import MapConfigTransformService from '@boundlessgeo/sdk/services/MapConfigTransformService'
import PropTypes from 'prop-types'
import React from 'react'
import Spinner from "react-spinkit"
import TopNav from './topNav'
import UltimatePaginationBootstrap3 from './BootstrapPaginate'
import WMSService from '@boundlessgeo/sdk/services/WMSService'
import { connect } from 'react-redux';
import ol from 'openlayers'
import { viewStore } from '../store/stores'

const image = new ol.style.Circle( {
    radius: 5,
    fill: null,
    stroke: new ol.style.Stroke( { color: 'black', width: 2 } )
} )
const styles = {
    'Point': new ol.style.Style( { image: image } ),
    'LineString': new ol.style.Style( {
        stroke: new ol.style.Stroke( { color: 'green', width: 1 } )
    } ),
    'MultiLineString': new ol.style.Style( {
        stroke: new ol.style.Stroke( { color: 'green', width: 1 } )
    } ),
    'MultiPoint': new ol.style.Style( { image: image } ),
    'MultiPolygon': new ol.style.Style( {
        stroke: new ol.style.Stroke( { color: 'yellow', width: 1 } ),
        fill: new ol.style.Fill( { color: 'rgba(255, 255, 0, 0.1)' } )
    } ),
    'Polygon': new ol.style.Style( {
        stroke: new ol.style.Stroke( {
            color: 'blue',
            lineDash: [
                4 ],
            width: 3
        } ),
        fill: new ol.style.Fill( { color: 'rgba(0, 0, 255, 0.1)' } )
    } ),
    'GeometryCollection': new ol.style.Style( {
        stroke: new ol.style.Stroke( { color: 'magenta', width: 2 } ),
        fill: new ol.style.Fill( { color: 'magenta' } ),
        image: new ol.style.Circle( {
            radius: 10,
            fill: null,
            stroke: new ol.style.Stroke( { color: 'magenta' } )
        } )
    } ),
    'Circle': new ol.style.Style( {
        stroke: new ol.style.Stroke( { color: 'red', width: 2 } ),
        fill: new ol.style.Fill( { color: 'rgba(255,0,0,0.2)' } )
    } )
}
const styleFunction = ( feature ) => {
    return styles[ feature.getGeometry( ).getType( ) ]
}
const isWMSLayer = ( layer ) => {
    return layer.getSource( ) instanceof ol.source.TileWMS || layer.getSource( ) instanceof ol
        .source.ImageWMS
}
const getWMSLayer = ( name, layers ) => {
    var wmsLayer = null
    layers.forEach( ( layer ) => {
        if ( layer instanceof ol.layer.Group ) {
            wmsLayer = getWMSLayer( name, layer.getLayers( ) )
        } else if ( isWMSLayer( layer ) && layer.getSource( ).getParams( )
            .LAYERS == name ) {
            wmsLayer = layer
        }
        if ( wmsLayer ) {
            return false
        }
    } )
    return wmsLayer
}
class FeatureList extends React.Component {
    constructor( props ) {
        super( props )
        this.state = {
            perPage: parseInt( this.props.pagination ),
            currentPage: 1,
            selectionLayerAdded: false,
            config: { mapId: this.props.mapId }
        }
        this.map = viewStore.getState( ).map
        this.featureCollection = new ol.Collection( )
        this.selectLayer = new ol.layer.Vector( {
            source: new ol.source.Vector( { features: this.featureCollection } ),
            style: styleFunction,
            title: "Selected Features",
            zIndex: 10000,
            format: new ol.format.GeoJSON( {
                defaultDataProjection: this.map.getView( )
                    .getProjection( ),
                featureProjection: this.map.getView( )
                    .getProjection( )
            } )
        } )
        this.layerSelectedInfo = this.props.layer.split( ":" )
        this.selectedLayerName = this.layerSelectedInfo[ 1 ]
        this.selectedLayerNameSpace = this.layerSelectedInfo[ 0 ]
    }
    init( map ) {
        map.on( 'singleclick', ( e ) => {
            document.body.style.cursor = "progress"
            WMSService.getFeatureInfo( getWMSLayer( this.props
                    .layer, map.getLayers( ).getArray( ) ),
                e.coordinate, map, 'application/json', (
                    result ) => {
                    if ( result.features.length == 1 ) {
                        result.features[ 0 ].getGeometry( )
                            .transform( 'EPSG:4326', this.map
                                .getView( ).getProjection( )
                            )
                        this.zoomToFeature( result.features[
                            0 ] )
                        this.props.setSelectedFeatures(
                            result.features )
                        this.props.setSelectMode( true )
                    } else if ( result.features.length > 1 ) {
                        let transformedFeatures = [ ]
                        result.features.forEach( ( feature ) => {
                            feature.getGeometry( )
                                .transform(
                                    'EPSG:4326',
                                    this.map.getView( )
                                    .getProjection( )
                                )
                            transformedFeatures.push(
                                feature )
                        } )
                        this.setState( {
                            selectedFeatures: transformedFeatures,
                            selectMode: true
                        } )
                    }
                    document.body.style.cursor = "default"
                } )
        } )
    }
    updateMap( config ) {
        if ( config && config.mapId ) {
            var url = getMapConfigUrl( this.props.mapId );
            fetch( url, {
                method: "GET",
                credentials: 'include'
            } ).then( ( response ) => {
                if ( response.status == 200 ) {
                    return response.json( );
                }
            } ).then( ( config ) => {
                if ( config ) {
                    MapConfigService.load(
                        MapConfigTransformService.transform(
                            config ), this.map )
                }
            } )
        }
    }
    getLayers( layers ) {
        var children = [ ]
        layers.forEach( ( layer ) => {
            if ( layer instanceof ol.layer.Group ) {
                children = children.concat( this.getLayers(
                    layer.getLayers( ) ) )
            } else if ( layer.getVisible( ) && isWMSLayer(
                    layer ) ) {
                children.push( layer )
            }
        } )
        return children
    }
    startSearch = ( ) => {
        this.refs.search.value = ""
        this.props.setSearchMode( false )
    }
    backToList( ) {
        this.featureCollection.clear( )
        this.props.setSelectMode( false )
    }
    zoomToFeature( feature ) {
        if ( !this.state.selectionLayerAdded ) {
            this.map.addLayer( this.selectLayer )
            this.setState( { selectionLayerAdded: true } )
        }
        this.props.setSelectMode( true )
        this.props.setSelectedFeatures( [ feature ] )
        this.featureCollection.clear( )
        this.featureCollection.push( feature )
        this.map.getView( ).fit( feature.getGeometry( ).getExtent( ),
            this.map.getSize( ), { duration: 10000 } )
    }
    componentDidMount( ) {
        this.init( this.map )
    }
    layerName( ) {
        return this.props.layer.split( ":" ).pop( )
    }
    loadfeatures = ( ) => {
        this.props.getFeatures( "/geoserver/", this.props.layer,
            parseInt( this.props.pagination ), this.state.perPage *
            ( this.state.currentPage - 1 ) )
    }
    componentWillMount( ) {
        this.loadfeatures( )
        this.props.loadAttachments( this.layerName( ) )
        this.updateMap( this.state.config )
    }
    render( ) {
        let {
            featureIsLoading,
            features,
            filters,
            searchResultIsLoading,
            searchResult,
            searchTotalFeatures,
            totalFeatures,
            attachmentFilesIsLoading,
            selectMode,
            searchMode,
            selectedFeatures
        } = this.props
        return (
            <div className="container-fluid">
                <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />

                <TopNav currentComponent="List" toggleComponent={x => this.props.toggleComponent(x)} />
                {!selectMode && <div style={{ margin: 10 }} className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="input-group">
                        <input ref="search" type="text" className="form-control" placeholder="Search" required />
                        <span className="input-group-btn">
                            <a href="javascript:;" onClick={() => this.props.search(undefined, this.refs.search.value, this.props.layer.split(":")[0], this.layerName(), filters.value)}
                                className="btn btn-default">
                                <i className="fa fa-search" aria-hidden="true"></i></a>
                            <a href="javascript:;" onClick={() => this.startSearch()} 
                                className="btn btn-default"><i className="fa fa-times" aria-hidden="true"></i></a>
                        </span>
                    </div>
                </div>
                }

                {(featureIsLoading || attachmentFilesIsLoading || searchResultIsLoading) && <div style={{ textAlign: "center" }} className="col-xs-12 col-sm-12 col-md-12"><Spinner className="loading-center" name="line-scale-party" color="steelblue" /></div>}
                {!(featureIsLoading || attachmentFilesIsLoading) && !searchMode && !selectMode && totalFeatures > 0 && features.map((feature, i) => {
                    return <FeatureListItem onClick={() => this.zoomToFeature.bind(this, feature)} titleAttribute={this.props.titleAttribute} subtitleAttribute={this.props.subtitleAttribute} key={i} feature={feature} />
                })}
                {!(searchResultIsLoading) && searchMode && !selectMode && totalFeatures > 0 && searchResult.map((feature, i) => {
                    return <FeatureListItem onClick={() => this.zoomToFeature.bind(this, feature)} titleAttribute={this.props.titleAttribute} subtitleAttribute={this.props.subtitleAttribute} key={i} feature={feature} />
                })}
                {!(featureIsLoading || attachmentFilesIsLoading) && !searchResultIsLoading && !selectMode && searchMode && searchTotalFeatures == 0 && <div className="text-center">
                    <h3>No Features Found</h3>
                </div>}

                {!(featureIsLoading || attachmentFilesIsLoading) && !searchMode &&!selectMode && totalFeatures > 0 && <div style={{ textAlign: "center" }} className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-md-offset-3"><UltimatePaginationBootstrap3
                    totalPages={Math.ceil(totalFeatures / this.state.perPage)}
                    currentPage={this.state.currentPage}
                    onChange={number => this.setState({ currentPage: number }, this.loadfeatures)} /></div>}
                {!(featureIsLoading || attachmentFilesIsLoading) && selectMode && selectedFeatures.length == 1 && <div className="col-xs-12 col-sm-12 col-md-12">

                    <button type="button" onClick={
                        this.backToList.bind(this)
                    } className="btn btn-primary pull-right"><i className="fa fa-arrow-left" aria-hidden="true"></i>  Back</button>

                </div>}
                {!(featureIsLoading || attachmentFilesIsLoading) && selectMode && selectedFeatures.length == 1 &&
                    <ItemDetails />
                }
                <div style={{ height: 400, display: selectMode ? "block" : "none" }}>
                    <FeatureListMap map={this.map} display={selectMode ? true : false} mapRef="fmap" {...this.props}></FeatureListMap>
                </div>
            </div>
        )
    }
}
FeatureList.propTypes = {
    layer: PropTypes.string.isRequired,
    geoserverUrl: PropTypes.string.isRequired,
    subtitleAttribute: PropTypes.string.isRequired,
    titleAttribute: PropTypes.string.isRequired,
    featureIsLoading: PropTypes.bool.isRequired,
    features: PropTypes.array.isRequired,
    filters: PropTypes.object.isRequired,
    searchResultIsLoading: PropTypes.bool.isRequired,
    searchResult: PropTypes.array.isRequired,
    searchTotalFeatures: PropTypes.number.isRequired,
    totalFeatures: PropTypes.number.isRequired,
    attachmentFilesIsLoading: PropTypes.bool.isRequired,
    selectMode: PropTypes.bool.isRequired,
    getFeatures: PropTypes.func.isRequired,
    loadAttachments: PropTypes.func.isRequired,
    setSelectedFeatures: PropTypes.func.isRequired,
    setSelectMode: PropTypes.func.isRequired,
    searchMode: PropTypes.bool.isRequired,
    setSearchMode: PropTypes.func.isRequired,
    selectedFeatures: PropTypes.array.isRequired
}
const mapStateToProps = ( state ) => {
    return {
        features: state.features,
        featureIsLoading: state.featureIsLoading,
        totalFeatures: state.totalFeatures,
        map: state.map,
        searchMode: state.searchMode,
        searchResult: state.searchResult,
        searchResultIsLoading: state.searchResultIsLoading,
        searchTotalFeatures: state.searchTotalFeatures,
        attachmentFilesIsLoading: state.attachmentFilesIsLoading,
        selectedFeatures: state.selectedFeatures,
        selectMode: state.selectMode
    }
}
const mapDispatchToProps = ( dispatch ) => {
    return {
        getFeatures: ( url, typeName, count, startIndex ) => dispatch(
            getFeatures( url = "/geoserver/", typeName, count,
                startIndex ) ),
        search: ( url, text, layerNameSpace, selectedLayerName, property ) =>
            dispatch( search( url, text, layerNameSpace, selectedLayerName,
                property ) ),
        loadAttachments: ( selectedLayerName ) => dispatch(
            loadAttachments( selectedLayerName ) ),
        setSelectedFeatures: ( features ) => dispatch( selectedFeatures(
            features ) ),
        setSelectMode: ( bool ) => dispatch( selectMode( bool ) ),
        setSearchMode: ( bool ) => dispatch( searchMode( bool ) )
    }
}
export default connect( mapStateToProps, mapDispatchToProps )( FeatureList )

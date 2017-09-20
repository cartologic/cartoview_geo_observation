import GeoCollect from './components/GeoCollect'
import { Provider } from 'react-redux'
import React from 'react'
import { getCRSFToken } from './helpers/helpers.jsx'
import { render } from 'react-dom'
import { viewStore } from './store/stores'
class GeoObservationViewer {
    constructor( domId, username, urls, instanceId ) {
        this.domId = domId
        this.urls = urls
        this.username = username
        this.instanceId = instanceId
    }
    loadConfig( ) {
        return fetch( this.urls.appInstance, {
            method: 'GET',
            credentials: "same-origin",
            headers: new Headers( {
                "Content-Type": "application/json; charset=UTF-8",
                "X-CSRFToken": getCRSFToken( )
            } )
        } ).then( ( response ) => response.json( ) )
    }
    view( ) {
        this.loadConfig( ).then( ( res ) => {
            this.config = {
                config: res.config,
                title: res.title,
                abstract: res.abstract,
                map: res.map
            }
            render(
                <Provider store={viewStore}>
                    <GeoCollect config={this.config} username={this.username} urls={this.urls} instanceId={this.instanceId}/>
                </Provider>,
                document.getElementById( this.domId ) )
        } )
    }
}
global.GeoObservationViewer = GeoObservationViewer

import { findDOMNode, render } from 'react-dom'

import React from 'react'

export default class FeatureListMap extends React.Component {
    constructor( props ) {
        super( props )
        this.state = {
            config: {
                mapId: this.props.mapId
            }
        }
        this.map = this.props.map
    }
    componentDidMount(){
        this.map.setTarget( this.mapDiv )
        this.map.updateSize( )
    }
    componentWillReceiveProps( nextProps ) {
        this.map.updateSize( )
    }
    render( ) {
        return (
            <div>
                <h4>Switch between Features by clicking on Features in Map</h4> 
                <div style={{ width: "100%", height: "400px" }} ref={(mapDiv)=>this.mapDiv=mapDiv}></div>
            </div>
        )
    }
}

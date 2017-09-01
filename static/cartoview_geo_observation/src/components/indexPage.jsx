import React, { Component } from 'react'

import FeatureList from './FeatureList.jsx'
import GeoCollect from '../GeoCollect'
import Img from 'react-image'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom'
import Spinner from "react-spinkit"
import { connect } from 'react-redux';
import {features} from '../actions/features';
import { getFeatures } from '../actions/features';
import noImage from '../img/no-img.png'
import {store} from '../store/configureStore'

class IndexPage extends Component {
    constructor( props ) {
        super( props )
        this.state = {
            currentComponent: "Index"
        }
    }
    toggleComponent = ( component ) => {
        this.setState( { currentComponent: component } )
    }
    componentDidMount( ) {
        this.props.getFeatures("")
    }
    render( ) {
        console.log(this.props,store.getState())
        let {
            title,
            logo
        } = this.props
        let { currentComponent } = this.state
        return (
            <div className="container-fluid" style={{ paddingBottom: 50, paddingTop: 50 }}>
                {currentComponent === "Index" && <div>
                    <div className="row">
                        <div>
                            <div className=" col-xs-9 col-sm-9 col-md-9">
                                <span className="navbar-text h3" id="info-title" style={{ color: "#191919" }} >{title}</span>
                            </div>
                            <div className="col-xs-3 col-sm-3 col-md-3">
                                <Img
                                    src={[
                                        logo.base64,
                                        "/static/cartoview_geo_observation/logo.png",
                                        noImage
                                    ]}
                                    style={{ maxHeight: 60, margin: 0 }}
                                    loader={<Spinner className="loading-center" name="line-scale-party" color="steelblue" />}
                                    className="img-thumbnail navbar-text navbar-right"
                                />
                            </div>

                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12">
                            <div className="list-group">
                                <a onClick={()=> this.toggleComponent("List")} href="javascript:;" className="list-group-item"><i className="fa fa-list" aria-hidden="true"></i> List</a>
                                {/* <a onClick={()=> this.toggleComponent("Map")} href="javascript:;" className="list-group-item"><i className="fa fa-map" aria-hidden="true"></i> Map</a> */}
                                <a onClick={()=> this.toggleComponent("GeoCollect")} href="javascript:;" className="list-group-item"><i className="fa fa-plus-circle" aria-hidden="true"></i>  New Observation</a>
                                <a href={`/apps/appinstances/?app__title=GeoObservation`} className="list-group-item"><i className="fa fa-globe" aria-hidden="true"></i> Other Observations</a>
                            </div>
                        </div>

                    </div>
                </div>}
                {currentComponent==="List" && <FeatureList toggleComponent={this.toggleComponent} {...this.props.configProps} />}
                {currentComponent==="GeoCollect" && <GeoCollect toggleComponent={this.toggleComponent} {...this.props.configProps} />}
            </div>
        )
    }
}
IndexPage.propTypes = {
    title: PropTypes.string.isRequired,
    logo: PropTypes.object.isRequired,
    description: PropTypes.string.isRequired
}
const mapStateToProps = (state) => {
    return {
        features: state.features,
        isLoading: state.featuresIsLoading
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getFeatures: (url) => dispatch(getFeatures("/geoserver","geonode:nyc_rat_sighting_2016",20,0))
    }
}
const Basic = connect(mapStateToProps, mapDispatchToProps)(IndexPage)
global.GeoObservation = {
    show: ( el, props ) => {
        ReactDOM.render(
            <Provider store={store}>
            <Basic configProps={props} description={props.formAbstract} logo={props.logo} title={props.formTitle} /></Provider>,
            document.getElementById( el ) )
    }
}

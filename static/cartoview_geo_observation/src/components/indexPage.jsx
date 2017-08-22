import React, { Component } from 'react'

import Img from 'react-image'
import PropTypes from 'prop-types'
import Spinner from "react-spinkit"
import noImage from '../img/no-img.png'

export default class IndexPage extends Component {
    constructor(props) {
        super(props)

    }
    componentDidMount() {

    }
    render() {
        let {
            title,
            description,
            logo
        } = this.props
        return (
            <div style={{ paddingBottom: 50, paddingTop: 50 }}>
                <nav className="navbar navbar-default" style={{ backgroundColor: 'rgb(255, 255, 255)', borderColor: 'transparent' }}>
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <span className="navbar-text h3" id="info-title" style={{ color: "#191919" }} >{title}</span>
                        </div>
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
                </nav>
                <hr/>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12">
                        <div className="list-group">
                            <a href="#" className="list-group-item">List</a>
                            <a href="#" className="list-group-item">Map</a>
                            <a href="#" className="list-group-item">New Observation</a>
                            <a href="#" className="list-group-item">Other Observation</a>
                        </div>
                    </div>

                </div>

            </div>
        )
    }
}
IndexPage.propTypes = {
    title: PropTypes.string.isRequired,
    logo: PropTypes.object.isRequired,
    description: PropTypes.string.isRequired
}

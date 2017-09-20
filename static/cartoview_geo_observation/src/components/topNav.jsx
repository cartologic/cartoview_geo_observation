import React, { Component } from 'react'

import PropTypes from 'prop-types'

export default class TopNav extends Component {
    constructor( props ) {
        super( props )
        this.navBills = {
            featureList: <li key={"list"} onClick={() => this.props.toggleComponent("featureList")} role="presentation"><a href="javascript:;"><i className="fa fa-list" aria-hidden="true"></i> List</a></li>,
            // Map: <li key={"map"} onClick={() => this.props.toggleComponent("Map")} role="presentation"><a href="javascript:;"><i className="fa fa-map" aria-hidden="true"></i> Map</a></li>,
            geoCollect: <li key={"geoCollect"} onClick={() => this.props.toggleComponent("geoCollect")} role="presentation"><a href="javascript:;"><i className="fa fa-plus-circle" aria-hidden="true"></i>  New Observation</a></li>
        }
    }
    render( ) {
        return (
            <div>
                <ul className="nav nav-pills nav-justified">
                    {Object.keys(this.navBills).map((navKey, i) => {
                        if (navKey !== this.props.currentComponent) {
                            return this.navBills[navKey]
                        }
                    })}
                </ul>
                <hr />
            </div>
        )
    }
}
TopNav.propTypes = {
    toggleComponent: PropTypes.func.isRequired,
    currentComponent: PropTypes.string.isRequired
}

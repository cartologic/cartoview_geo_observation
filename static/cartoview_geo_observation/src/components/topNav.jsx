import React, { Component } from 'react'

import PropTypes from 'prop-types'

export default class TopNav extends Component {
    constructor(props) {
        super(props)
        this.navBills = {
            Home: <li key={"home"} onClick={() => this.props.toggleComponent("Index")} role="presentation"><a href="javascript:;"><i className="fa fa-home" aria-hidden="true"></i> Home</a></li>,
            List: <li key={"list"} onClick={() => this.props.toggleComponent("List")} role="presentation"><a href="javascript:;"><i className="fa fa-list" aria-hidden="true"></i> List</a></li>,
            // Map: <li key={"map"} onClick={() => this.props.toggleComponent("Map")} role="presentation"><a href="javascript:;"><i className="fa fa-map" aria-hidden="true"></i> Map</a></li>,
            GeoCollect: <li key={"geocollect"} onClick={() => this.props.toggleComponent("GeoCollect")} role="presentation"><a href="javascript:;"><i className="fa fa-plus-circle" aria-hidden="true"></i>  New Observation</a></li>
        }
    }
    render() {
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

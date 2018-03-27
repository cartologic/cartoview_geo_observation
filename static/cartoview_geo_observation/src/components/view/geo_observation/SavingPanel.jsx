import React, { Component } from 'react'

import PropTypes from 'prop-types'
import Spinner from 'react-spinkit'

export default class SavingPanel extends Component {
    constructor(props) {
        super(props)
    }
    showMessage = (message, type = "error") => {
    }
    render() {
        let { saving, urls, extraClasses } = this.props
        return <div className={`text-center ${extraClasses}`}>
            {saving && <Spinner name="line-scale-pulse-out" color="steelblue" />}
            {!saving && <div>
                <div className="alert alert-success" role="alert">{'Your Data Saved Successfully'}</div>
                <a href={urls.viewURL} className="btn btn-lg btn-success">{"Add New Entry"}</a>
            </div>}
        </div>

    }
}
SavingPanel.propTypes = {
    saving: PropTypes.bool.isRequired,
    urls: PropTypes.object.isRequired,
    extraClasses: PropTypes.string,
}

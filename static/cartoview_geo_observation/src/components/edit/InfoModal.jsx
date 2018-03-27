import React, { Component } from 'react'

import PropTypes from 'prop-types'

export default class InfoModal extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        $(this.modal).modal('show')
        $(this.modal).on('hidden.bs.modal', this.props.handleHideModal)
    }
    render() {
        return (
            <div ref={(modalRef) => this.modal = modalRef} className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title">{"Cartoview BasicViewer"}</h4>
                        </div>
                        <div className="modal-body">
                            <p>
                                {"General purpose map viewer with only the essential compoonents for navigation and display. Optimized for mobile. Using Openlayers 3 and Boundless SDK"}
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
InfoModal.propTypes = {
    handleHideModal: PropTypes.func.isRequired,
}

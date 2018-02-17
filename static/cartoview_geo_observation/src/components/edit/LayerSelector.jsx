import React, { Component } from 'react'
import { layerSelectFormSchema } from 'Source/containers/forms'
import PropTypes from 'prop-types'
import { getPropertyFromConfig } from 'Source/containers/staticMethods'
import t from 'tcomb-form'

const Form = t.form.Form

export default class LayerSelector extends Component {
    constructor(props) {
        super(props)
        const { config } = this.props
        this.state = {
            value: {
                layer: getPropertyFromConfig(config, 'layer', null)
            }
        }

    }
    getLayerOptions = () => {
        const { mapLayers } = this.props
        let options = []
        if (mapLayers && mapLayers.length > 0) {
            options = mapLayers.map(layer => {
                return { value: layer.typename, text: layer.name }
            })
        }
        return options
    }
    getFormOptions = () => {
        const options = {
            fields: {
                layer: {
                    factory: t.form.Select,
                    nullOption: { value: '', text: 'Choose Layer' },
                    options: this.getLayerOptions()
                },
            }
        }
        return options
    }
    getComponentValue = () => {
        const value = this.form.getValue()
        return value
    }
    componentWillReceiveProps(nextProps) {
        const { selectedMap, config, instanceId } = this.props
        if (((selectedMap !== nextProps.selectedMap) || config) && !instanceId) {
            this.setState({ value: this.getFormValue(nextProps) })
        }
    }
    getFormValue = (props) => {
        const { config } =
            props
        const value = {
            layer: getPropertyFromConfig(config, 'layer', null),
        }
        return value
    }
    onChange = (newValue) => {
        this.setState({ value: newValue }, () => {
            const { getFeatureTypes } = this.props
            if (newValue.layer) {
                getFeatureTypes(newValue.layer)
            }

        })
    }
    render() {
        const { mapLayers, loading } = this.props
        return (
            <div>
                <h3>{"Select Layer"}</h3>
                <Form
                    ref={(form) => this.form = form}
                    value={this.state.value}
                    type={layerSelectFormSchema()}
                    onChange={this.onChange}
                    options={this.getFormOptions()} />
                {mapLayers.length == 0 && !loading && <b>{"No Point Layers In this Map Please Select a Map With Point Layer"}</b>}
            </div>
        )
    }
}
LayerSelector.propTypes = {
    config: PropTypes.object,
    mapLayers: PropTypes.array.isRequired,
    getFeatureTypes: PropTypes.func.isRequired
}

import 'react-select/dist/react-select.css'

import { Loader } from './MapSelector'
import PropTypes from 'prop-types'
import React from 'react'
import { listConfigFormSchema } from 'Source/forms/forms'
import t from 'tcomb-form'

const Form = t.form.Form
export const getPropertyFromConfig = (config, property, defaultValue) => {
    const propertyValue = config && typeof (config[property]) !==
        "undefined" ? config[property] : defaultValue
    const nestedPropertyValue = config && config.config && typeof (config
        .config[property]) !== "undefined" ? config.config[
        property] : propertyValue
    return nestedPropertyValue
}
export default class FeatureListConfig extends React.Component {
    constructor(props) {
        super(props)
        const { config } = this.props
        this.state = {
            value: this.getFormValue(config)
        }
    }
    getFormValue = (config) => {
        const value = {
            layer: getPropertyFromConfig(config, 'layer', null),
            titleAttribute: getPropertyFromConfig(config,
                'titleAttribute', null),
            subtitleAttribute: getPropertyFromConfig(config,
                'subtitleAttribute', null),
            pagination: getPropertyFromConfig(config,
                'pagination', "10"),
            filters: getPropertyFromConfig(config, 'filters',
                null),
            zoomOnSelect: getPropertyFromConfig(config,
                'zoomOnSelect', true),
            enableImageListView: getPropertyFromConfig(config,
                'enableImageListView', true)
        }
        return value
    }
    componentWillReceiveProps(nextProps) {
        const { layerAttributes, config } = this.props
        if (nextProps.layerAttributes !== layerAttributes) {
            this.setState({ value: this.getFormValue(nextProps.config) })
        }
        if (nextProps.config !== config) {
            this.setState({ value: this.getFormValue(nextProps.config) })
        }
    }
    getComponentValue = () => {
        const value = this.form.getValue()
        if (value) {
            this.setState({ value })
        }
        return value
    }
    getAttributesOptions = (attributes) => {
        let options = []
        attributes.forEach((attribute) => {
            if (attribute.attribute_type.indexOf("gml:") ==
                -1) {
                options.push({
                    value: attribute.attribute,
                    text: attribute.attribute
                })
            }
        })
        return options
    }
    onChange = (newValue) => {
        this.setState({ value: newValue })
    }
    getFormOptions = () => {
        const { layerAttributes } = this.props
        const attributeOptions = this.getAttributesOptions(
            layerAttributes)
        const options = {
            fields: {
                titleAttribute: {
                    factory: t.form.Select,
                    nullOption: { value: '', text: 'Choose Title Attribute' },
                    options: attributeOptions
                },
                subtitleAttribute: {
                    label: "Subtitle Attribute (optional)",
                    factory: t.form.Select,
                    nullOption: { value: '', text: 'Choose subTitle Attribute' },
                    options: attributeOptions
                },
                filters: {
                    factory: t.form.Select,
                    nullOption: { value: '', text: 'Choose Search Attribute' },
                    options: attributeOptions
                },
                pagination: {
                    factory: t.form.Select,
                    nullOption: { value: '', text: 'Choose number of Features' },
                    options: [
                        { value: '10', text: "10" },
                        { value: '20', text: "20" },
                        { value: '40', text: "40" },
                        { value: '80', text: "80" }
                    ]
                }
            }
        }
        return options
    }
    render() {
        const { loading } = this.props
        let { value } = this.state
        return (
            <div>
                <h3>{"Feature List Configuration"}</h3>
                {loading && <Loader />}
                {!loading && <Form
                    ref={(form) => this.form = form}
                    type={listConfigFormSchema()}
                    value={value}
                    onChange={this.onChange}
                    options={this.getFormOptions()} />}

            </div>
        )
    }
}
FeatureListConfig.propTypes = {
    layerAttributes: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    config: PropTypes.object
}

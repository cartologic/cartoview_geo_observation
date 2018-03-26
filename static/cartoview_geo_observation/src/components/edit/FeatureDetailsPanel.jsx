import 'react-select/dist/react-select.css'

import {
    getAttributesTemplate,
    getKeywordsTemplate
} from './AutoCompleteInput'

import { Loader } from './MapSelector'
import PropTypes from 'prop-types'
import React from 'react'
import { featureDetailsFormSchema } from 'Source/forms/forms'
import { getPropertyFromConfig } from 'Source/utils/utils'
import t from 'tcomb-form'

const Form = t.form.Form
export default class FeatureDetailsPanel extends React.Component {
    constructor(props) {
        super(props)
        const { config } = this.props
        this.state = {
            value: this.getFormValue(config)
        }
    }
    getTagsOptions = (input, callback) => {
        const { tags } = this.props
        let options = []
        tags.forEach(tag => {
            options.push({
                label: tag.tag,
                value: tag.tag,
            })
        })
        callback(null, {
            options,
            complete: true
        })
    }
    tagsToOptions = (tags) => {
        let options = []
        tags.map(tag => {
            options.push({ value: tag, label: tag })
        })
        return options
    }
    getFormValue = (config) => {
        const value = {
            attachmentTags: this.tagsToOptions(
                getPropertyFromConfig(config,
                    'attachmentTags', [])),
            attributesToDisplay: this.tagsToOptions(
                getPropertyFromConfig(config,
                    'attributesToDisplay', [])),
            showNumberOfComments: getPropertyFromConfig(config,
                'showNumberOfComments', true),
            showNumberOfViews: getPropertyFromConfig(config,
                'showNumberOfViews', true),
            showFeatureOwner: getPropertyFromConfig(config,
                'showFeatureOwner', true),
            showStarRating: getPropertyFromConfig(config,
                'showStarRating', true),
        }
        return value
    }
    componentWillReceiveProps(nextProps) {
        const { config } = this.props
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
    onChange = (newValue) => {
        this.setState({ value: newValue })
    }
    getMultiSelectAttributesOptions = (attributes) => {
        let options = []
        attributes.forEach((attribute) => {
            if (attribute.type.indexOf("gml:") ==
                -1) {
                options.push({
                    value: attribute.name,
                    label: attribute.name
                })
            }
        })
        return options
    }
    getFormOptions = () => {
        const { layerAttributes } = this.props
        const multiSelectAttributesOptions = this.getMultiSelectAttributesOptions(
            layerAttributes)
        const options = {
            fields: {
                attachmentTags: {
                    factory: t.form.Textbox,
                    template: getKeywordsTemplate({
                        loadOptions: this.getTagsOptions,
                        message: "Select or Enter a Tag",
                        help: <i>{"Tags Associated with Uploaded Attachments "}</i>
                    }),

                },
                attributesToDisplay: {
                    factory: t.form.Textbox,
                    template: getAttributesTemplate({
                        options: multiSelectAttributesOptions,
                        message: "Select Attributes you want to Display",
                        help: <i>{"Attributes to be displayed in Feature Details Panel"}</i>
                    })
                },
            }
        }
        return options
    }
    render() {
        const { loading } = this.props
        let { value } = this.state
        return (
            <div>
                <h3>{"Feature Details  Configuration"}</h3>
                {loading && <Loader />}
                {!loading && <Form
                    ref={(form) => this.form = form}
                    type={featureDetailsFormSchema()}
                    value={value}
                    onChange={this.onChange}
                    options={this.getFormOptions()} />}

            </div>
        )
    }
}
FeatureDetailsPanel.propTypes = {
    layerAttributes: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    config: PropTypes.object,
    tags: PropTypes.array.isRequired
}
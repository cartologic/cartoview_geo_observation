import React, { Component } from 'react'

import FieldConfigModal from "Source/components/edit/FieldConfigModal"
import { Loader } from 'Source/components/edit/CommonComponents'
import PropTypes from "prop-types"
import { getPropertyFromConfig } from 'Source/utils/utils'
import t from 'tcomb-form'
import update from 'immutability-helper'

const initialTypeMapping = {
    string: "text",
    double: "number",
    int: "number",
    long: "number",
    boolean: "checkbox",
    datetime: "datetime"
}
const Options = t.struct({
    label: t.String,
    value: t.String
})
export default class FormFields extends Component {
    constructor(props) {
        super(props)
        const { config, attributes } = this.props
        this.state = {
            attributes: getPropertyFromConfig(config, 'attributes', []),
            geometryName: null,
            showModal: false,
            attribute: null,
            buildingForm: false,
            fieldList: [],
            fieldConfig: null,
            defaultValue: null,
            currentId: null,
            formFieldOptions: null
        }
    }
    getComponentValue = () => {
        const { attributes, geometryName } = this.state

        return { attributes, geometryName }
    }
    init = (layerAttributes) => {
        let attributes = []
        this.setState({ buildingForm: true })
        layerAttributes.map((attribute) => {
            if (attribute.type.indexOf("gml") == 0) {
                this.setState({ geometryName: attribute.name })
                return
            }
            let dataType = this.getDataType(attribute)
            attributes.push({
                included: true,
                name: attribute.name,
                label: attribute.name ,
                placeholder: attribute.name,
                helpText: "",
                required: !attribute.nillable,
                defaultValue: null,
                options: [],
                dataType: dataType,
                fieldType: initialTypeMapping[dataType] ||
                    "text"
            })
        })
        this.setState({ attributes: attributes, buildingForm: false })
    }
    setup = (layerAttributes) => {
        const { featureTypes } = this.props
        if (this.state.attributes.length == 0 && featureTypes && featureTypes.length > 0) {
            this.init(layerAttributes)
        }
    }
    componentWillMount() {
        const { layerAttributes } = this.props
        this.setup(layerAttributes)
    }
    getDataType = (attribute) => {
        return attribute.type.split(":").pop().toLowerCase()
    }
    searchById = (id) => {
        let result = this.state.attributes.find((attribute) => {
            return attribute.id === id
        })
        return result
    }
    getFieldList(fieldType) {
        let fieldList = null
        switch (fieldType) {
            case "text":
                fieldList = t.enums({
                    text: 'Text',
                    textarea: 'Multi-line Text',
                    select: "Drop Down List",
                    checkboxList: "Checkbox List",
                    radioList: "Radio Button List"
                })
                break
            case "number":
                fieldList = t.enums({
                    number: "Number",
                    chekbox: "Checkbox",
                    select: "Drop Down List",
                    radioList: "Radio Button List"
                })
                break
            case "boolean":
                fieldList = t.enums({ chekbox: "Checkbox" })
                break
            case "datatime":
                fieldList = t.enums({
                    text: 'Text',
                    textarea: 'Multi-line Text',
                    number: "Number",
                    chekbox: "Checkbox",
                    select: "Drop Down List",
                    checkboxList: "Checkbox List",
                    radioList: "Radio Button List",
                    datatime: "Date"
                })
                break
        }
        return fieldList
    }
    componentWillReceiveProps(nextProps) {
        const { layerAttributes, featureTypes } = this.props
        if ((layerAttributes !== nextProps.layerAttributes) || (featureTypes !== nextProps.featureTypes)) {
            this.setup(nextProps.layerAttributes)
        }
    }
    generateForm = (attribute) => {
        let fieldList = this.getFieldList(attribute.fieldType) || this.getFieldList(
            initialTypeMapping[attribute.dataType] || "text")
        const fieldConfig = t.struct({
            name: t.String,
            dataType: t.String,
            label: t.String,
            placeholder: t.String,
            helpText: t.maybe(t.String),
            required: t.Boolean,
            defaultValue: t.maybe(t.String),
            fieldType: fieldList,
            options: t.list(Options)
        })
        const defaultValue = {
            name: attribute.name,
            dataType: attribute.dataType,
            label: attribute.label,
            options: attribute.options,
            fieldType: attribute.fieldType,
            placeholder: attribute.placeholder,
            helpText: attribute.helpText,
            required: attribute.required,
            defaultValue: attribute.defaultValue
        }
        const attributeDisabled = attribute.required ? {
            required: {
                disabled: true
            }
        } : {}
        const formFieldOptions = {
            fields: {
                name: {
                    disabled: true
                },
                dataType: {
                    disabled: true
                },
                fieldType: {
                    nullOption: {
                        value: '',
                        text: 'Choose Field Type'
                    }
                },
                id: {
                    type: 'hidden'
                },
                ...attributeDisabled
            }
        }
        this.setState({
            fieldConfig,
            defaultValue,
            formFieldOptions,
        })
    }
    updateAttribute = (attribute) => {
        let { attributes } = this.state
        let currentAtrribute = this.searchById(attribute.id)
        if (currentAtrribute) {
            const id = attributes.indexOf(currentAtrribute)
            let updatedObj = update(currentAtrribute, { $merge: attribute })
            attributes[id] = updatedObj
            this.setState({ attributes: attributes })
        }
    }
    includeChanged = (id) => {
        let { attributes } = this.state
        let currentAtrribute = this.searchById(id)
        attributes[attributes.indexOf(currentAtrribute)].included =
            this["attr_check_" + id].checked
        this.setState({ attributes: attributes })
    }
    openModal = (attribute) => {
        this.generateForm(attribute)
        this.setState({ showModal: true })
    }
    handleHideModal = () => {
        this.setState({ showModal: false })
    }
    checkNillable = (attributeName) => {
        const { featureTypes } = this.props
        let result = featureTypes.filter(attr => attr.name ===
            attributeName)
        let nillable = result.length > 0 ? result[0].nillable : true
        return nillable
    }
    render() {
        let {
            showModal,
            attributes,
            formFieldOptions,
            fieldConfig,
            defaultValue,
            buildingForm
        } = this.state
        const { featureTypes, loading } = this.props
        const { onComplete, onPrevious } = this.props
        return (
            <div>
                <h3>{"Form Builder"}</h3>
                <hr></hr>
                <div className="row">
                    {(loading || buildingForm) && <Loader />}
                    {!loading && !buildingForm && attributes.length > 0 && featureTypes && featureTypes.length > 0 && attributes.map((attribute, index) => {
                        return <div key={index} className="col-lg-6">
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <input
                                        defaultChecked={attribute.included}
                                        onChange={() => this.includeChanged(attribute.id)}
                                        ref={(checkRef) => this["attr_check_" + attribute.id] = checkRef}
                                        type="checkbox" disabled={this.checkNillable(attribute.name) ? false : true} />
                                </span>
                                <input type="text" value={attribute.label} className="form-control" disabled />
                                <span className="input-group-addon" id="basic-addon2">
                                    <i className="fa fa-cog" onClick={() => this.openModal(attribute)}></i>
                                </span>
                            </div>
                        </div>
                    })}
                    {!loading && !buildingForm && attributes.length == 0 && <div className="col-sm-12 text-center">
                        <h3 className={"text-danger"}>{"Please Select Layer First"}</h3>
                    </div>}
                    {showModal
                        ? <FieldConfigModal
                            options={formFieldOptions}
                            fieldConfig={fieldConfig}
                            defaultValue={defaultValue}
                            handleHideModal={this.handleHideModal} updateAttribute={this.updateAttribute} />
                        : null}
                </div>

            </div>
        )
    }
}
FormFields.propTypes = {
    config: PropTypes.object,
    layerAttributes: PropTypes.array,
    featureTypes: PropTypes.array,
}
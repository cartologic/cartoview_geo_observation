import PropTypes from 'prop-types'
import React from 'react'
import { generalFormSchema } from '../../containers/forms'
import {
    getKeywordsTemplate
} from './AutoCompleteInput'
import { getPropertyFromConfig } from '../../containers/staticMethods'
import t from 'tcomb-form'
const Form = t.form.Form
export default class AppConfiguration extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: this.getFormValue(this.props)
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        const { errors } = this.props
        if (nextProps.errors !== errors) {
            return false
        }
        return true
    }
    getKeywordsOptions = (input, callback) => {
        const { allKeywords } = this.props
        let keywordsOptions = []
        allKeywords.forEach(keyword => {
            keywordsOptions.push({
                label: keyword.name,
                value: keyword.name,
            })
        })
        callback(null, {
            options: keywordsOptions,
            complete: true
        })
    }
    getComponentValue = () => {
        const value = this.form.getValue()
        return value
    }
    componentWillReceiveProps(nextProps) {
        const { selectedMap, config,instanceId } = this.props
        if (((selectedMap !== nextProps.selectedMap) || config)&& !instanceId) {
            this.setState({ value: this.getFormValue(nextProps) })
        }
    }
    onChange = (newValue) => {
        this.setState({ value: newValue })
    }
    keywordsToOptions=(keywords)=>{
        let options=[]
        keywords.map(keyword=>{
            options.push({value:keyword,label:keyword})
        })
        return options
    }
    getFormValue = (props) => {
        const { title, selectedMap, abstract, config } =
            props
        const value = {
            title: title ? title : selectedMap ? selectedMap.title : null,
            abstract: abstract ? abstract : selectedMap ?
                selectedMap.abstract : null,
            keywords: this.keywordsToOptions(getPropertyFromConfig(config, 'keywords',[]))
        }
        return value
    }
    getFormOptions = () => {
        const options = {
            fields: {
                title: {
                    label: "App Title"
                },
                keywords: {
                    factory: t.form.Textbox,
                    template: getKeywordsTemplate({
                        loadOptions: this.getKeywordsOptions,
                        message: "Select or Enter a Keyword"
                    })
                }
            }
        }
        return options
    }
    render() {
        return (
            <div>
                <h3>{"General Configuration"}</h3>
                <Form
                    ref={(form) => this.form = form}
                    value={this.state.value}
                    type={generalFormSchema()}
                    onChange={this.onChange}
                    options={this.getFormOptions()} />
            </div>
        )
    }
}
AppConfiguration.propTypes = {
    allKeywords: PropTypes.array.isRequired,
    selectedMap: PropTypes.object,
    config: PropTypes.object,
    title: PropTypes.string,
    abstract: PropTypes.string,
    errors: PropTypes.array.isRequired,
    instanceId:PropTypes.number
}
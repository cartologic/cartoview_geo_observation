import { getPropertyFromConfig, getSelectOptions } from 'Source/containers/staticMethods'

import PropTypes from 'prop-types'
import React from 'react'
import { accessFormSchema } from 'Source/containers/forms'
import {
    getKeywordsTemplate
} from './AutoCompleteInput'
import t from 'tcomb-form'

const Form = t.form.Form
export default class AppAccess extends React.Component {
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
    flattenedUsers = (users) => {
        return users.map(obj => obj.value)
    }
    getFormValueForSaving = (value) => {
        let data = {}
        Object.keys(value).map(attr => {
            const attributeValue = value[attr]
            data[attr] = attributeValue ? this.flattenedUsers(attributeValue) : null
        })
        return data
    }
    getComponentValue = () => {
        let value = this.form.getValue()
        if (value) {
            value = this.getFormValueForSaving(value)
        }
        return value
    }
    onChange = (newValue) => {
        this.setState({ value: newValue })
    }
    getFormValue = (props) => {
        const { config } = props
        const viewAccess = getPropertyFromConfig(config ? config.access :
            null, 'whoCanView', null)
        const metadataAccess = getPropertyFromConfig(config ?
            config.access : null, 'whoCanChangeMetadata',
            null)
        const deleteAccess = getPropertyFromConfig(config ? config.access :
            null, 'whoCanDelete', null)
        const changeAccess = getPropertyFromConfig(
            config ? config.access : null,
            'whoCanChangeConfiguration', null)
        const value = {
            whoCanView: viewAccess ? getSelectOptions(viewAccess) : viewAccess,
            whoCanChangeMetadata: metadataAccess ? getSelectOptions(metadataAccess) : metadataAccess,
            whoCanDelete: deleteAccess ? getSelectOptions(deleteAccess) : deleteAccess,
            whoCanChangeConfiguration: changeAccess ? getSelectOptions(changeAccess) : changeAccess,
        }
        return value
    }
    getProfilesOptions = (input, callback) => {
        const { profiles, getProfiles } = this.props
        const profilesPromise = new Promise((resolve, reject) => {
            if (!input) {
                resolve(getSelectOptions(profiles, 'username'))
            } else {
                getProfiles(input).then(result => {
                    resolve(getSelectOptions(result.objects, 'username'))
                })
            }
        })
        profilesPromise.then(result => callback(null, {
            options: result,
            complete: true
        }))

    }
    getFormOptions = () => {
        const options = {
            fields: {
                whoCanView: {
                    factory: t.form.Textbox,
                    template: getKeywordsTemplate({
                        loadOptions: this.getProfilesOptions,
                        help: "Select Users or empty for anyone"
                    })
                },
                whoCanChangeMetadata: {
                    factory: t.form.Textbox,
                    template: getKeywordsTemplate({
                        loadOptions: this.getProfilesOptions,
                        help: "Select Users or empty for owner(you) only"
                    })
                },
                whoCanDelete: {
                    factory: t.form.Textbox,
                    template: getKeywordsTemplate({
                        loadOptions: this.getProfilesOptions,
                        help: "Select Users or empty for owner(you) only"
                    })
                },
                whoCanChangeConfiguration: {
                    factory: t.form.Textbox,
                    template: getKeywordsTemplate({
                        loadOptions: this.getProfilesOptions,
                        help: "Select Users or empty for owner(you) only"
                    })
                },
            }
        }
        return options
    }
    render() {
        return (
            <div>
                <h3>{"Access Configuration"}</h3>
                <Form
                    ref={(form) => this.form = form}
                    value={this.state.value}
                    type={accessFormSchema()}
                    onChange={this.onChange}
                    options={this.getFormOptions()} />
            </div>
        )
    }
}
AppAccess.propTypes = {
    config: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    profiles: PropTypes.array.isRequired,
    errors: PropTypes.array.isRequired,
}

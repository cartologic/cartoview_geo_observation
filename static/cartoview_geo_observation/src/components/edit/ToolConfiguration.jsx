import PropTypes from 'prop-types'
import React from 'react'
import { getPropertyFromConfig } from '../../containers/staticMethods'
import t from 'tcomb-form'
import { toolFormSchema } from '../../containers/forms'
const options = {
    fields: {
        showZoombar: {
            label: "Zoom Bar"
        },
        showLayerSwitcher: {
            label: "Layer Switcher"
        },
        showBaseMapSwitcher: {
            showBaseMapSwitcher: "Base Map Switcher"
        },
        showLegend: {
            label: "Legend"
        }
    }
}
const Form = t.form.Form
export default class ToolConfiguration extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            value:this.getFormValue(this.props)
        }
    }
    getComponentValue = () => {
        return this.form.getValue()
    }
    getFormValue = (props) => {
        const { config } = props
        const value = {
            showZoombar: getPropertyFromConfig(config,
                'showZoombar', true),
            showLayerSwitcher: getPropertyFromConfig(config,
                'showLayerSwitcher', true),
            showBaseMapSwitcher: getPropertyFromConfig(config,
                'showBaseMapSwitcher', true),
            showLegend: getPropertyFromConfig(config,
                'showLegend', true)
        }
        return value
    }
    componentWillReceiveProps(nextProps) {
        const { config,instanceId } = this.props
        if (config && !instanceId) {
            this.setState({ value: this.getFormValue(nextProps) })
        }
    }
    onChange = (newValue) => {
        this.setState({ value: newValue })
    }
    render() {
        return (
            <div>
                <h3>{"Navigation Tools"}</h3>
                <Form
                    ref={(formRef) => this.form = formRef}
                    value={this.state.value}
                    type={toolFormSchema()}
                    onChange={this.onChange}
                    options={options} />
            </div>
        )
    }
}
ToolConfiguration.propTypes = {
    config: PropTypes.object,
    instanceId:PropTypes.number
}

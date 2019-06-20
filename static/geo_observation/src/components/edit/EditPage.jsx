import InfoModal from './InfoModal'
import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames'
const ActionBar = (props) => {
    const { save, selectedMap, instanceId, urls, saving, validate } = props
    const extraProps = {
        disabled: selectedMap && !saving ? false : true
    }
    return (
        <div className="action-bar">
            <div className="grow"></div>
            <div>
                {saving && <i className="fa fa-circle-o-notch fa-spin fa-lg fa-fw"></i>}
            </div>
            <p>
                <button onClick={save} className="btn btn-primary btn-sm pull-right" {...extraProps}>{"Save"}</button>
            </p>
            {/* <p>
                <button onClick={validate} className="btn btn-primary btn-sm pull-right" {...extraProps}>{"Validate"}</button>
            </p> */}
            <p>
                {instanceId && <a href={urls.viewURL(instanceId)} className="btn btn-sm btn-primary pull-right">{"View"}</a>}
            </p>
        </div>
    )
}
ActionBar.propTypes = {
    save: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
    selectedMap: PropTypes.object,
    instanceId: PropTypes.number,
    saving: PropTypes.bool.isRequired,
    urls: PropTypes.object.isRequired
}
const Tabs = (props) => {
    const {
        childrenProps,
        getTabClassName,
        checkIfDisabled,
        getContentClassName
    } = props
    return (
        <div>
            <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                <ul className="nav nav-pills nav-stacked cartoview-nav-list">
                    {childrenProps.steps.map((step, index) => {
                        const disabled = checkIfDisabled(step)
                        return (
                            <li key={index} className={getTabClassName(index)}>
                                <a disabled={disabled} data-toggle={disabled ? "" : "tab"} className="fill-empty" href={disabled ? "javascript:;" : `#component-${index}`}>
                                    <span>{step.title}</span>
                                    {step.hasError && <i className="fa fa-exclamation-triangle text-danger pull-right" aria-hidden="true"></i>}
                                </a>
                                
                            </li>

                        )
                    })}
                </ul>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-9 col-lg-9">
                <div className="tab-content">
                    {childrenProps.steps.map((step, index) => {
                        return (
                            <div key={index} id={`component-${index}`} className={getContentClassName(index)}>
                                <step.component errors={childrenProps.errors} ref={ComponentRef => childrenProps.setStepRef(step.ref, ComponentRef)} urls={childrenProps.urls} {...step.props} />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
Tabs.propTypes = {
    childrenProps: PropTypes.object.isRequired,
    getTabClassName: PropTypes.func.isRequired,
    checkIfDisabled: PropTypes.func.isRequired,
    getContentClassName: PropTypes.func.isRequired,
}
const AppBar = (props) => {
    const { handleHideModal } = props
    return (
        <div className="row">
            <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10">
                <h1>{"Geo Observation"}</h1>
            </div>
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 text-center">
                <h1>
                    <button onClick={handleHideModal} className="btn btn-primary">
                        <i className="fa fa-question-circle fa-lg" aria-hidden="true"></i>
                    </button>
                </h1>
            </div>
        </div>
    )
}
AppBar.propTypes = {
    handleHideModal: PropTypes.func.isRequired
}
export default class EditPageComponent extends React.Component {
    state = {
        showModal: false
    }
    checkIfDisabled = (index) => {
        const { childrenProps } = this.props
        return (!childrenProps.selectedMap) ? index === 0 ? false : true : false
    }
    getTabClassName = (index) => {
        const check = this.checkIfDisabled(index)
        return classNames({
            disabled: check,
            active: index === 0,
            "nav-item": true,
            "flex-element": true,

        })
    }
    handleHideModal = () => {
        const { showModal } = this.state
        this.setState({ showModal: !showModal })
    }
    getContentClassName = (index) => {
        return classNames({
            "active": index === 0,
            "tab-pane fade in": true
        })
    }
    render() {
        const { childrenProps } = this.props
        let { showModal } = this.state
        return (
            <div>
                <AppBar handleHideModal={this.handleHideModal} />
                <hr />
                <ActionBar validate={childrenProps.validate} saving={childrenProps.saving} urls={childrenProps.urls} save={childrenProps.save} selectedMap={childrenProps.selectedMap} instanceId={childrenProps.instanceId} />
                <hr />
                <div className="row content">
                    <Tabs childrenProps={childrenProps} checkIfDisabled={this.checkIfDisabled} getContentClassName={this.getContentClassName} getTabClassName={this.getTabClassName} />
                </div>
                {showModal && <InfoModal handleHideModal={this.handleHideModal} />}
            </div>
        )
    }
}
EditPageComponent.propTypes = {
    childrenProps: PropTypes.object.isRequired
}

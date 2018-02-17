import PropTypes from 'prop-types'
import React from 'react'

export default class TabsContent extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        const { childrenProps } = this.props
        if (childrenProps.steps === nextProps.childrenProps.steps) {
            return false
        }
        return true
    }
    render() {
        const { childrenProps, getContentClassName } = this.props
        return (
            <div>
                <div className="col-xs-12 col-sm-12 col-md-9 col-lg-9">
                    <div className="tab-content">
                        {childrenProps.steps.map((step, index) => {
                            return (
                                <div key={index} id={step.component.name} className={getContentClassName(index)}>
                                    <step.component ref={ComponentRef => childrenProps.setStepRef(step.ref, ComponentRef)} urls={childrenProps.urls} {...step.props} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}
TabsContent.propTypes = {
    childrenProps: PropTypes.object.isRequired,
    getContentClassName: PropTypes.func.isRequired
}
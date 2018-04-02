import React, { Component } from 'react'

import ContentGrid from 'Source/components/view/basic_viewer/ContentGrid'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'

const styles = theme => ( {
    root: {
        height: '100%'
    }
} )
class BasicViewer extends Component {
    render() {
        let { classes, childrenProps } = this.props
        return (
                <div className={classes.root}>
                    <ContentGrid childrenProps={childrenProps} map={childrenProps.map} />
                </div>
        )
    }
}
BasicViewer.propTypes = {
    classes: PropTypes.object.isRequired,
    childrenProps: PropTypes.object.isRequired,
}
export default withStyles( styles )( BasicViewer )

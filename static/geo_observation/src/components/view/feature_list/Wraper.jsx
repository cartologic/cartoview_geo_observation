import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames'
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    root: {
        padding: theme.spacing.unit * 2,
    },
    container: {
        height: 'calc(100% - 96px)'
    },
    scrolling: {
        overflowY: 'overlay'
    }
});
class Wraper extends React.Component {
    render() {
        const { classes, match, children } = this.props
        return (
            <div className={classNames("flex-element", classes.root, classes.container, { [classes.scrolling]: Boolean(match) })} >
                {children}
            </div>
        )
    }
}
Wraper.propTypes = {
    classes: PropTypes.object.isRequired,
}
export default withStyles(styles)(Wraper)
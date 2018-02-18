import AppBar from 'material-ui/AppBar'
import { Message } from 'Source/containers/CommonComponents'
import PropTypes from 'prop-types'
import React from 'react'
import Toolbar from 'material-ui/Toolbar'
import { withStyles } from 'material-ui/styles'

const drawerWidth = '100%'
const styles = theme => ({
    root: {
        width: '100%',
    },
    drawerPaper: {
        width: drawerWidth
    },
    drawerHeader: {
        background: theme.palette.primary[500],
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    }
})
class NavBar extends React.Component {
    render() {
        const { classes,config } = this.props
        return (
            <div className={classes.root}>
                <AppBar className={classes.drawerHeader} position="static">
                    <Toolbar>
                        <Message type="title" align={"left"} message={config.formTitle} />
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}
NavBar.propTypes = {
    classes: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired
}
export default withStyles(styles, { withTheme: true })(NavBar)

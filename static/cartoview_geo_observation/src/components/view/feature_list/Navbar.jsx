import AppBar from 'material-ui/AppBar'
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft'
import IconButton from 'material-ui/IconButton'
import PropTypes from 'prop-types'
import React from 'react'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'

const styles = {
    root: {
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
};

class Navbar extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { classes, title, hanldeDrawerOpen } = this.props
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton onClick={hanldeDrawerOpen} className={classes.menuButton} aria-label="Open Drawer" color="inherit">
                            <ChevronLeftIcon />
                        </IconButton>
                        <Typography variant="title" noWrap color="inherit" className={classes.flex}>
                            {title}
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

Navbar.propTypes = {
    classes: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    hanldeDrawerOpen: PropTypes.func.isRequired
};

export default withStyles(styles)(Navbar);
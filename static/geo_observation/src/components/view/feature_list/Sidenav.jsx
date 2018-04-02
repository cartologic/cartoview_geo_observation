import React, { Component } from 'react'

import Divider from 'material-ui/Divider'
import Drawer from 'material-ui/Drawer'
import NavList from 'Source/components/view/feature_list/NavList'
import Navbar from 'Source/components/view/feature_list/Navbar'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
    drawerPaper: {
        position: 'fixed',
        height: '100%',
        width: 350,
    },
    drawerHeader: theme.mixins.toolbar
});
class Sidenav extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { drawerOpen, classes, hanldeDrawerOpen, urls, config } = this.props
        return (
            <Drawer
                variant="persistent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                open={drawerOpen}
                anchor={'left'}
            >
                <Navbar title={config.title} hanldeDrawerOpen={hanldeDrawerOpen} />
                <Divider />
                <NavList config={config} urls={urls} />


                <Divider />

            </Drawer>
        )

    }

}
Sidenav.propTypes = {
    classes: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    urls: PropTypes.object.isRequired,
    drawerOpen: PropTypes.bool.isRequired,
    hanldeDrawerOpen: PropTypes.func.isRequired
}

export default withStyles(styles)(Sidenav);
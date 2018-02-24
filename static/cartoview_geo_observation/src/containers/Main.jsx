import 'typeface-roboto'

import { HashRouter, Route, Switch } from 'react-router-dom'
import React, { Component } from 'react'

import BasicViewerContainer from 'Source/containers/basic_viewer/BasicViewer'
import Button from 'material-ui/Button'
import FeatureDetails from 'Source/components/view/feature_list/FeatureDetails'
import FeatureListContainer from 'Source/containers/FeatureList'
import MenuIcon from 'material-ui-icons/Menu'
import { MuiThemeProvider } from 'material-ui/styles'
import PropTypes from 'prop-types'
import Sidenav from 'Source/components/view/feature_list/Sidenav'
import Wraper from 'Source/components/view/feature_list/Wraper'
import injectTapEventPlugin from "react-tap-event-plugin"
import proj from 'ol/proj'
import proj4 from 'proj4'
import { theme } from 'Source/components/view/feature_list/theme.jsx'
import { withStyles } from 'material-ui/styles'

proj.setProj4(proj4)
injectTapEventPlugin()
const styles = theme => ({
    root: {
        padding: theme.spacing.unit * 2,
    },
    container: {
        height: 'calc(100% - 96px)'
    },
    scrolling: {
        overflowY: 'overlay'
    },
    button: {
        margin: theme.spacing.unit,
        position: 'fixed',
        zIndex: 1
    },
});
class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            drawerOpen: false
        }
    }
    hanldeDrawerOpen = () => {
        const { drawerOpen } = this.state
        this.setState({ drawerOpen: !drawerOpen })
    }
    render() {
        const { config, username, urls, classes } = this.props
        const { drawerOpen } = this.state
        return (
            <HashRouter>
                <MuiThemeProvider theme={theme}>
                    <div className="full-height">
                        <Switch>
                            <Route
                                exact
                                path={"/"}
                                render={(props) => (<main>
                                    <Button onClick={this.hanldeDrawerOpen} variant="fab" color="primary" aria-label="add" className={classes.button}>
                                        <MenuIcon />
                                    </Button>
                                    <Sidenav config={config} urls={urls} drawerOpen={drawerOpen} hanldeDrawerOpen={this.hanldeDrawerOpen} />
                                    <Wraper {...props}><FeatureListContainer config={config.config} urls={urls} {...props} /></Wraper>
                                </main>)}
                            />
                            <Route
                                exact
                                path={`/:fid/details`}
                                render={(props) => <main>
                                    <Button onClick={this.hanldeDrawerOpen} variant="fab" color="primary" aria-label="add" className={classes.button}>
                                        <MenuIcon />
                                    </Button>
                                    <Sidenav config={config} urls={urls} drawerOpen={drawerOpen} hanldeDrawerOpen={this.hanldeDrawerOpen} />
                                    <Wraper {...props}><FeatureDetails username={username} config={config.config} urls={urls} {...props} /></Wraper>
                                </main>}
                            />
                        </Switch>
                        <Route
                            path={"/viewer"}
                            render={(props) => <BasicViewerContainer username={username} config={config} urls={urls} {...props} />
                            }
                        />

                    </div>
                </MuiThemeProvider>
            </HashRouter>
        )
    }
}
Main.propTypes = {
    classes: PropTypes.object.isRequired,
    username: PropTypes.string,
    urls: PropTypes.object.isRequired,
    instanceId: PropTypes.number.isRequired,
    config: PropTypes.object.isRequired
}

export default withStyles(styles)(Main)
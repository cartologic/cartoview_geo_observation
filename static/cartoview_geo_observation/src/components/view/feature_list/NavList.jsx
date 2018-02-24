import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'

import AddLocationIcon from 'material-ui-icons/AddLocation'
import Divider from 'material-ui/Divider'
import { Link } from 'react-router-dom'
import ListIcon from 'material-ui-icons/List'
import MapIcon from 'material-ui-icons/Map'
import PropTypes from 'prop-types'
import React from 'react'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
})

function SimpleList(props) {
    const { classes, urls } = props
    return (
        <div className={classes.root}>
            <List component="nav">
                <ListItem onClick={() => window.location.href = urls.newObservation} button>
                    <ListItemIcon>
                        <AddLocationIcon />
                    </ListItemIcon>
                    <ListItemText primary="New Observation" />
                </ListItem>
                <ListItem component={Link} to={"/"} button>
                    <ListItemIcon>
                        <ListIcon />
                    </ListItemIcon>
                    <ListItemText primary="Feature List" />
                </ListItem>
                <ListItem component={Link} to={"/viewer"} button>
                    <ListItemIcon>
                        <MapIcon />
                    </ListItemIcon>
                    <ListItemText primary="Map" />
                </ListItem>
            </List>
        </div>
    )
}

SimpleList.propTypes = {
    classes: PropTypes.object.isRequired,
    urls: PropTypes.object.isRequired,
}

export default withStyles(styles)(SimpleList)
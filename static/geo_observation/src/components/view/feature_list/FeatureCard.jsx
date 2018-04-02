import Menu, { MenuItem } from 'material-ui/Menu'
import React, { Component } from 'react'

import AttachmentIcon from 'material-ui-icons/Attachment'
import ChatIcon from 'material-ui-icons/Chat'
import Divider from 'material-ui/Divider'
import Img from 'react-image'
import { Link } from "react-router-dom";
import MoreVertIcon from 'material-ui-icons/MoreVert'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
    paperPosition: {
        position: 'relative',
        marginBottom: theme.spacing.unit * 2
    },
    menuIcon: {
        top: 0,
        position: 'absolute',
        right: 0,
        padding: 0
    },
    paperText: {
        padding: theme.spacing.unit,
    },
    paperSubText: {
        padding: theme.spacing.unit,
        flex: 1,
        flexDirection: "row",
        display: 'flex',
        justifyContent: 'space-around',
        [theme.breakpoints.down('sm')]: {
            justifyContent: 'space-around',
            flexDirection: "column",
        },

        alignItems: 'center',
    }
});
const options = [
    'Open',
    'Edit',
    'Delete',
];
class FeatureList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            anchorEl: null
        }
    }
    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };
    render() {
        const { classes, imageSrc, title, description, files,typename,comments, imageEnabled, match, editURL, location, featureId } = this.props
        let { anchorEl } = this.state
        return (
            <Paper className={classNames("element-flex", classes.paperPosition, "card-item")} elevation={4}>
                {imageEnabled && <Img src={imageSrc} />}
                <div className="card-item-text text-wrap fill-out-empty">
                    <div className={classNames("text-wrap", classes.paperText)} >
                        <Typography gutterBottom variant="title" noWrap component="h3">
                            {title || "No Title Provided"}
                        </Typography>
                        {description && <Typography gutterBottom noWrap component="p">
                            {description}
                        </Typography>}
                    </div >
                    <Divider />
                    <div className={classes.paperSubText}>
                        <Typography className="element-flex" gutterBottom variant="body2" noWrap component="h3">
                            <ChatIcon />{`Comments: ${comments}`}
                        </Typography>

                        <Typography className="element-flex" gutterBottom variant="body2" noWrap component="h3">
                            <AttachmentIcon /> {`Files: ${files}`}
                        </Typography>
                    </div>
                </div>

                <MoreVertIcon aria-label="More"
                    aria-owns={anchorEl ? 'long-menu' : null}
                    aria-haspopup="true"
                    className={classes.menuIcon}
                    onClick={this.handleClick} />

                <Menu
                    id="long-menu"
                    anchorEl={this.state.anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem component={Link} to={`${location.pathname}${typename}/${featureId}/details`}>
                        {"Open"}
                    </MenuItem>
                    <MenuItem onClick={() => window.location.href = `${editURL}`}>
                        {"Edit"}
                    </MenuItem>
                    <MenuItem onClick={() => {
                        this.props.delete()
                        this.setState({ anchorEl: null })
                    }}>
                        {"Delete"}
                    </MenuItem>

                </Menu>
            </Paper >
        )
    }
}
FeatureList.propTypes = {
    imageSrc: PropTypes.array,
    title: PropTypes.any,
    description: PropTypes.any,
    files: PropTypes.number.isRequired,
    comments: PropTypes.number.isRequired,
    featureId: PropTypes.string.isRequired,
    editURL: PropTypes.string.isRequired,
    imageEnabled: PropTypes.bool.isRequired,
    match: PropTypes.object,
    delete: PropTypes.func.isRequired,
    location: PropTypes.object,
}
export default withStyles(styles)(FeatureList)
import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle,
} from 'material-ui/Dialog'

import Button from 'material-ui/Button'
import { DropZoneComponent } from './statelessComponents'
import FeatureListHelper from 'Source/helpers/FeatureListHelper'
import FileUpload from 'material-ui-icons/FileUpload';
import { FormControlLabel } from 'material-ui/Form'
import PropTypes from 'prop-types'
import React from 'react'
import Slide from 'material-ui/transitions/Slide'
import Switch from 'material-ui/Switch'
import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    }, rightIcon: {
        marginLeft: theme.spacing.unit,
    },
})
const UploaderActions = (props) => {
    const { files, saveImage, handleRequestClose, ImageURLValid } = props
    return <div>
        {(files.length > 0 || ImageURLValid) ?
            <Button onTouchTap={saveImage} color="secondary">
                {"Upload"}
            </Button> : <Button disabled color="secondary">
                {"Upload"}
            </Button>}

        <Button onTouchTap={handleRequestClose} color="primary">
            {"Cancel"}
        </Button>
    </div>
}
UploaderActions.propTypes = {
    files: PropTypes.array.isRequired,
    ImageURLValid: PropTypes.bool.isRequired,
    saveImage: PropTypes.func.isRequired,
    handleRequestClose: PropTypes.func.isRequired
}
const UploaderSwitcher = (props) => {
    const { checked, changeUploader } = props
    return <div className="element-flex">
        <FormControlLabel
            control={
                <Switch
                    checked={checked}
                    onChange={(event, checked) => changeUploader(checked)}
                />
            }
            label="Image From URL"
        />
    </div>
}
UploaderSwitcher.propTypes = {
    checked: PropTypes.bool.isRequired,
    changeUploader: PropTypes.func.isRequired
}
const URLBox = (props) => {
    const { fromURL, ImageURLValid, ImageURL, classes, handleURLChange } =
        props
    return <div>
        {fromURL && ImageURLValid && <TextField
            required
            label="Image URL"
            className={classes.textField}
            value={ImageURL}
            onChange={handleURLChange}
            margin="normal"
        />}
        {fromURL && !ImageURLValid && <TextField
            required
            error
            label="Image URL"
            className={classes.textField}
            value={ImageURL}
            onChange={handleURLChange}
            margin="normal"
        />}
    </div>
}
function Transition(props) {
    return <Slide direction="up" {...props} />;
}
URLBox.propTypes = {
    fromURL: PropTypes.bool.isRequired,
    ImageURLValid: PropTypes.bool.isRequired,
    ImageURL: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    handleURLChange: PropTypes.func.isRequired
}
class ImageDialog extends React.Component {
    state = {
        open: false,
        files: [],
        fromURL: false,
        ImageURL: '',
        ImageURLValid: false
    }
    handleClickOpen = () => {
        this.setState({ open: true })
    }
    onDrop = (files) => {
        this.setState({
            files
        })
    }
    reset = () => {
        this.setState({
            open: false,
            files: [],
            fromURL: false,
            ImageURL: '',
            ImageURLValid: false
        })
    }
    handleURLChange = (event) => {
        const inputValue = event.target.value
        this.setState({
            ImageURL: inputValue,
            ImageURLValid: FeatureListHelper.checkURL(inputValue)
        })
    }
    handleRequestClose = () => {
        this.setState({ open: false })
    }
    changeUploader = (bool) => {
        this.setState({
            fromURL: bool,
            files: [],
            ImageURL: '',
            ImageURLValid: false
        })
    }
    saveImage = () => {
        const { SaveImageBase64, featureId, getImageFromURL } = this.props
        const { files, ImageURL, fromURL } = this.state
        if (ImageURL !== '' && fromURL) {
            FeatureListHelper.checkImageSrc(ImageURL, () => {
                getImageFromURL(ImageURL, featureId)
                this.reset()
            },
                () => alert(
                    "Bad Image URL Please check your link or Enter a new one"
                ))
        } else {
            SaveImageBase64(files[0], featureId)
            this.reset()
        }
    }
    render() {
        const { classes, username } = this.props
        let { files, fromURL, ImageURL, ImageURLValid } = this.state
        return (
            <div className="text-center">

                {username !== "" && <Button onTouchTap={this.handleClickOpen} className={classes.button} color="primary">
                    {"Upload"}
                    <FileUpload className={classes.rightIcon} />
                </Button>}
                <Dialog
                    open={this.state.open}
                    transition={Transition}
                    keepMounted
                    onClose={this.handleRequestClose}
                >
                    <DialogTitle>{"Image Uploader"}</DialogTitle>
                    <DialogContent>
                        <UploaderSwitcher checked={fromURL} changeUploader={this.changeUploader} />
                        {!fromURL && <DropZoneComponent files={files} onDrop={this.onDrop} classes={classes} />}
                        <URLBox handleURLChange={this.handleURLChange} classes={classes} fromURL={fromURL} ImageURL={ImageURL} ImageURLValid={ImageURLValid} />

                    </DialogContent>
                    <DialogActions>
                        <UploaderActions ImageURLValid={ImageURLValid} files={files} saveImage={this.saveImage} handleRequestClose={this.handleRequestClose} />
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
ImageDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    SaveImageBase64: PropTypes.func.isRequired,
    getImageFromURL: PropTypes.func.isRequired,
    featureId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
}
export default withStyles(styles)(ImageDialog)

import Button from 'material-ui/Button'
import { Carousel } from 'react-responsive-carousel'
import { CircularProgress } from 'material-ui/Progress'
import Dropzone from 'react-dropzone'
import Grid from 'material-ui/Grid'
import PropTypes from 'prop-types'
import React from 'react'
import SendIcon from 'material-ui-icons/Send'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'

export const Loader = (props) => {
    const { size, thickness } = props
    return (
        <div className="text-center" >
            <CircularProgress size={size ? size : 50} thickness={thickness ? thickness : 5} className="text-center"></CircularProgress>
        </div>
    )
}
Loader.propTypes = {
    size: PropTypes.number,
    thickness: PropTypes.number
}
export const Message = (props) => {
    const { align, type, message, color, noWrap, classes } = props
    return <Typography
        variant={type}
        align={align || "center"}
        noWrap={typeof (noWrap) !== "undefined" ? noWrap : message.length > 50 ? true : false}
        color={color ? color : "inherit"}
        className={`element-flex ${classes}`}>
        {message}
    </Typography>
}
Message.propTypes = {
    type: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    align: PropTypes.string,
    color: PropTypes.string,
    noWrap: PropTypes.bool,
    classes: PropTypes.string
}
export const Slider = (props) => {
    const { attachments } = props
    return <div>
        <Grid container justify={'center'} spacing={0}>
            {attachments.length > 0 ? <Grid item xs={10} sm={10} md={10} lg={10} xl={10} >
                <Carousel showArrows={true}>
                    {attachments.map(
                        (imageObj, i) => {
                            return <div key={i}>
                                <img className="img-responsive" src={imageObj.file} />
                                <p className="legend">{`Uploaded by ${imageObj.username}`}</p>
                            </div>
                        }
                    )}
                </Carousel>
            </Grid> : <Message align="center" message={'No Attachments'} type="body1" />}
        </Grid>
    </div>
}
Slider.propTypes = {
    attachments: PropTypes.array.isRequired
}
export const CommentBox = (props) => {
    const { classes, value, handleChange, addComment, hasError } = props
    return (
        <div className="text-center fill-out-empty">
            {!hasError ? <TextField
                id="multiline-flexible"
                label="Comment"
                multiline
                rowsMax="4"
                value={value}
                onChange={handleChange}
                className={classes.textField}
                margin="none"
                fullWidth
            /> : <TextField
                    error
                    id="multiline-flexible"
                    label="Comment"
                    multiline
                    rowsMax="4"
                    value={value}
                    onChange={handleChange}
                    className={classes.textField}
                    margin="normal"
                    fullWidth
                />}
            <Button onClick={addComment} variant="raised" color="primary" className={classes.button}>
                {`Send `} <SendIcon />
            </Button>
        </div>
    )
}
CommentBox.propTypes = {
    value: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    addComment: PropTypes.func.isRequired,
    hasError: PropTypes.bool.isRequired
}
export const DropZoneComponent = (props) => {
    const { files, onDrop } = props
    return (
        <div className="center-div">
            <Dropzone maxSize={5242880} multiple={false} accept="image/*" onDrop={onDrop}>
                <div>
                    <Message message={"Click to select Image to upload."} type="body1" />
                    <ul> {files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)}</ul>
                </div>
            </Dropzone>
        </div>
    )
}
DropZoneComponent.propTypes = {
    onDrop: PropTypes.func.isRequired,
    files: PropTypes.array.isRequired,
}

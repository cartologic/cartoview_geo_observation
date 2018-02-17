import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    withMobileDialog,
} from 'material-ui/Dialog'

import Button from 'material-ui/Button'
import PropTypes from 'prop-types'
import React from 'react'

class CartoviewAbout extends React.Component {
    render() {
        const { fullScreen, title, abstract, close, open } = this.props

        return (
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onRequestClose={close}
            >
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {abstract}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={close} color="primary">
                        {"Close"}
                    </Button>

                </DialogActions>
            </Dialog>
        )
    }
}

CartoviewAbout.propTypes = {
    fullScreen: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    abstract: PropTypes.string,
    close: PropTypes.func.isRequired
}

export default withMobileDialog()(CartoviewAbout)
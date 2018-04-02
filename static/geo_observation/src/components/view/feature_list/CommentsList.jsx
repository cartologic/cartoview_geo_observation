import { CommentBox, Message } from './statelessComponents'
import List, { ListItem, ListItemText } from 'material-ui/List'

import Avatar from 'material-ui/Avatar'
import { Loader } from './statelessComponents'
import PropTypes from 'prop-types'
import React from 'react'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    root: {
        padding: theme.spacing.unit * 2
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
    }
})
class CommentsList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            newComment: '',
            hasError: false
        }
    }
    handleChange = (event) => {
        this.setState({
            newComment: event.target.value,
            hasError: false
        })
    }
    addComment = () => {
        const { addComment, selectedFeature } = this.props
        let { newComment } = this.state
        if (newComment !== '') {
            const data = { text: newComment, feature_id: selectedFeature.getId(), tags: ['feature_list',] }
            addComment(data)
            this.setState({ newComment: '', hasError: false })
        } else {
            this.setState({ hasError: true })
        }
    }
    render() {
        const { classes, comments, username, commentsIsLoading } = this.props
        const { newComment, hasError } = this.state
        return (
            <div className={classes.root}>
                {comments && comments.length > 0 ?
                    <List className="comment-list">
                        {comments.map((comment, index) => {
                            return <ListItem key={index} button className={classes.listItem}>
                                <Avatar className="avatar">{comment.username[0].toUpperCase()}</Avatar>
                                <ListItemText primary={comment.username} secondary={comment.text} />
                            </ListItem>
                        })}
                    </List> : commentsIsLoading ? <Loader /> : <Message message={'No Comments'} type="body2" />
                }
                {username !== "" && <CommentBox value={newComment} classes={classes} hasError={hasError} handleChange={this.handleChange} addComment={this.addComment} />}
            </div>
        )
    }
}
CommentsList.propTypes = {
    comments: PropTypes.array,
    username: PropTypes.string,
    selectedFeature: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    commentsIsLoading: PropTypes.bool.isRequired,
    addComment: PropTypes.func.isRequired,
}
export default withStyles(styles)(CommentsList)

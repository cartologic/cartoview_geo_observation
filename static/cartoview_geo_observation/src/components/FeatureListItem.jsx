import Img from 'react-image'
import PropTypes from 'prop-types'
import React from 'react'
import Spinner from "react-spinkit"
import { connect } from 'react-redux';
import noImage from '../img/no-img.png'
class FeatureListItem extends React.Component {
    constructor( props ) {
        super( props )
    }
    searchFilesById = ( id ) => {
        let result = [ ]
        this.props.files.map( ( imageObj ) => {
            if ( imageObj.is_image && imageObj.feature_id ===
                id ) {
                result.push( imageObj )
            }
        } )
        return result
    }
    render( ) {
        let {
            feature
        } = this.props
        return (
            <div><div onClick={this.props.onClick()} className="row" >
            <div className="col-xs-12 col-sm-2 col-md-2" style={{ textAlign: "center" }}>
                <Img
                    src={[
                        this.searchFilesById(feature.getId()).length > 0 ? this.searchFilesById(feature.getId())[0].file : null,
                        noImage
                    ]}
                    loader={<Spinner className="loading-center" name="line-scale-party" color="steelblue" />}
                    className="img-responsive img-thumbnail"
                    style={{ height: 80 }}

                />
            </div>
            <div id="description-block" className="col-xs-12 col-sm-10 col-md-10">
                <h4>{feature.getProperties()[this.props.titleAttribute]}</h4>
                <p>{feature.getProperties()[this.props.subtitleAttribute]}</p>
                <p>Images : <span className="badge" >{this.searchFilesById(feature.getId()).length}</span></p>
            </div>
        </div>
            <hr />
        </div>
        )
    }
}
FeatureListItem.propTypes = {
    subtitleAttribute: PropTypes.string.isRequired,
    titleAttribute: PropTypes.string.isRequired,
    feature: PropTypes.object.isRequired,
    files: PropTypes.array.isRequired,
    onClick:PropTypes.func.isRequired
}
const mapStateToProps = ( state ) => {
    return {
        files: state.files,
    }
}
export default connect( mapStateToProps )( FeatureListItem )

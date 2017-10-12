import React from 'react';
export default class InfoModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data
        };
    }

    handleClick() {
        console.log(this); // null
    }

    render() {
        let _this = this;
        let data = this.state.data;
        // console.group("Rendering");
        console.log("rendering infoModal", data.length, "items", data);

        return (
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" className="glyphicon glyphicon-remove"></span></button>
                        <h4 className="modal-title" id="myModalLabel">
                            <img src={_this.state.data.favIconUrl} />
                            {this.state.data.title}
                        </h4>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <table className="table table-hover table-condensed table-bordered table-striped">
                                <tbody>
                                    <tr>
                                        <td><strong>ID </strong></td>                
                                        <td>
                                            {this.state.data.id}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Index(position) </strong></td> 
                                        <td>
                                            {this.state.data.index}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>URL </strong></td>               
                                        <td>
                                            {this.state.data.url}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Title </strong></td>             
                                        <td>
                                            {this.state.data.title}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Status </strong></td> 
                                        <td>
                                            {this.state.data.status}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Pinned </strong></td> 
                                        <td>
                                            {this.state.data.pinned ? "Yes" : "No"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Audible </strong></td> 
                                        <td>
                                            {this.state.data.audible ? "Yes" : "No"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Active </strong></td> 
                                        <td>
                                            {this.state.data.active ? "Yes" : "No"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Selected </strong></td> 
                                        <td>
                                            {this.state.data.selected ? "Yes" : "No"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Width </strong></td> 
                                        <td>
                                            {this.state.data.width}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Height </strong></td> 
                                        <td>
                                            {this.state.data.height}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>WindowID </strong></td> 
                                        <td>
                                            {this.state.data.windowId}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        )
    }

}
InfoModal.propTypes = {
    data: React.PropTypes.array.isRequired
};
InfoModal.defaultProps = {
    data: []
};

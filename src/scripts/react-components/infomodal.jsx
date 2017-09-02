import React from 'react';
class InfoModal extends React.Component {
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
        console.log("rendering infoModal",data.length,"items",data);

        return (
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                       <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" className="glyphicon glyphicon-remove"></span></button>
                        <h4 className="modal-title" id="myModalLabel">
                            <img src={_this.state.data.favIconUrl}/>
                            {this.state.data.title}
                        </h4>
                      </div>
                      <div className="modal-body">
                       <p><strong>ID :</strong> {this.state.data.id}</p>
                       <p><strong>Index(position) :</strong> {this.state.data.index}</p>
                       <p><strong>URL :</strong> {this.state.data.url}</p>
                       <p><strong>Title :</strong> {this.state.data.title}</p>
                       <p><strong>Status :</strong> {this.state.data.status}</p>
                       <p><strong>Pinned :</strong> {this.state.data.pinned ? "Yes" : "No"}</p>
                       <p><strong>Audible :</strong> {this.state.data.audible ? "Yes" : "No"}</p>
                       <p><strong>Active :</strong> {this.state.data.active ? "Yes" : "No"}</p>
                       <p><strong>Selected :</strong> {this.state.data.selected ? "Yes" : "No"}</p>
                       <p><strong>Width :</strong> {this.state.data.width}</p>
                       <p><strong>Height :</strong> {this.state.data.height}</p>
                       <p><strong>WindowID :</strong> {this.state.data.windowId}</p>
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
InfoModal.defaultProps= {
        data: []
};

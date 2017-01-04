class ReadingLists extends React.Component {
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
        let readinglists = this.state.data;
        console.log(readinglists);
        return (<div className="panel-group" id="readinglist-accordion" role="tablist" aria-multiselectable="true">                 
            {readinglists.map((value)=> {
                return <ReadingList key={value.id} id={value.id} name={value.name} data={value.sites}/>
              })}

            </div>);
  }
}
ReadingLists.propTypes = {
 data: React.PropTypes.array.isRequired
};
ReadingLists.defaultProps= {
        data: []
};

class ReadingList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        id: this.props.id,
        name: this.props.name,
        data: this.props.data
    };
   }
   deleteList(id){
       
   }
   render() {
        let _this = this;
        let sites = this.state.data;
        return (<div className="panel panel-default">
                    <div className="panel-heading" role="tab" id="headingOne">
                        <h4 className="panel-title">
                            <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                              {_this.state.name}
                            </a>
                            <button className="btn" onclick={_this.deleteList(null,_this.props.id)}>X</button>
                      </h4>
                    </div>
                    <div id="collapseOne" className="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                        <ul data-reactroot="" className="tabs-list list-group sortable">
                            {sites.map((values)=>{
                                <Site url={values.url} title={values.title} favIconUrl={values.favIconUrl} />                                
                            })}
                        </ul>
                    </div>
                </div>
            );
  }
}
ReadingList.propTypes = {
 data: React.PropTypes.array.isRequired,
 name: React.PropTypes.string.isRequired
};
ReadingList.defaultProps= {
        data: [],
        name: ''
};
class site extends React.Component{
   constructor(props) {
    super(props);
    this.state = {
        url: this.props.url,
        title: this.props.title,
        favicon: this.props.favIconUrl,
        data: this.props.data
        }; 
    }
    infoModal(dataV){
        console.log("trigger infoModal",this,dataV);
        InfoModal.setState({
            data:dataV 
        });
        jQuery('#infoModal').modal('show');
    }
    render(){
        
        
        let _this = this;
        return (
            <li key={_this.props.id} data-id={_this.props.id} className="list-group-item horizontal-block">
                <img src={_this.state.favicon}/>
                <strong className="clickable" title={_this.state.title} onClick={_this.focusTab.bind(null,_this.props.id)}>{_this.state.title}</strong>
                <div className="options pull-right">
                    <span className="glyphicon glyphicon-option-vertical clickable" onClick={_this.infoModal.bind(null,_this.state.data)} ></span>
                    <span data-id={_this.props.id} onClick={_this.removeSite.bind(null,_this.props.id,_this.state.title)} data-command='remove' className='clickable remove-tab glyphicon glyphicon-remove' aria-hidden='true'></span>
                </div>
           </li>
            )
        
    }
}
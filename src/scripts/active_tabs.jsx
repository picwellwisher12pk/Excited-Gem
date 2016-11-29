let ActiveTabs = React.createClass({
	getInitialState: function() {
        return {
            text: this.props.data
        };
    },
	update: function(){

	},
	render: function() {
		return (
			<h1 className="test" onClick={this.edit}>{this.state.text}</h1>
		);
	}

});	
// ReactDOM.render(<ActiveTabs/>, document.getElementById('active-tabs'))


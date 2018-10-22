import React from 'react';
import PropTypes from 'prop-types';
export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      regex: this.props.regex,
      ignoreCase: this.props.ignoreCase,
      searchIn: this.props.searchIn
    };
      this.searchField = React.createRef();
    console.log("constructor this state.",this.state);
  }
//Search/Filter
//   $('#quicksearch-input').keyup( e => {
//   let filteredTabs = searchInTabs(e.target.value, window.tabsList);
//   window.tabsgroup.setState({ tabs: filteredTabs });
// });
  render(){
    let ignoreCase = this.state.ignoreCase;
    let regex = this.state.regex;
    let placeholder,urlChecked=false,titleChecked=false;
    if(this.state.searchIn == 'title')  {placeholder = "Search in Titles";titleChecked=true;}
    if(this.state.searchIn == 'url')  {placeholder = "Search in URLs";urlChecked=true;}
    if(this.state.searchIn == 'both')  {placeholder = "Search in Tab URLs and Titles";titleChecked=true;urlChecked=true;}

    return (
      <section className="search-bar" style={{width: '66%'}}>
      <div id="filter-tabs" className="input-group filter-tabs">
        <input id="quicksearch-input"
               type="text"
               ref={this.searchField}
               placeholder={placeholder}
               className="quicksearch-input form-control regex"
               onChange={()=> {this.props.searchInTabs(this.searchField.current.value)}}
        />
        <div className="input-group-append option-regex">
          <div className="custom-control custom-checkbox ">
            <input type="checkbox"
                   className="custom-control-input"
                   id="filter-type-option-id"
                   defaultChecked={regex ? 'checked': ''}
                   onChange={() => this.props.setPreferences('search','regex',!regex)}
            />
            <label className="custom-control-label input-group-text" htmlFor="filter-type-option-id">Regex</label>
          </div>
        </div>
        <div className="input-group-append option-case-sensitive">
          <div className="custom-control custom-checkbox ">
            <input type="checkbox" className="custom-control-input" id="filterCase-option-id" defaultChecked={ignoreCase ? 'checked': ''} />
            <label className="custom-control-label input-group-text" htmlFor="filterCase-option-id">Ignore Case</label>
          </div>
        </div>
        <div className="input-group-append" style={{position: "relative"}}>
          <button className="btn btn-warning dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Search From</button>
          <div className="dropdown-menu dropdown-menu-right">
            <div className="px-4 py-3">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="dropdownCheck2" defaultChecked={urlChecked ? 'checked': ''}/>
                <label className="form-check-label" htmlFor="dropdownCheck2">
                  URL
                </label>
              </div>
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="dropdownCheck2" defaultChecked={titleChecked ? 'checked':''} />
                <label className="form-check-label" htmlFor="dropdownCheck2">
                  Title
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
  }
}
Search.propTypes = {
  regex: PropTypes.bool,
  case: PropTypes.bool,
  searchIn: PropTypes.string
};


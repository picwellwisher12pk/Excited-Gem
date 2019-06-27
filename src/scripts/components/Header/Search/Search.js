import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from '../../../ErrorBoundary';
export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      regex: this.props.regex,
      ignoreCase: this.props.ignoreCase,
      searchIn: this.props.searchIn,
      empty: true,
    };
    this.searchField = React.createRef();
    this.title = React.createRef();
    this.url = React.createRef();
  }
  onKeyUpped(event) {
    // console.info('keypressed', event.target, this);
    this.searchField.current.value != '' ? this.setState({ empty: false }) : this.setState({ empty: true });
    if (event.keyCode == 27) {
      // console.log('escaped');
      this.clear();
      this.props.searchInTabs('');
    }
  }
  clear() {
    this.searchField.current.value = '';
    this.setState({ empty: true });
    this.props.searchInTabs('');
  }
  toggleSearchIn(number, event) {
    let title = this.title.current.checked;
    let url = this.url.current.checked;
    if (!title && !url) {
      event.preventDefault();
      alert("Sorry! You can't uncheck both Title and URL at the same time. One must remain checked.");
      return false;
    }
    let searchIn = this.state.searchIn;
    searchIn[number] = !this.state.searchIn[number];
    this.props.setPreferences('search', 'searchIn', searchIn);
    this.props.searchInTabs(this.searchField.current.value);
  }
  render() {
    let searchIn = this.state.searchIn;
    let placeholder = 'Search in ';
    placeholder += this.state.searchIn[0] ? 'Titles' : '';
    placeholder += this.state.searchIn[0] && this.state.searchIn[1] ? ' and ' : '';
    placeholder += this.state.searchIn[1] ? 'URLs' : '';
    // console.log("Search Render");

    return (
      <ErrorBoundary>
        <section className="search-bar" style={{ width: '66%', paddingRight: 0 }}>
          <div id="filter-tabs" className="input-group filter-tabs">
            <i
              className={'icon fal ' + (this.state.empty ? 'fa-search text-secondary' : 'fa-times text-danger cp')}
              onClick={() => {
                if (!this.state.empty) this.clear();
              }}
            />
            <input
              id="quicksearch-input"
              type="text"
              ref={this.searchField}
              placeholder={placeholder}
              className="quicksearch-input form-control regex "
              onChange={() => {
                this.props.searchInTabs(this.searchField.current.value);
              }}
              onKeyUp={event => {
                this.onKeyUpped(event);
              }}
              autoFocus
            />
            <div className="input-group-append option-regex">
              <div className="custom-control custom-checkbox ">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="prefTitle"
                  ref={this.title}
                  defaultChecked={searchIn[0] ? 'checked' : ''}
                  onClick={e => {
                    this.toggleSearchIn(0, e);
                  }}
                />
                <label className="custom-control-label input-group-text" htmlFor="prefTitle">
                  Title
                </label>
              </div>
            </div>
            <div className="input-group-append option-case-sensitive">
              <div className="custom-control custom-checkbox ">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="prefURL"
                  ref={this.url}
                  defaultChecked={searchIn[1] ? 'checked' : ''}
                  onClick={e => {
                    this.toggleSearchIn(1, e);
                  }}
                />
                <label className="custom-control-label input-group-text" htmlFor="prefURL">
                  URL
                </label>
              </div>
            </div>
            {/*<div className="input-group-append" style={{position: "relative"}}>*/}
            {/*<button className="btn btn-warning dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Search From</button>*/}
            {/*<div className="dropdown-menu dropdown-menu-right">*/}
            {/*<div className="px-4 py-3">*/}
            {/*<div className="form-check">*/}
            {/*<input type="checkbox" className="form-check-input" id="dropdownCheck2" defaultChecked={urlChecked ? 'checked': ''}/>*/}
            {/*<label className="form-check-label" htmlFor="dropdownCheck2">*/}
            {/*URL*/}
            {/*</label>*/}
            {/*</div>*/}
            {/*<div className="form-check">*/}
            {/*<input type="checkbox" className="form-check-input" id="dropdownCheck2" defaultChecked={titleChecked ? 'checked':''} />*/}
            {/*<label className="form-check-label" htmlFor="dropdownCheck2">*/}
            {/*Title*/}
            {/*</label>*/}
            {/*</div>*/}
            {/*</div>*/}
            {/*</div>*/}
            {/*</div>*/}
          </div>
        </section>
      </ErrorBoundary>
    );
  }
}
Search.propTypes = {
  regex: PropTypes.bool,
  case: PropTypes.bool,
  searchIn: PropTypes.array,
};

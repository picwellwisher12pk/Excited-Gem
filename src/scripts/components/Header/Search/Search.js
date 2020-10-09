import React from 'react';
import {connect} from 'react-redux';
import ACTIONS from '../../../modules/action';
import ErrorBoundary from '../../../ErrorBoundary';
import {FontAwesomeIcon as FA} from '@fortawesome/react-fontawesome';
import {faSearch} from '@fortawesome/free-solid-svg-icons/faSearch';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.searchField = React.createRef();
    this.title = React.createRef();
    this.url = React.createRef();
  }

  onKeyUpped(event) {
    // console.info('keypressed', event.target, this);
    this.searchField.current.value !== '' ? this.setState({empty: false}) : this.setState({empty: true});
    if (event.keyCode === 27) {
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
    let searchIn = this.props.searchIn;
    searchIn[number] = !this.props.searchIn[number];
    // this.props.setPreferences('search', 'searchIn', searchIn);
    this.props.toggleSearchInAction(searchIn);
    // this.props.searchInTabs(this.searchField.current.value);
  }
  render() {

    let searchIn = this.props.searchIn;
    let placeholder = 'Search in ';
    placeholder += this.props.searchIn[0] ? 'Titles' : '';
    placeholder += this.props.searchIn[0] && this.props.searchIn[1] ? ' and ' : '';
    placeholder += this.props.searchIn[1] ? 'URLs' : '';
    console.log("Search Render", this.props.empty);
    let iconInSearch = this.props.empty ?
      <FA icon={faSearch} className={`text-secondary`} style={{width: '40px', height: '43px', padding: '12px'}}/> :
      <FA icon={faTimes} className={`text-danger cp`} style={{width: '40px', height: '43px', padding: '12px'}}
          onClick={() => {
            if (!this.props.empty) this.clear()
          }}/>;
    return (
      <ErrorBoundary>
        <section className="search-bar" style={{ width: '66%', paddingRight: 0 }}>
          <div id="filter-tabs" className="input-group filter-tabs">
            {iconInSearch}
            <i className={`quicksearch-input form-control`}
               style={{maxWidth: '10px', border: 'none', lineHeight: '28px'}}>/</i>
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
            <i className={`quicksearch-input form-control`}
               style={{maxWidth: '10px', border: 'none', lineHeight: '28px'}}>/</i>
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
          </div>
        </section>
      </ErrorBoundary>
    );
  }
}


const mapStateToProps = function (state) {
  return {
    regex: state.preferences.search.regex,
    ignoreCase: state.preferences.search.ignoreCase,
    searchIn: state.preferences.search.searchIn,
    empty: state.preferences.search.empty,
  };
};
const mapDispatchToProps = dispatch => ({
  searchInTabs: searchTerm => dispatch(ACTIONS.searchInTabs(searchTerm)),
  toggleSearchInAction: searchInArray => dispatch(ACTIONS.toggleSearchInAction(searchInArray))
});
export default connect(mapStateToProps, mapDispatchToProps)(Search);

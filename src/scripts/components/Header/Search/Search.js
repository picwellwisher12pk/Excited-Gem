import React from 'react';
const Search = () => (
  <section className="search-bar" style={{width: '66%'}}>
    <div id="filter-tabs" className="input-group filter-tabs">
      <input id="quicksearch-input" type="text" placeholder="Search in Tab URL or Title" aria-label="..." className="quicksearch-input form-control regex" />
      <div className="input-group-append option-regex">
        <div className="custom-control custom-checkbox ">
          <input type="checkbox" className="custom-control-input" id="filter-type-option-id" />
            <label className="custom-control-label input-group-text" htmlFor="filter-type-option-id">Regex</label>
        </div>
      </div>
      <div className="input-group-append option-case-sensitive">
        <div className="custom-control custom-checkbox ">
          <input type="checkbox" className="custom-control-input" id="filterCase-option-id" />
            <label className="custom-control-label input-group-text" htmlFor="filterCase-option-id">Case Sensitive</label>
        </div>
      </div>
      <div className="input-group-append" style={{position: "relative"}}>
        <button className="btn btn-warning dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Search From</button>
        <div className="dropdown-menu dropdown-menu-right">
          <div className="px-4 py-3">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="dropdownCheck2" />
                <label className="form-check-label" htmlFor="dropdownCheck2">
                  URL
                </label>
            </div>
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="dropdownCheck2" />
                <label className="form-check-label" htmlFor="dropdownCheck2">
                  Title
                </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
export default Search;


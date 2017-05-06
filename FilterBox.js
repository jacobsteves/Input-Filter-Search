import React from 'react';
import '../stylesheets/FilterBox.css';

'use strict'


var defaultMaxText = '+# more not shown';

var defaultFilter = function(filterText, optionName) { // also optionIndex as third arg
  return (optionName.toLowerCase().indexOf(filterText.toLowerCase()) >= 0);
};

var genLength = function(list) {
  // deal with both regular arrays and immutablejs objects, which have .count() instead of length
  return (typeof list.count !== 'undefined' ? list.count() : list.length);
};

var genGet = function(list, i) {
  // deal with both regular arrays and immutablejs objects, which have list.get(i) instead of list[i]
  return (typeof list.get !== 'undefined' ? list.get(i) : list[i]);
};

var caseInsensIndexOf = function(list, str) {
  var lowerList = list.map(function(item) { return item.toLowerCase(); });
  return lowerList.indexOf(str.toLowerCase());
};

class FilterBox extends React.Component {

  constructor() {
    super();
    this.state = {
      inputValue: '',
      open: false,
      courseListing: ['CS100', 'CS135', 'CS136', 'CS240', 'CS241'],
      courseBackup: ['CS100', 'CS135', 'CS136', 'CS240', 'CS241']
    };
  }

  printNames(){
      const { courseListing } = this.state;
      return courseListing.map((cur, i) => {
        return (
          <div className='FilterBoxItem' key={i}>
            {cur}
          </div>
        );
      });
  }

  handleInputChange(e) {
    this.setState({
      inputValue: e.target.value,
      courseListing: this.state.courseBackup.filter((cur) => {return cur.toLowerCase().includes(e.target.value.toLowerCase())})
    })
    console.log(this.state.courseListing);
  }

  handleInputClick(e) {
    e.preventDefault(),
    this.setState({
      open: !this.state.open
    });
  }

  renderContent() {
    return (
      <div className="FilterBoxDropDown">
        <form onSubmit={(e) => preventDefault(e)}>
        <input onClick={(e) => this.handleInputClick(e)} onChange={(e) => this.handleInputChange(e)} type="text" className="FilterBoxInput"></input>
          <div className="divider">
          { this.state.open ? this.printNames() : null }
          </div>
        </form>
      </div>
    );
  }

  render() {
    return (
      <center>
      <div className='results'>
        { this.renderContent() }
      </div>
      </center>
    );
  }
}

export default FilterBox;

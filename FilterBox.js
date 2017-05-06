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
      Response: 'none',
      courseListing: ['CS100', 'CS135', 'CS136', 'CS240', 'CS241'],
      courseBackup: ['CS100', 'CS135', 'CS136', 'CS240', 'CS241']
    };
  }

  static propTypes: {
    max: React.PropTypes.number.isRequired,
    handleSelect: React.PropTypes.func.isRequired
  }

  printNames(){
    const { courseListing } = this.state;
    let items = courseListing.slice(0, this.props.max + 1);
    let remaining = courseListing.length - items.length;
    let count = 0;
    let response = 'And ' + remaining + ' others';
    return items.map((cur, i) => {
      if(count != this.props.max){
        ++count;
        return (
          <div className='FilterBoxItem' key={i}>
            {cur}
          </div>
        );
      } else if(remaining > 0) {
        return (
          <div className='FilterBoxItem' key={i}>
            <i>{response}</i>
          </div>
        );
      }
    });
  }

  handleInputChange(e) {
    this.setState({
      inputValue: e.target.value,
      courseListing: this.state.courseBackup.filter((cur) => {return cur.toLowerCase().includes(e.target.value.toLowerCase())})
    })
  }

  handleInputClick(e) {
    e.preventDefault(),
    this.setState({
      open: !this.state.open
    });
  }

  handleOffFocus(){
    this.setState({ open: !this.state.open })
  }

  handleInputSubmit(e){
    e.preventDefault();
    const { inputValue } = this.state;
    let courseListing = this.state.courseBackup.map((cur, i) => {
      return cur.toLowerCase();
    });
    const index = courseListing.indexOf(inputValue.toLowerCase());
    this.setState({
      courseListing: []
    });
    this.handleSelect(inputValue, index);
  }

  handleSelect(choice, index){
    if (index>=0) {
      this.setState({Response: choice + ' is a nice choice'});
    } else {
      this.setState({Response: choice + ' isn\'t on the list!'});
    }
  }

  renderContent() {
    return (
      <div className="FilterBoxDropDown">
        <form onSubmit={(e) => this.handleInputSubmit(e)}>
          <input
            onFocus={(e) => this.handleInputClick(e)}
            onChange={(e) => this.handleInputChange(e)}
            onBlur={() => this.handleOffFocus()}
            type="text"
            className="FilterBoxInput">
          </input>
            <div className="divider">
            { this.state.open ? this.printNames() : null }
            </div>
            <p>{ this.state.Response }</p>
        </form>
      </div>
    );
  }

  render() {
    return (
      <div className='results'>
        { this.renderContent() }
      </div>
    );
  }
}

export default FilterBox;

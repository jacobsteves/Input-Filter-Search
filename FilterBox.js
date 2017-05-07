import React from 'react';
import '../stylesheets/FilterBox.css';

'use strict'

class FilterBox extends React.Component {

  constructor() {
    super();
    this.state = {
      inputValue: '',
      courseListing: ['CS100', 'CS135', 'CS136', 'CS240', 'CS241'],
      courseBackup: ['CS100', 'CS135', 'CS136', 'CS240', 'CS241']
    };
  }

  printNames(){
      const { courseListing } = this.state;
      return courseListing.map((cur, i) => {
        return (
          <div className='item' key={i}>
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

  renderContent() {
    return (
      <form onSubmit={(e) => preventDefault(e)}>
      <input onChange={(e) => this.handleInputChange(e)} type="text"></input>
      </form>
    );
  }

  render() {
    return (
      <center>
      <div className='results'>
        { this.renderContent() }
        { this.printNames() }
      </div>
      </center>
    );
  }
}

export default FilterBox;

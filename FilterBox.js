import React from 'react';
import '../stylesheets/FilterBox.css';

'use strict'

class FilterBox extends React.Component {

  constructor() {
    super();
    this.state = {
      start: true,
      inputValue: '',
      open: false,
      Response: '',
      currentIndex: -1,
      lastVal: '',
      courseListing: null,
      courseBackup: null,
      clickedList: null
    };
  }

  static propTypes: {
    max: React.PropTypes.number.isRequired,
    handleSelect: React.PropTypes.func.isRequired,
    objects: React.PropTypes.list.isRequired,
    caseSensitive: React.PropTypes.bool
  }

  componentWillMount(){
    let newList = this.props.objects;
    let newLen = this.props.objects.length;
    this.setState({
      start: false,
      courseListing: newList,
      courseBackup: newList,
      clickedList: Array(newLen).fill('n')
    })
  }

  setObjectState(){
  }

  handleInputChange(e) {
    const filteredList = this.state.courseBackup.filter((cur) => {
      return (
        this.props.caseSensitive ?
        cur.includes(e.target.value) :
        cur.toLowerCase().includes(e.target.value.toLowerCase())
      );
    });
    this.setState({
      inputValue: e.target.value,
      courseListing: filteredList
    })
  }

  handleInputClick(e) {
    e.preventDefault(),
    this.setState({
      open: !this.state.open
    });
  }

  handleOffFocus(e){
    const { currentIndex } = this.state;
    const { courseBackup } = this.state
    if(currentIndex >= 0){
      const value = courseBackup[currentIndex];
      this.setState({ currentIndex: -1 });
      this.handlePresetClick(e, value);
    } else {
      this.setState({ open: false })
    }
  }

  handleInputSubmit(e){
    e.preventDefault();
    const { currentIndex } = this.state;
    if(currentIndex >= 0) {
      const { courseBackup } = this.state;
      const value = courseBackup[currentIndex];
      this.setState({
        lastVal: value,
        inputValue: value,
        courseListing: value
      });
      this.handlePresetClick(e, value);
    } else {
      const { inputValue } = this.state;
      let courseListing = this.state.courseBackup.map((cur, i) => {
        return cur.toLowerCase();
      });
      const index = courseListing.indexOf(inputValue.toLowerCase());
      this.setState({
        courseListing: [],
        lastVal: inputValue
      });
      this.props.handleSelect(inputValue, index);
    }
    document.getElementById("FilterBoxInput").blur();
  }

  handleSelect(choice, index){
    if (index>=0) {
      this.setState({Response: choice + ' is a nice choice'});
    } else {
      this.setState({Response: choice + ' isn\'t on the list!'});
    }
  }

  handlePresetClick(e, value) {
    e.preventDefault();
    let courseListing = this.state.courseBackup.map((cur, i) => {
      return cur.toLowerCase();
    });
    const index = courseListing.indexOf(value.toLowerCase());
    this.setState({
      open: false,
      inputValue: value,
      currentIndex: -1,
      currentClicked: value,
      courseListing: value
    });
    this.props.handleSelect(value, index);
  }

  handlePresetEnter(value){
    let courseListing = this.state.courseBackup.map((cur, i) => {
      return cur.toLowerCase();
    });
    const index = courseListing.indexOf(value.toLowerCase());
    this.setState({
      currentIndex: index,
      currentClicked: value
    });
  }

  handlePresetExit(value){
    let courseListing = this.state.courseBackup.map((cur, i) => {
      return cur.toLowerCase();
    });
    const index = courseListing.indexOf(value.toLowerCase());
    this.setState({
      currentIndex: -1,
      currentClicked: null
    })
  }

  handleKeyDown(e){
    let index = this.state.currentIndex;
    switch(e.keyCode){

      // Up Arrow Clicked
      case 38:
      if(index >= 1) {
        this.setState({
          currentIndex: index - 1,
          currentClicked: this.props.objects[index - 1]
        })
      } else {
        this.setState({
          currentIndex: this.props.max,
          currentClicked: this.props.objects[this.props.max - 1]
        })
      }
      break;

      // Down arrow clicked
      case 40:
      if(index < this.props.max - 1) {
        this.setState({
          currentIndex: index + 1,
          currentClicked: this.props.objects[index + 1]
        })
      } else {
        this.setState({
          currentIndex: 0,
          currentClicked: this.props.objects[0]
        })
      }
      break;

      // Enter clicked
      case 13:
      break;
    }
  }

  printNames(){
    const { courseListing } = this.state;
    let items = courseListing.slice(0, this.props.max + 1);
    let remaining = courseListing.length - items.length + 1;
    let count = 0;
    let response = 'And ' + remaining + ' others';
    return items.map((cur, i) => {
      if(count != this.props.max){
        ++count;
        return (
          <div className={this.state.currentClicked === cur ? 'entrySelected' : 'entry'} key={i}
            onClick={(e) => this.handlePresetClick(e, cur)}
            onMouseEnter={() => this.handlePresetEnter(cur)}
            onMouseLeave={() => this.handlePresetExit(cur)}>
            {cur}
          </div>
        );
      } else if(remaining > 0) {
        return (
          <div className='n' key={i}>
            <i>{response}</i>
          </div>
        );
      }
    });
  }

  renderContent() {
    return (
      <div className="FilterBoxDropDown">
        <form onSubmit={(e) => this.handleInputSubmit(e)} autoComplete={"off"}>
          <input
            onFocus={(e) => this.handleInputClick(e)}
            onChange={(e) => this.handleInputChange(e)}
            onBlur={(e) => this.handleOffFocus(e)}
            onKeyDown={(e) => this.handleKeyDown(e)}
            value={this.state.inputValue}
            type="text"
            className="FilterBoxInput"
            id="FilterBoxInput"
            placeholder="Find Subject">
          </input>
          <input type="submit" className="hiddenSubmit"></input>
            <div className="divider">
            { this.state.open ? this.printNames() : null }
            </div>
            <p>{ this.state.Response }</p>
        </form>
      </div>
    );
  }

  render() {
    if (this.state.start) {
      this.setObjectState();
    }
    return (
      <div className='results'>
        { this.renderContent() }
      </div>
    );
  }
}

FilterBox.defaultProps = {
  max: 10,
  caseSensitive: false
};

export default FilterBox;

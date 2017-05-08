import React from 'react';
import $ from 'jquery';
import '../stylesheets/FilterBox.css';

'use strict'

var caseInsensIndexOf = function(list, str) {
  var lowerList = list.map(function(item) { return item.toLowerCase(); });
  return lowerList.indexOf(str.toLowerCase());
};

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
      clickedList: null // 'n' = no, not clicked; 'y' = yes, clicked
    };
  }

  static propTypes: {
    max: React.PropTypes.number.isRequired,
    handleSelect: React.PropTypes.func.isRequired,
    objects: React.PropTypes.list.isRequired
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
        lastVal: value
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
    $('#FilterBoxInput').blur(); //Deselect the input box
    $('#FilterBoxInput').val('');
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
    let newClicked = this.state.clickedList;
    newClicked[index] = 'n';
    this.setState({
      open: false,
      currentIndex: -1,
      clickedList: newClicked
    });
    this.props.handleSelect(value, index);
  }

  handlePresetEnter(value){
    let courseListing = this.state.courseBackup.map((cur, i) => {
      return cur.toLowerCase();
    });
    const index = courseListing.indexOf(value.toLowerCase());
    let newClicked = this.state.clickedList;
    newClicked[index] = 'y';
    this.setState({
      currentIndex: index,
      clickedList: newClicked
    });
  }

  handlePresetExit(value){
    let courseListing = this.state.courseBackup.map((cur, i) => {
      return cur.toLowerCase();
    });
    const index = courseListing.indexOf(value.toLowerCase());
    let newClicked = this.state.clickedList;
    newClicked[index] = 'n';
    this.setState({
      currentIndex: -1,
      clickedList: newClicked
    })
  }

  handleKeyDown(e){
    let index = this.state.currentIndex;
    switch(e.keyCode){
      case 38: //This is the up arrow
      console.log("up");
      if(index >= 1) {
        let newClicked = this.state.clickedList;
        newClicked[index] = 'n';
        newClicked[index - 1] = 'y';
        this.setState({
          currentIndex: index - 1,
          clickedList: newClicked
        })
      } else {
        let newClicked = this.state.clickedList;
        newClicked[0] = 'n';
        newClicked[this.props.max] = 'y';
        this.setState({
          currentIndex: this.props.max,
          clickedList: newClicked
        })
      }
      console.log(index);
      break;

      case 40: //This is the down arrow
      console.log("down");
      if(index < this.props.max) {
        let newClicked = this.state.clickedList;
        newClicked[index] = 'n';
        newClicked[index + 1] = 'y';
        this.setState({
          currentIndex: index + 1,
          clickedList: newClicked
        })
      } else {
        let newClicked = this.state.clickedList;
        newClicked[0] = 'y';
        newClicked[this.props.max] = 'n';
        this.setState({
          currentIndex: 0,
          clickedList: newClicked
        })
      }
      console.log(index);
      break;

      case 13: //This is enter
      console.log("enter");
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
          <div className={this.state.clickedList[count - 1]} key={i}
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
    $(".FilterBoxInput").attr("autoComplete", "off"); //Disable autocomplete for our input
    return (
      <div className="FilterBoxDropDown">
        <form onSubmit={(e) => this.handleInputSubmit(e)}>
          <input
            onFocus={(e) => this.handleInputClick(e)}
            onKeyUp={(e) => this.handleInputChange(e)}
            onBlur={(e) => this.handleOffFocus(e)}
            onKeyDown={(e) => this.handleKeyDown(e)}
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

export default FilterBox;

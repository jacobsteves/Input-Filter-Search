# InputFilterSearch
An input box that uses React to filter through an array of data to match the text inputted as characters are entered.

## Demo
[![https://gyazo.com/443e0c02721db5b6e31817cb04b46753](https://i.gyazo.com/443e0c02721db5b6e31817cb04b46753.gif)](https://gyazo.com/443e0c02721db5b6e31817cb04b46753)
## SetUp
Simply put FilterBox.js and FilterBox.css (you may want to edit the stylesheet reference in FilterBox.js) in your React project. Include FilterBox.js in the file you want to use it in, and in some render function, put: <br /><br />
`<FilterBox max={yourNumber} objects={yourListOfObjects} handleSelect={this.yourHandleSelectFunction()}>`

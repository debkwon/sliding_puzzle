//This is the object that will hold all the functions for our Sliding Puzzle, or 15-Puzzle
//At the bottom of this file, the tiles are set up for a 4x4 grid, but this can be changed to another fixed size, or you could add a drop down menu for letting user choose. The value selected would call the setUpTiles
let slidingPuzzle = {
  //the setUpTiles function will add <tr> and <td> elements to the table in the html file. This is our puzzle box. Each tile or space in the puzzle box will have an id with x,y coordinates representing width and depth start from the top left corner
  setUpTiles: function(boxSize) {
    let tiles = document.createElement('tbody');
    let puzzleBox = document.getElementById('puzzleBox');
    let tilesHtml = "";
    let shuffledNums = this.shuffle(this.numsOnTiles(boxSize));
    //creating a grid, row by row
    for (let width = 1; width <= boxSize; width++){
      tilesHtml += "<tr>";
      for (let depth = 1; depth <= boxSize; depth++){
        let currentNum = shuffledNums.pop();
        if (currentNum == '0'){
          tilesHtml += `<td id='${depth},${width}' class='blank'></td>`;
        }
        else tilesHtml += `<td id='${depth},${width}' class='tiles'>${currentNum}</td>`;
      }
      tilesHtml += "</tr>";
    }

    tiles.innerHTML = tilesHtml;
    puzzleBox.appendChild(tiles);
    this.makeClickable(boxSize);
  },
  //depending on the size of the puzzle box, this function returns an array with all numbers, starting from 1 to the one less than the number of spaces available
  numsOnTiles: function(boxSize){
    let highestNum = (boxSize*boxSize); //where a boxSize of 4 would generate numbers for a 4x4 grid
    let allNums = [];
    for (let i = 0; i < highestNum; i++){
      allNums.push(i.toString());
    }
    return allNums; //all the numbers in string format, from '0'...'15' for a 4x4 grid, where '0' will represent the empty space
  },
  //this shuffle function will take an array of numbers and return a shuffled array of those numbers, so our puzzle will have differently arranged tiles with each game
  shuffle: function(arrOfNums){
    let shuffled = [];
    let maxLength = arrOfNums.length;
    //remove an item from the arr at a random index, and add it to our final shuffled array
    while (shuffled.length < maxLength){
      let idx = Math.floor(Math.random()*arrOfNums.length);
      shuffled.push(arrOfNums.splice(idx,1));
    }
    return shuffled;
  },
  //here we add event listeners that will listen for clicks on tiles
  makeClickable: function(boxSize){
    let slidingPuzzle = this;
    let checkMove = this.checkMove.bind(slidingPuzzle);

    for (let width = 1; width <= boxSize; width++){
      for (let depth = 1; depth <= boxSize; depth++){
        let currTile = document.getElementById(`${width},${depth}`);
        if (document.addEventListener) {
          currTile.addEventListener("click", function(e){
            checkMove(e.target.id, e.target.innerHTML)//this is the position and value of clicked tile, and id of current blank tile
          })
        }
        else if (document.attachEvent) {
          currTile.attachEvent("onclick", function(e){
            checkMove(e.target.id, e.target.innerHTML, blankSpace);
          })
        }
      }
    }
  },//end of makeTilesMove
  //checkMove will check how to handle a click on a tile. depending on the tile's position relative to the empty space in the puzzle box, the tiles may shift over
  //need to re-factor this
  checkMove: function(clickedPos, clickedVal){
    let blankPos = document.getElementsByClassName('blank')[0].id; //there is only one blank tile, and we want it's current position
    let clickX = clickedPos.slice(0, clickedPos.indexOf(','));
    let clickY = clickedPos.slice(clickedPos.indexOf(',')+1);
    let blankX = blankPos.slice(0, blankPos.indexOf(','));
    let blankY = blankPos.slice(blankPos.indexOf(',')+1);
    let tilesToShift = [];
    //we only want to move tiles when they are in a row or column with the blank space
      if (clickX === blankX && clickY !== blankY) { //if the tile and blank space have a common width, or x-coordinate
        if (blankY > clickY){//if the blank space is below our clicked tiled, we want to shift down
          for (let y = clickY; y < blankY; y++) {
            tilesToShift.push(document.getElementById(`${clickX},${y}`).innerHTML); //we are grabbing all relevant tile values
          }
          for (let shifted = +(clickY)+1; shifted <= blankY; shifted++){
            document.getElementById(`${clickX},${shifted}`).innerHTML = tilesToShift.shift(); //we update the tile values
          }
        }
        else {
          for (let y = clickY; y > blankY; y--) {
            tilesToShift.push(document.getElementById(`${clickX},${y}`).innerHTML);
          }
          for (let shifted = +(clickY)-1; shifted >= blankY; shifted--){
            document.getElementById(`${clickX},${shifted}`).innerHTML = tilesToShift.shift();
          }
        }
        this.updateTileStyle(blankPos, clickedPos);
      }
      else if (clickY === blankY && clickX !== blankX) { //else if the tile and blank space only share a y-coordinate
        if (blankX > clickX){ //if the blank tile is to the right of the clicked tile
          for (let x = clickX; x < blankX; x++) { //increase x, or width, as you move from left to right
            tilesToShift.push(document.getElementById(`${x},${clickY}`).innerHTML);
          }
          for (let shifted = +(clickX)+1; shifted <= blankX; shifted++){
            document.getElementById(`${shifted},${clickY}`).innerHTML = tilesToShift.shift();
          }
        }
        else { //if going from right to left, decrease x
          for (let x = clickX; x > blankX; x--) {
            tilesToShift.push(document.getElementById(`${x},${clickY}`).innerHTML);
          }
          for (let shifted = +(clickX)-1; shifted >= blankX; shifted--){
            document.getElementById(`${shifted},${clickY}`).innerHTML = tilesToShift.shift();
          }
        }
        this.updateTileStyle(blankPos, clickedPos);
    } //big else if statement
  }, //check move closing
  //updateTileStyle make sure to add and remove styling after a shift is made in the puzzle box
  updateTileStyle: function(blankPos, clickedPos){
    let currBlank = document.getElementById(blankPos);
    let newBlank = document.getElementById(clickedPos);
    newBlank.innerHTML = ''; //also updates clicked tile that ends up moving to be new blank tile
    currBlank.classList.remove('blank');
    currBlank.classList.add('tiles');
    newBlank.classList.add('blank');
  }//closing updateTileStyle
}//closing for slidingPuzzle

slidingPuzzle.setUpTiles(4);

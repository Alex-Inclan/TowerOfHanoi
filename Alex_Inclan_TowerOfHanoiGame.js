// TowerOfHanoi
const readline = require('readline-sync');
let size; //defined by user, used throughout the program

//-----------------------------------------------

//This class stores the location of each game piece in a class
//2d array representing each row and column
class Columns {
  constructor (c){
    this.c = c
  }

  //swaps a free space in a column with a top piece from another column
  //also checks for game play errors
  movePiece = (from, to) => {
    if(to === from){return '\x1b[41m\x1b[30mIllegal move, the to and from rows must be different \x1b[0m';}
    for(let i = 0; i < size; i++) {
      if (this.c[from][i] !== 0 ){
        for(let j = size-1; j >=0; j--) {
          if (this.c[to][j] === 0){
            if(this.c[from][i] > this.c[to][j+1]&& this.c[to][j+1]!==0){
              return '\x1b[41m\x1b[30mIllegal move, cannot place piece over a smaller piece, try again\x1b[0m';
            }
           this.c[to][j] = this.c[from][i];//swap
           this.c[from][i]= 0;  //swap
           return 'Your piece was moved successfully';
          }
        }
      }
    }
    return '\x1b[41m\x1b[30mIllegal move, There are no pieces in the from column, try again\x1b[0m';  
  }

  // resets the array to the starting condition
  reset(){this.c=resetGame()}
}

//sets starting values for the Column class
const resetGame = () => {
  let col1 = [];
  let col2 = [];
  let col3 = [];
  for(let i = 1; i <= size; i++) {
    col1.push(i);
    col2.push(0);
    col3.push(0);
  }
  return [col1,col2,col3];
}

//Creates a game piece or post based on the value on the location
const addGamePiece = (piece) => {//highest piece size is base
  let disc="";
  let space = ""; 
  if (piece === 0)
    return addPost(); 
  piece--;
  for (let i = 0; i <(size-piece-1); i++) {
      space += " ";
  }
  for (let j = 1; j <= 2*piece + 1; j++) {
    disc+='*';
  
  } 
  return space+disc+space;
}

//Creates a post when there is no piece
const addPost = () => {
  let space = " ".repeat(size-1);  
  return space+'|'+space;
};

//Creates a base for each row
const addBase = (colNumber) => {
  let base = "-\u0305".repeat(size-1); //a dash with an over-line
  if (size<3 && colNumber===3){//ensures game prints to console ok if board is too small
    //add spaces to the third base so board looks normal if under 3 pieces
    return base+colNumber+base+'                                                     ';
  }else{return base+colNumber+base;}
}

//Prints out game-board and pieces in its current state
const printAll = () => {
  let arr = [];
  let color = '\x1b[36m'
  for (let i = 0; i < size; i++) {
    arr.push([[addGamePiece(columns.c[0][i])],
              [addGamePiece(columns.c[1][i])],
              [addGamePiece(columns.c[2][i])]].join(" "));
  }
  arr.push([addBase(1),addBase(2),addBase(3)].join("-\u0305"));
  console.log(arr);
}

//determine which direction to run the auto-finisher based on game piece locations
//if the player was on the right tack go forward, if not go backwards
const autoFinisher=()=>{
  console.log('JavaScript will', "\x1b[31m\x1b[4m" + 'attempt' + "\x1b[0m", 'to solve the puzzle for you')
  readline.question('Press any key to continue');
  //checks for nothing played
  if ((columns.c[1][size-1]===0) && (columns.c[2][size-1]===0)){
    showSolution(size,0,2,1)
    if (columns.c[2][0]===1){winner();}
  // checks has player gone the wrong way
  }else if ((columns.c[1][size-1]%2===size%2)||//checks bottom row and compares itself with the size odd should land on 2 even on 1
    (columns.c[2][size-1]%2!==size%2)){
      showSolution(size-1, 2, 0, 1) //backwards
      if (columns.c[2][0]===1){winner();}
  }else{
    showSolution(size,0,2,1)
    if (columns.c[2][0]===1){winner();}
  }
}

//algorithm to solve game + check to see if the game has been reset or won
const showSolution = (qty, fromPeg, toPeg, tempPeg) => { 
  if (qty > 0){
    showSolution(qty - 1, fromPeg, tempPeg, toPeg);
    columns.movePiece(fromPeg, toPeg);
    printAll();
    //checks if game was reset
    if (columns.c[0][0]===1){showSolution(size, 0, 2, 1)}
    showSolution(qty - 1, tempPeg, toPeg, fromPeg);
  }
}

//Prints message when player wins then resets the game board and returns to the menu
const winner = () => {
  console.log ('\x1b[33m%s\x1b[0m','You win');
  columns.reset();
  menu();
}

//changes the size of the gameboard
const changeSize = () => {
  size = readline.question(
    '\x1b[33mHow many game Pieces would you like to play with?\x1b[0m  ');
  return parseInt(size);
}

//This is how the player manually moves the game pieces
//Calls itself until the game is won or the player breaks out of in game menu
const playGame = () => {
  console.log('\x1b[36m%s\x1b[0m','\n    In Game Menu',
    '\nColumn 1-3 : Continue',
    '\n7 : Auto Finish',
    '\n8 : Return to the Main Menu',
    '\n9 : Exit the game')  
  printAll()
  console.log('\x1b[33m%s\x1b[0m','Select the From column')
  let from = inGameMenu();
  if (from <= 3) {
    console.log('\x1b[33m%s\x1b[0m','Select the To column')
    let to = inGameMenu();
    if (to <= 3) {
      console.log(columns.movePiece (from, to));//the move, inside a console to print the errors
      if (columns.c[2][0]===1){
        printAll(); 
        winner();
      }else {playGame()};
    }
  }
}

//This is the in game menu
const inGameMenu = () => {                
  switch(readline.question('')) {
  case '1': 
    return 0;
  case '2':
    return 1;
  case '3':
    return 2;
  case '7':
      autoFinisher()
      break;
  case '8':
      menu();
      break;
  case '9'://quit
    console.log('Bye, thanks for playing')
      break;
  default:
    console.log('\x1b[41m\x1b[30m%s\x1b[0m', 'Invalid Selection')
    return inGameMenu();
  } 
}

//This is the main menu
const menu = () => {
  console.log('\x1b[36m%s\x1b[0m','\n    Main Menu',
            '\n1 : Play the Game',
            '\n2 : See the Solution',
            '\n3 : Change the # of Pieces',
            '\n4 : Exit the Game')                       
  switch(readline.question('')) {
    case '1'://play game
      playGame();
      break;
    case '2'://see solution
      showSolution(size,0,2,1)
      columns.reset();
      menu();
      break;
    case '3'://change size
      size = changeSize();
      columns.reset();
      printAll();
      menu();
      break;
    case '4'://quit
      console.log('Bye, Thanks for playing')
      break;
    default:
      console.log('\x1b[41m\x1b[30m%s\x1b[0m', 'Invalid Selection')
      menu();
  } 
}

//Only runs once at the start of the program
const introScreen = () => { 
  console.log('\n'.repeat(15))
  console.log('\t     \x1b[47m\x1b[30m%s\x1b[0m',' Welcome to the ')
  console.log('\t\x1b[47m\x1b[30m%s\x1b[0m',' Tower of Hanoi Puzzle Game ')
  console.log('\t     \x1b[47m\x1b[30m%s\x1b[0m',' By Alex Inclan ')
  console.log('\n'.repeat(7))
  size = changeSize()//Initial size set
}

//-----------------------------------------------
//Game Play
introScreen()//Prints out intro screen
const columns = new Columns(resetGame());//Initializes game board
printAll()//Prints current state of the game board
menu();//Main Menu







import React, { Component } from "react";
import Cell from "./Cell";

var startingNumbers = 39;
var numbersCount = startingNumbers;
var invalidEntries = [];

var currMistakesNumber = 0;
var boardFrozen = false;

class frequencyCounter {
  constructor() {
    this.fqarr = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  }

  incrementCount(value) {
    if (value === -1 || value > 9) return true;

    ++this.fqarr[value - 1];
    if (this.fqarr[value - 1] !== 1) return false;
    else return true;
  }

  isComplete() {
    for (let count of this.fqarr) if (count !== 1) return false;
    return true;
  }

  reset() {
    for (let ix in this.fqarr) this.fqarr[ix] = 0;
  }
}

function checkIfValid(grid, i, j) {
  if (grid[i][j]["number"] === -1) return true;

  let validator = new frequencyCounter();
  //rows
  for (let elem of grid[i])
    if (!validator.incrementCount(elem["number"])) return false;
  validator.reset();

  // columns
  for (let row of grid)
    if (!validator.incrementCount(row[j]["number"])) return false;
  validator.reset();

  // 3x3 square
  for (let sqi = i - (i % 3); sqi < i - (i % 3) + 3; ++sqi)
    for (let sqj = j - (j % 3); sqj < j - (j % 3) + 3; ++sqj)
      if (!validator.incrementCount(grid[sqi][sqj]["number"])) return false;

  return true;
}

function generateRandomCompleteRow() {
  var newArr = [];
  let helperArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  for (let i = 0; i < 9; ++i) {
    let idx = Math.floor(Math.random() * helperArray.length);
    newArr.push({
      isDefault: true,
      number: helperArray[idx],
      color: "whiteColor"
    });
    helperArray.splice(idx, 1);
  }

  return newArr;
}

function doShift(arr, howMany) {
  if (!howMany) return arr;
  return Array.from(arr.slice(howMany).concat(arr.slice(0, howMany)));
}

function generateRandomGrid() {
  var grid = [];
  let i, j, cnt;
  const resArr = generateRandomCompleteRow();
  const shiftArr = [0, 3, 3, 1, 3, 3, 1, 3, 3];

  grid.push(resArr);
  for (let i = 1; i < 9; ++i) grid.push(doShift(grid[i - 1], shiftArr[i]));

  // remove 81 - n numbers
  cnt = 0;
  while (cnt < 81 - startingNumbers) {
    i = Math.floor(Math.random() * 9);
    j = Math.floor(Math.random() * 9);
    if (grid[i][j]["number"] === -1) continue;
    grid[i][j] = {
      number: -1,
      isDefault: false,
      color: "whiteColor"
    };

    ++cnt;
  }

  return grid;
}

class Grid extends Component {
  state = {
    grid: generateRandomGrid()
  };

  computeStartingNumbers() {
    let intervalRemovalHelper = 35;
    let intervalRemovalHelperHardMode = 25;
    let intervalSize = 5;

    if (!this.props.hardMode)
      return intervalRemovalHelper + Math.floor(Math.random() * intervalSize);

    return (
      intervalRemovalHelperHardMode + Math.floor(Math.random() * intervalSize)
    );
  }

  handleDelete(i, j) {
    if (this.state.grid[i][j]["number"] !== -1) {
      this.handleNewValue(i, j, -1);
    }
  }

  formatRow(row, rowId) {
    function getClassIfCurrent(i, j, targetI, targetJ) {
      if (i === targetI && j === targetJ) return "targeted";
      else return "";
    }

    return (
      <tr key={rowId * 9}>
        {row.map((value, index) => (
          <Cell
            key={rowId * 9 + index}
            value={value}
            i={rowId}
            j={index}
            handleNewValue={this.handleNewValue}
            handleFocus={this.props.handleFocus}
            handleDelete={this.handleDelete}
            classIfCurrent={getClassIfCurrent(
              rowId,
              index,
              this.props.currentPosition["i"],
              this.props.currentPosition["j"]
            )}
            boardFrozen={boardFrozen}
            sound={this.props.sound}
          />
        ))}
      </tr>
    );
  }

  formatGrid(grid) {
    return (
      <table>
        <tbody>
          {grid.map((value, index) => this.formatRow(value, index))}
        </tbody>
      </table>
    );
  }

  handleNewValue(i, j, newValue) {
    if (boardFrozen) return;
    if (!newValue || newValue > 9 || newValue < 1) newValue = -1;
    let grid = [];
    for (let row of this.state.grid) {
      let copyRow = [];
      for (let elem of row) copyRow.push({ ...elem });

      grid.push(copyRow);
    }

    if (grid[i][j]["number"] !== newValue) this.props.resetMessageToOriginal();
    if (grid[i][j]["number"] !== -1 && newValue === -1) --numbersCount;
    else if (grid[i][j]["number"] === -1 && newValue !== -1) ++numbersCount;

    grid[i][j]["number"] = newValue;

    if (!checkIfValid(grid, i, j)) {
      if (this.props.mistakesMode) {
        ++currMistakesNumber;
        this.props.mistakesCounting(currMistakesNumber);
        if (currMistakesNumber >= 5) {
          this.props.mistakesNumberHit();
          boardFrozen = true;
          currMistakesNumber = 0;
        }
      }

      grid[i][j]["color"] = "redColor";
      invalidEntries.push([i, j]);
    } else {
      grid[i][j]["color"] = "whiteColor";
      let removeList = [];
      for (let ix in invalidEntries) {
        let elem = invalidEntries[ix];
        if (checkIfValid(grid, elem[0], elem[1])) {
          removeList.push(ix);
          grid[elem[0]][elem[1]]["color"] = "whiteColor";
        }
      }
      removeList.forEach((pos, index) => {
        invalidEntries.splice(pos - index, 1);
      });

      if (numbersCount === 81 && !invalidEntries.length) {
        this.props.gameFinished();
        boardFrozen = true;
      }
    }
    if (boardFrozen)
      for (let i in grid) for (let j in grid[i]) grid[i][j]["isDefault"] = true;

    this.setState({ grid });
  }

  constructor(props) {
    super(props);
    this.handleNewValue = this.handleNewValue.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.autofillFunction = () => {
      this.doAutoFill();
      boardFrozen = true;
    };
    this.emitterFunction = (newValue, i, j) => {
      this.handleNewValue(i, j, newValue);
    };

    this.props.autofillEmitter.on("autofillClicked", this.autofillFunction);
    this.props.emitter.on("numberButtonClicked", this.emitterFunction);

    boardFrozen = this.props.boardFrozen;
    currMistakesNumber = 0;

    startingNumbers = this.computeStartingNumbers();
  }

  doAutoFill() {
    if (boardFrozen) return;
    let grid = [];
    for (let row of this.state.grid) {
      let copyRow = [];
      for (let elem of row) copyRow.push({ ...elem });

      grid.push(copyRow);
    }

    let unfilledArr = [];
    for (let i in grid)
      for (let j in grid[i]) {
        if (grid[i][j]["number"] === -1) {
          unfilledArr.push([i, j]);
        } else if (grid[i][j]["color"] === "redColor") {
          grid[i][j]["color"] = "whiteColor";
          grid[i][j]["number"] = -1;
          unfilledArr.push([i, j]);
        }
      }

    let solFound = false;
    function doBacktracking(k) {
      if (k === unfilledArr.length) {
        solFound = true;
        return;
      }

      let i = unfilledArr[k][0];
      let j = unfilledArr[k][1];

      for (let val = 1; val <= 9; ++val) {
        if (solFound) return;

        grid[i][j]["number"] = val;

        if (checkIfValid(grid, i, j)) doBacktracking(k + 1);
      }
      if (!solFound) grid[i][j]["number"] = -1;
    }

    doBacktracking(0);
    if (solFound) {
      this.setState({ grid: grid });
      this.props.gameFinished();
    } else {
      this.props.noSolution();
    }
  }

  handleAutofillInGrid() {
    this.props.handleAutofill();
  }

  componentWillUnmount() {
    this.props.autofillEmitter.removeListener(
      "autofillClicked",
      this.autofillFunction
    );
    this.props.emitter.removeListener(
      "numberButtonClicked",
      this.emitterFunction
    );
  }

  render() {
    startingNumbers = this.computeStartingNumbers();

    return <React.Fragment>{this.formatGrid(this.state.grid)}</React.Fragment>;
  }
}

export default Grid;

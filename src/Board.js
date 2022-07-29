// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      //I: row index
      //O: boolean
      //C:
      //E:

      // strategy: get the row (array with row values), iterate through the array. If we see a 1 in any index, return false. otherwise, return true.
      var row = this.get(rowIndex);
      var counter = 0;
      // Note: Why doesn't this forEach function?
      // row.forEach(function(element) {
      //   if (element === 1) {
      //     counter++;
      //   }
      //   if (counter > 1) {
      //     return true;
      //   }
      // })
      for (var i = 0; i < row.length; i++) {
        if (row[i] == 1) {
          counter++;
        }
        if (counter > 1) {
          return true;
        }
      }


      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      //I:none
      //O: boolean
      //strat: get an array of rows. for each row, run hasRowConflictAt() and store the result. if hasRowConliftAt(), then return true. otherwise, return false.
      // var rows = window.Board.prototype.rows;
      var rows = this.rows();
      for (var i = 0; i < rows.length; i++) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }
        return false;
    },




    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      // I - colIndex (value)
      // O - boolean
      // C - none
      // E - none

      // Pseudocode / Strategy:
      // Get the board
      var rows = this.rows();
      var counter = 0;
      // check each index at each row to see if there is a conflict in the column
      for (var row of rows) {
        var colValue = row[colIndex];
        if (colValue === 1) {
          counter++;
        }
        if (counter > 1) {
          return true;
        }
      }
      // if conflict, return true, otherwise return false
      return false;

    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      // I - none.
      // O - boolean
      // C- none
      // E - none

      // Pseudocode:
      // use hasColConflictAt to check if each colIndex
      var numColumns = this.rows()[0].length;

      // iterate over colIndexes and calling function on each colIndex
      for (let i = 0; i < numColumns; i++) {
        // if hasColConflictAt returns true, then return true, otherwise return false
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      //I: majorDiagonal.... (top left to bottom right)
      //O: Boolean
      // Strategy: get the rows

      //pseudocode: get rows, get the n value, create a counter variable.

      // var n = this.get('n'); // 4
      // var counter = 0; // counter = 0
      // // create stopping value equal to n - 1 - mdciafr
      // var stop = n - majorDiagonalColumnIndexAtFirstRow; // 3
      // //iterate through rows (last row is the index value), (n = 5, 5x5, index is at 2, so we can to iterate through rows 0 to 2, and columns 2 to 4)
      // for (var i = 0; i < stop; i++) { // i = 0
      //   //get current row, get the element value at rows.get(i)
      //   console.log('Row ' + i + ' , Column ' + (i + majorDiagonalColumnIndexAtFirstRow));
      //   var current = this.get(i)[i + majorDiagonalColumnIndexAtFirstRow];
      //   console.log('Value: ', current);
      //     // row[i + majorDiag....Row] -- check this value
      //     if (current === 1) {
      //        // check value at index + i -- if it's 1,
      //         //increment the counter
      //         counter++;
      //     }
      //     // check if counter is greater than 1,
      //     if (counter > 1) {
      //       // if so, return true
      //       return true;
      //     }
      // }
      // return false;

      var n = this.get('n'); // 4
      // create stopping value equal to n - 1 - mdciafr
      var stop = n - majorDiagonalColumnIndexAtFirstRow; //4
      //iterate through rows (last row is the index value), (n = 5, 5x5, index is at 2, so we can to iterate through rows 0 to 2, and columns 2 to 4)
      for (var j = 0; j < this.rows().length; j++) { //j = 0
        var counter = 0; // counter = 0
        var row = this.get(j);

        for (var i = 0; i < n - j; i++) { // i = 0 stop = 3
          //get current row, get the element value at rows.get(i)
          // console.log('Row ' + i + ' , Column ' + (i + majorDiagonalColumnIndexAtFirstRow));
          var current = this.get(j + i)[i + majorDiagonalColumnIndexAtFirstRow];
          // console.log('Value: ', current);
            // row[i + majorDiag....Row] -- check this value
            if (current === 1) {
              // check value at index + i -- if it's 1,
                //increment the counter
                counter++;
            }
            // check if counter is greater than 1,
            if (counter > 1) {
              // if so, return true
              return true;
            }
        }
      }
      return false;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      //I none
      // O: boolean
      //strat: iterate from 0 through n
      var n = this.get('n'); // 4
      for (var i = 0; i < n; i++) {//only testing half of the board (use 1 -n for i) // i=0 (through 3)
        // for each index, call hasMajorDiagonalConflictAt function
        //this.hasMajorDiagonalConflictAt(i);
        // if hmdca is true,
        //console.log(this.hasMajorDiagonalConflictAt(i));

        if (this.hasMajorDiagonalConflictAt(i)) { // majorDiagonalCon... = 0
          // return true
          return true;
        }

      }


      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var n = this.get('n'); // 4
      // create stopping value equal to n - 1 - mdciafr
      var stop = n - minorDiagonalColumnIndexAtFirstRow; //4
      //iterate through rows (last row is the index value), (n = 5, 5x5, index is at 2, so we can to iterate through rows 0 to 2, and columns 2 to 4)
      for (var j = 0; j < this.rows().length; j++) { //j = 0
        var counter = 0; // counter = 0
        var row = this.get(j);

        for (var i = 0; i < n - j; i++) { // i = 0 stop = 3
          //get current row, get the element value at rows.get(i)
          // console.log('Row ' + i + ' , Column ' + (i + minorDiagonalColumnIndexAtFirstRow));
          var current = this.get(j + i)[minorDiagonalColumnIndexAtFirstRow - i];
          // console.log('Value: ', current);
            // row[i + majorDiag....Row] -- check this value
            if (current === 1) {
              // check value at index + i -- if it's 1,
                //increment the counter
                counter++;
            }
            // check if counter is greater than 1,
            if (counter > 1) {
              // if so, return true
              return true;
            }
        }
      }
      return false;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var n = this.get('n'); // 4
      for (var i = 0; i < n; i++) {//only testing half of the board (use 1 -n for i) // i=0 (through 3)
        // for each index, call hasMajorDiagonalConflictAt function
        //this.hasMajorDiagonalConflictAt(i);
        // if hmdca is true,
        //console.log(this.hasMajorDiagonalConflictAt(i));

        if (this.hasMinorDiagonalConflictAt(i)) { // majorDiagonalCon... = 0
          // return true
          return true;
        }

      }


      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());

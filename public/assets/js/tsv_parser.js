function parseText(text, delimiter) {
    text = text.replace(/\r/g, '');
    var returnData = [[]];
    var state = 'START_CELL';
    var cellContent = '';
    var row = 0;
    for (var i = 0; i < text.length; i++) {
        var currentChar = text.charAt(i);
        switch (state) {
            case 'START_CELL':
                if (currentChar == '"') {
                    state = 'QUOTED_CELL';
                } else if (currentChar == delimiter) {
                    returnData[row].push(cellContent);
                    cellContent = '';
                    state = 'START_CELL';
                } else if (currentChar == '\n') {
                    returnData[row].push(cellContent);
                    cellContent = '';
                    state = 'START_CELL';
                    returnData.push([]);
                    row++;
                } else {
                    cellContent += currentChar;
                    state = 'UNQUOTED_CELL';
                }
                break;
            case 'UNQUOTED_CELL':
                if (currentChar == delimiter) {
                    returnData[row].push(cellContent);
                    cellContent = '';
                    state = 'START_CELL';
                } else if (currentChar == '\n') {
                    returnData[row].push(cellContent);
                    cellContent = '';
                    state = 'START_CELL';
                    returnData.push([]);
                    row++;
                } else {
                    cellContent += currentChar;
                }
                break;
            case 'QUOTED_CELL':
                if (currentChar == '"') {
                    state = 'QUOTED_CELL_QUOTE';
                } else {
                    cellContent += currentChar;
                }
                break;
            case 'QUOTED_CELL_QUOTE':
                if (currentChar == '"') {
                    cellContent += currentChar;
                    state = 'QUOTED_CELL';
                } else if (currentChar == '\n') {
                    returnData[row].push(cellContent);
                    cellContent = '';
                    state = 'START_CELL';
                    returnData.push([]);
                    row++;
                } else if (currentChar == delimiter) {
                    returnData[row].push(cellContent);
                    cellContent = '';
                    state = 'START_CELL';
                }
                break;
        }
    }
    return returnData;
}

function trimData(dataToTrim) {
    var maxRow = 0, maxCol = 0;
    for (var i = 0; i < dataToTrim.length; i++) {
        for (var j = 0; j < dataToTrim[i].length; j++) {
            if (dataToTrim[i][j] != '') {
                if (maxCol < j) maxCol = j;
                if (maxRow < i) maxRow = i;
            }
        }
    }
    console.log(maxCol + ', ' + maxRow);
    dataToTrim = dataToTrim.splice(0, maxRow + 1);
    for (var i = 0; i < dataToTrim.length; i++) {
        if (dataToTrim[i].length > maxCol + 1) {
            dataToTrim[i] = dataToTrim[i].splice(0, maxCol + 1);
        }
    }
    return dataToTrim;
}
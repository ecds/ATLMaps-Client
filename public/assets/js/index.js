var DEFAULT_CONFIGURATION = [
	  {
		"type": "coordinate",
		"content": [
		  "none",
		  "none",
		  "none",
		  "1"
		]
	  },
	  {
		"name": "name",
		"type": "none"
	  },
	  {
		"name": "description",
		"type": "custom",
		"content": ""
	  },
	  {
		"name": "images",
		"type": "multiple",
		"content": [
		  {
			"name": "",
			"type": "none"
		  }
		]
	  },
	  {
		"name": "videos",
		"type": "multiple",
		"content": [
		  {
			"name": "",
			"type": "none"
		  }
		]
	  },
	  {
		"name": "audios",
		"type": "multiple",
		"content": [
		  {
			"name": "",
			"type": "none"
		  }
		]
	  }
	];


var RESIZE_BAR_WIDTH = 6;
var COLUMN_MIN_WIDTH = 80;

var tablePopulated = false;
var propertyIndices = new Set();
var columnSize = [];
var data = [];

var rowsFinished;
var geoCodingCache = {};

var propertiesConfigurations = {};
var savedData = {'data': data, 'properties': propertiesConfigurations};


window.addEventListener('load', function() {
        setOnPasteToTableInput();
        document.getElementById('dataTable').onmousemove = function(event) {columnResizeMouseMove(event)};
        document.getElementById('dataTable').onmouseup = function(event) {columnResizeMouseUp(event)};
    }, false);

function loadSpreadsheet(fileInput) { // Receive data through loading a spreadsheet.
    var file = fileInput.files[0];
    var extension = getExtension(file.name);
    var reader = new FileReader();
    
    if (extension == 'xlsx') {
        reader.onload = function(event) {
            var xlsxData = event.target.result;
            var workbook = XLSX.read(xlsxData, {'type': 'binary'});
            
            workbook.SheetNames.forEach(function(sheetName) {
                var tsvText = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName], {'FS': '\t'}); // Sheet to tsv instead of csv.
                data = parseText(tsvText, '\t');
                prepareData();
            });
        };
        reader.readAsBinaryString(file);
    } else if (extension == 'csv') {
        reader.onload = function(event) {
            var dataText = event.target.result;
            data = parseText(dataText, ',');
            prepareData();
        };
        reader.readAsText(file);
    }
}

function getExtension(fileName) {
    var dotIndex = fileName.lastIndexOf('.');
    if (dotIndex >= 0) {
        return fileName.substring(dotIndex + 1).toLowerCase();
    }
    return '';
}

function setOnPasteToTableInput() {// Receive data through pasting TSV data in. An alternative way to loading Excel spreadsheet.
    document.getElementById('pasteSpreadSheet').onpaste = function (event) {
        var plainText = event.clipboardData.getData('text/plain');
        data = parseText(plainText, '\t');
        return false;
    };
}

function prepareData() {
	data = trimData(data);
	populateTable();
	populateComboBoxes();
	resetProperties();
}

function resetProperties() {
    var propertiesUL = document.getElementById('propertiesRoot');
    propertiesUL.innerHTML = '';
    loadProperty(propertiesUL, DEFAULT_CONFIGURATION, true);
}

// Clear the spreadsheet table.
function tableClear() {
    data = [];

    document.getElementById('dataTable').innerHTML = '<tr>\n'
            + '            <td>Load spreadsheet</td>\n'
            + '        </tr>\n'
            + '        <tr>\n'
            + '            <td><input type="file" id="excelFileInput" onchange="loadSpreadsheet(this)"/></td>\n'
            + '        </tr>\n'
            + '        <tr>\n'
            + '            <td>Or paste data in text box</td>\n'
            + '        </tr>\n'
            + '        <tr>\n'
            + '            <td><input id="pasteSpreadSheet" /></td>\n'
            + '        </tr>\n';
    setOnPasteToTableInput();
    tablePopulated = false;
    document.getElementById('rightPartDiv').style.display = 'none';
    document.getElementById('dataTableContainer').style.overflow = 'hidden';
}

function refreshColumnSizes() {
    var dataTableStyleSheet = document.getElementById('dataTableStyleSheet');
    var styleSheetHTML = '';
    for (var i = 0; i < columnSize.length; i++) {
        var clampedSize = Math.max(COLUMN_MIN_WIDTH, columnSize[i]);
        styleSheetHTML += '.column' + i + '{\n'
                + 'width: ' + clampedSize + 'px;\n'
                + '}\n';
        if (columnSize[i] < clampedSize) {
            document.getElementById('columnResize' + i).style.left = clampedSize - (RESIZE_BAR_WIDTH / 2) + 'px';
        }
    }
    dataTableStyleSheet.innerHTML = styleSheetHTML;
}

var mouseState = {};

function columnResizeMouseDown(event) {
    mouseState['state'] = 'down';
    mouseState['column'] = event.target.id.substring('columnResize'.length);
    mouseState['target'] = event.target;
    event.target.style.left = event.target.parentNode.offsetWidth - (RESIZE_BAR_WIDTH / 2) + 'px';
    columnSize[mouseState['column']] = event.target.offsetLeft + event.target.offsetWidth;
    document.getElementById('dataTable').className = 'unselectable';
}

function columnResizeMouseMove(event) {
    if (mouseState['state'] == 'down') {
        var deltaX = event.pageX - mouseState['previousX'];
        columnSize[mouseState['column']] += deltaX;
        mouseState['target'].style.left = columnSize[mouseState['column']] - (RESIZE_BAR_WIDTH / 2) + 'px';
        refreshColumnSizes();
    }
    mouseState['previousX'] = event.pageX;
    mouseState['previousY'] = event.pageY;
}

function columnResizeMouseUp(event) {
    mouseState['state'] = 'up';
    document.getElementById('dataTable').className = '';
}

function populateTable() {
    var tableHTML = '<tr><td><div class="rowNumber"> </div></td>';
    columnSize = [];
    for (var i = 1; i <= data[0].length; i++) {
        tableHTML += '<td><div class="colNumber column' + (i - 1) + '">' + i
                + '<div class="resizeColumnDiv" style="width: ' + RESIZE_BAR_WIDTH + 'px; '
                + 'left: ' + (100 - RESIZE_BAR_WIDTH / 2) + 'px" onmousedown="columnResizeMouseDown(event)"'
                + ' id="columnResize' + (i - 1) + '">'
                + '</div></div></td>';
        columnSize.push(100);
    }
    tableHTML += '</tr>';
    for (var i = 0; i < data.length; i++) {
        tableHTML += '<tr><td><div class="rowNumber">' + (i + 1) + '</div></td>';
        for (var j = 0; j < data[0].length; j++) {
            tableHTML += '<td><div class="dataTableCell column' + j + '">' + data[i][j] + '</div></td>';
        }
        tableHTML += '</tr>';
    }
    document.getElementById('dataTable').innerHTML = tableHTML;
    refreshColumnSizes();
    resize();
    
    tablePopulated = true;
    document.getElementById('dataTableContainer').style.overflow = 'scroll';
    document.getElementById('rightPartDiv').style.display = 'block';
}

function populateComboBoxes() {
    if (data.length > 0) {
        var comboBoxes = document.getElementsByClassName('dataInputCoordinates');
        for (var i = 0; i < comboBoxes.length; i++) {
            populateComboBox(comboBoxes[i], false);
        }
        comboBoxes = document.getElementsByClassName('dataInput');
        for (var i = 0; i < comboBoxes.length; i++) {
            populateComboBox(comboBoxes[i], true);
        }
    }
}

function populateComboBox(comboBox, customizable) {
    if (data.length > 0) {
        var comboBoxHTML = '<option value="none">Not used</option>\n';
        if (customizable) {
            comboBoxHTML += '<option value="custom">Custom</option>\n';
            comboBoxHTML += '<option value="extended">Extended</option>\n';
            comboBoxHTML += '<option value="multiple">Multiple</option>\n';
            comboBox.onchange = function() {customizableComboChange(this)};
        }
        for (var i = 0; i < data[0].length; i++) {
            comboBoxHTML += '<option value="' + i +'">Column ' + (i + 1) + '</option>';
        }
        comboBox.innerHTML = comboBoxHTML;
    }
}

function customizableComboChange(comboBox) {
    function removeCustom(comboBox) {
        var parent = comboBox.parentNode;
        while (parent.children.length > 3) {
            parent.removeChild(parent.children[3]);
        }
    }
    var parent = comboBox.parentNode;
    if (comboBox.value == 'custom') {
        removeCustom(comboBox);
        var customTextBox = document.createElement('textarea');
        parent.appendChild(customTextBox);
    } else if (comboBox.value == 'extended') {
        removeCustom(comboBox);
        var customUL = document.createElement('ul');
        var newComboBox = addPropertyToUL(customUL, true)[2];
        populateComboBox(newComboBox, true);
        parent.appendChild(customUL);
        addAddButtonToExtended(parent, true);
    } else if (comboBox.value == 'multiple') {
        removeCustom(comboBox);
        var customUL = document.createElement('ul');
        var newComboBox = addPropertyToUL(customUL, false)[2];
        populateComboBox(newComboBox, true);
        parent.appendChild(customUL);
        addAddButtonToExtended(parent, false);
    } else {
        removeCustom(comboBox);
    }
}

function addAddButtonToExtended(ulElement, hasName) {
    var newAddButton = document.createElement('a');
    newAddButton.className = 'button normalColor medium addButton';
    newAddButton.innerText = '＋';
    newAddButton.onclick = function() {addProperty(this, hasName)};
    ulElement.appendChild(document.createTextNode(' '));
    ulElement.appendChild(newAddButton);
}

function resize() {
    var containerHeight = document.getElementById('toolContainer').offsetHeight;
    document.getElementById('dataTableContainer').style.height = containerHeight - 20 + 'px';
    document.getElementById('rightPartDiv').style.height = containerHeight - 20 + 'px';
}

function addProperty(addButton, hasName) {
    var ulElement = addButton.previousSibling.previousSibling;
    var newComboBox = addPropertyToUL(ulElement, hasName)[2];
    populateComboBox(newComboBox, true);
}

function addPropertyToUL(ulElement, hasName) {
    var newComboBox = document.createElement('select');
    var newRemoveButton = document.createElement('a');
    
    newComboBox.className = 'dataInput';
    newRemoveButton.className = 'button normalColor small';
    newRemoveButton.onclick = function() {removeProperty(this)};
    newRemoveButton.innerText = 'X';
    
    var newPropertyLi = document.createElement('li');
    
    var newInput;
    if (hasName) {
        newInput = document.createElement('input');
        newInput.value = 'name';
    } else {
        newInput = document.createElement('div'); // Dummy div to fill up the spot.
        newInput.className = 'dummyDiv';
    }
    
    newPropertyLi.appendChild(newInput);
    newPropertyLi.appendChild(newComboBox);
    newPropertyLi.appendChild(newRemoveButton);
    ulElement.appendChild(newPropertyLi);
    return [newPropertyLi, newInput, newComboBox, newRemoveButton];
}

function removeProperty(removeButton) {
    removeButton.parentNode.parentNode.removeChild(removeButton.parentNode);
}

// Convert the Unordered List (UL) element to an easy-to-traverse intermediate node list
// that will be used to generate a json object for each row of data.
function parseUL(ulElement) {
    var resultTree = [];
    var liElements = ulElement.children;
    for (var i = 0; i < liElements.length; i++) {
        var liElement = liElements[i];
        var name = '';
        if (liElement.children[0].tagName == 'INPUT') {
            var name = liElement.children[0].value;
        }
        var value = liElement.children[1].value;
        if (value == 'none') {
            resultTree.push({'name':name, 'type': 'custom', 'content':[{'type':'text', 'content':''}]});
        } else if (value == 'custom') {
            resultTree.push({'name':name, 'type': 'custom', 'content':customToNodes(liElement.children[3].value)});
        } else if (value == 'extended') {
            var newJSON = parseUL(liElement.children[3]);
            resultTree.push({'name':name, 'type': 'extended', 'content':newJSON});
        } else if (value == 'multiple') {
            var newJSON = parseUL(liElement.children[3]); // There will be a bunch of empty names. 
            resultTree.push({'name':name, 'type': 'multiple', 'content':newJSON});
        } else {
            resultTree.push({'name':name, 'type': 'column', 'content':value});
        }
    }
    return resultTree;
}

// Generate the node list for the custom properties that may have column queries in them.
function customToNodes(customText) {
    var resultNodes = [];
    var state = 'TEXT';
    var currentToken = '';
    for (var i = 0; i < customText.length; i++) {
        var currentChar = customText.charAt(i);
        if (state == 'TEXT') {
            if (currentChar != '#') {
                currentToken += currentChar;
            } else {
                state = 'HASH';
            }
        } else if (state == 'HASH') {
            if (!isNaN(parseInt(currentChar))) { // If a number.
                resultNodes.push({'type':'text', 'content':currentToken});
                currentToken = currentChar;
                state = 'COLUMN';
            } else if (currentChar == '#') {
                currentToken += '#';
                state = 'TEXT';
            } else {
                currentToken += '#' + currentChar;
                state = 'TEXT';
            }
        } else if (state == 'COLUMN') {
            if (!isNaN(parseInt(currentChar))) { // If a number.
                currentToken += currentChar;
            } else if (currentChar == '#') {
                resultNodes.push({'type':'column', 'content':currentToken});
                currentToken = '';
                state = 'TEXT';
            }
        }
    }
    resultNodes.push({'type':'text', 'content':currentToken});
    return resultNodes;
}

var refreshTable;
function generate() {
    if (tablePopulated) {
        var outputGeoJSON = {
                'type': 'FeatureCollection',
                'features': []
        };
        
        var rowsToSkipList = document.getElementById('rowSkip').value.split(/\s*,\s*/);
        if (rowsToSkipList.length == 1 && rowsToSkipList[0] == '') rowsToSkipList.pop();
		var rowsToSkip = [];
		for (var i = 0; i < rowsToSkipList.length; i++) {
			if (rowsToSkipList[i].indexOf('-') >= 0) {
				var range = rowsToSkipList[i].split(/\s*-\s*/);
				for (var j = range[0]; j <= range[1]; j++) {
					rowsToSkip.push(parseInt(j));
				}
			} else {
				rowsToSkip.push(parseInt(rowsToSkipList[i]));
			}
		}
        rowsToSkip = new Set(rowsToSkip);
        rowsToSkip.forEach(function (row) {
				if (row > data.length) {
					rowsToSkip.delete(row);
				}
			});
		//console.log(rowsToSkip);
		
        // Coordinate handling.
        var latInput = document.getElementById('lat').value;
        var lngInput = document.getElementById('lng').value;
        var addressInput = document.getElementById('address').value;
                        
        if (latInput == 'none' || lngInput == 'none') {
            alert('Not enough coordinate information.');
            return;
        }
        refreshTable = false;
        rowsFinished = 0;
        var rootUL = document.getElementById('propertiesRoot');
        
        var parsedJSON = parseUL(rootUL);
        
        var rowsToGenerate = data.length - rowsToSkip.size;
        //console.log(rowsToGenerate);
        // Prepare marker list to preserve markers order in case asynchronous method is used.
        for (var i = 1; i <= rowsToGenerate; i++) {
            outputGeoJSON['features'].push({});
        }
        var indexInJSONArray = 0; // Also for order keeping.
        removeProgressTransition();
        refreshProgress(0);
        for (var i = 0; i < data.length; i++) {
            if (rowsToSkip.has(i + 1)) {
                continue;
            }
            var dataLat, dataLng;
            dataLat = parseFloat(data[i][latInput]);
            dataLng = parseFloat(data[i][lngInput]);
            if ((isNaN(dataLat) || isNaN(dataLng)) && addressInput != 'none') {
                var address = data[i][addressInput];
                if (!geoCodingCache[address]) {
                    var callback = function(responseText, args) {
                        refreshTable = true;
                        var row = args[0];
                        var callbackAddress = args[1];
                        var indexInJSON = args[2];
                        var latColumn = args[3];
                        var lngColumn = args[4];
                        var json = JSON.parse(responseText);
                        //console.log(json);
                        var ajaxLat = 0, ajaxLng = 0;
                        if (json.length > 0) {
                            var ajaxLat = json[0]['lat'];
                            var ajaxLng = json[0]['lon'];
                            geoCodingCache[callbackAddress] = {'lat': ajaxLat, 'lng': ajaxLng};
                            data[row][latColumn] = ajaxLat;
                            data[row][lngColumn] = ajaxLng;
                        }
                        addDatumToGeoJSON(outputGeoJSON, parsedJSON, ajaxLat, ajaxLng, row, rowsToGenerate, indexInJSON);
                    };
                    var argument = [i, address, indexInJSONArray, latInput, lngInput];
                    ajaxCall('https://nominatim.openstreetmap.org/search?format=json&q=' + address, callback, argument);
                } else {
                    dataLat = geoCodingCache[address]['lat'];
                    dataLng = geoCodingCache[address]['lng'];
                    data[i][latInput] = dataLat;
                    data[i][lngInput] = dataLng;
                    addDatumToGeoJSON(outputGeoJSON, parsedJSON, dataLat, dataLng, i, rowsToGenerate, indexInJSONArray);
                }
            } else {
                addDatumToGeoJSON(outputGeoJSON, parsedJSON, dataLat, dataLng, i, rowsToGenerate, indexInJSONArray);
            }
            indexInJSONArray++;
        }
    }
}

// parsedJSON: A list of nodes that store name and content of each property.
// row: The current row to extract data from.
function dataFromJSON(parsedJSON, row) {
    var resultJSON = {};
    for (var i = 0; i < parsedJSON.length; i++) {
        var property = parsedJSON[i];
        if (property['type'] == 'custom') {
            var newProperty = '';
            for (var j = 0; j < property['content'].length; j++) {
                var node = property['content'][j];
                if (node['type'] == 'text') {
                    newProperty += node['content'];
                } else {
                    newProperty += data[row][parseInt(node['content']) - 1];
                }
            }
            resultJSON[property['name']] = newProperty.replace(/\n/g, '<br>');
        } else if (property['type'] == 'extended') {
            resultJSON[property['name']] = dataFromJSON(property['content'], row);
        } else if (property['type'] == 'multiple') {
            resultJSON[property['name']] = dataFromJSONArray(property['content'], row);
        } else {
            resultJSON[property['name']] = data[row][property['content']].replace(/\n/g, '<br>');
        }
    }
    return resultJSON;
}

function dataFromJSONArray(parsedJSON, row) {
    var resultArray = []; // <-- Return an array instead of a JSON object.
    for (var i = 0; i < parsedJSON.length; i++) {
        var property = parsedJSON[i];
        if (property['type'] == 'custom') {
            var newProperty = '';
            for (var j = 0; j < property['content'].length; j++) {
                var node = property['content'][j];
                if (node['type'] == 'text') {
                    newProperty += node['content'];
                } else {
                    newProperty += data[row][parseInt(node['content']) - 1];
                }
            }
            resultArray.push(newProperty.replace(/\n/g, '<br>'));
        } else if (property['type'] == 'extended') {
            resultArray.push(dataFromJSON(property['content'], row));
        } else if (property['type'] == 'multiple') {
            resultArray.push(dataFromJSONArray(property['content'], row));
        } else {
            resultArray.push(data[row][property['content']].replace(/\n/g, '<br>'));
        }
    }
    return resultArray;
}

function addDatumToGeoJSON(outputGeoJSON, parsedJSON, dataLat, dataLng, row, rowsToGenerate, indexInJSONArray) {
    var newDatum = {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [
                    parseFloat(dataLng),
                    parseFloat(dataLat)
                ]
            },
            'properties': dataFromJSON(parsedJSON, row)
    };
    outputGeoJSON['features'][indexInJSONArray] = newDatum;
    rowsFinished++;
    //console.log(rowsFinished + '/' + rowsToGenerate + ' rows finished');
    setTimeout(function() {
                refreshProgress(rowsFinished / rowsToGenerate);
                setProgressTransition();
            }, 0);
    //alert(rowsFinished + ' finished');
    if (rowsFinished == rowsToGenerate) { // Have to put this here to handle the asynchronous calls.
        document.getElementById('outputText').innerHTML = 
                JSON.stringify(outputGeoJSON, undefined, 2);
        if (refreshTable) {
            populateTable();
        }
    }
}

// Turn UL element into a JSON to be saved to client's machine. Almost identical to parseUL function.
function serializeUL (ulElement) {
    var resultJSON = [];
    var liElements = ulElement.children;
    for (var i = 0; i < liElements.length; i++) {
        var liElement = liElements[i];
        var name = '';
        if (liElement.children[0].tagName == 'INPUT') {
            var name = liElement.children[0].value;
        }
        var value = liElement.children[1].value;
        if (value == 'none') {
            resultJSON.push({'name':name, 'type': 'none'});
        } else if (value == 'custom') {
            resultJSON.push({'name':name, 'type': 'custom', 'content':liElement.children[3].value});
        } else if (value == 'extended') {
            var newJSON = serializeUL(liElement.children[3]);
            resultJSON.push({'name':name, 'type': 'extended', 'content':newJSON});
        } else if (value == 'multiple') {
            var newJSON = serializeUL(liElement.children[3]); // There will be a bunch of empty named objects.
            resultJSON.push({'name':name, 'type': 'multiple', 'content':newJSON});
        } else {
            resultJSON.push({'name':name, 'type': 'column', 'content':value});
        }
    }
    return resultJSON;
}

var FILE_NAME = 'configuration.jcon';
function saveConfiguration() {
    if (tablePopulated) {
        var contentJSON = serializeUL(document.getElementById('propertiesRoot'));
        contentJSON.unshift({'type':'coordinate', 'content':[
                document.getElementById('lat').value,
                document.getElementById('lng').value,
                document.getElementById('address').value,
                document.getElementById('rowSkip').value]});
        saveFileToLocal(JSON.stringify(contentJSON, undefined, 2), FILE_NAME);
    } else {
        alert('Please insert data into the table first');
    }
}

function loadConfiguration() {
    if (tablePopulated) {
        openLocalFile(function (configurationFile) {
            var extension = getExtension(configurationFile.name);
            var reader = new FileReader();
            
            if (extension == 'jcon' || true) {
                reader.onload = function(event) {
                    try {
                        var propertyJSON = JSON.parse(event.target.result);
                        //console.log(propertyJSON);
                        var propertyUL = document.getElementById('propertiesRoot');
                        propertyUL.innerHTML = '';
                        loadProperty(propertyUL, propertyJSON, true);
                    } catch(exception) {
                        alert('Cannot read configuration file. The file may be corrupted.');
                    }
                };
                reader.readAsText(configurationFile);
            } else {
                alert('Cannot read configuration file. Make sure the extension of the file is "jcon"');
            }
        }, '.jcon');
    } else {
        alert('Please insert data into the table first');
    }
}

// hasName is false when loading an array which consists of an empty named object list.
function loadProperty(ulElement, propertyJSON, hasName) {
    for (var i = 0; i < propertyJSON.length; i++) {
        var property = propertyJSON[i];
        if (property['type'] == 'coordinate') {
            function setCombobox(comboBox, value) {
                if (value == 'none') {
                    comboBox.selectedIndex = 0;
                } else {
                    comboBox.selectedIndex = Math.min(comboBox.options.length - 1,
                    parseInt(value) + 1);
                }
            }
            setCombobox(document.getElementById('lat'), property['content'][0]);
            setCombobox(document.getElementById('lng'), property['content'][1]);
            setCombobox(document.getElementById('address'), property['content'][2]);
            document.getElementById('rowSkip').value = property['content'][3];
        } else {
            var propertyElements = addPropertyToUL(ulElement, hasName);
            populateComboBox(propertyElements[2], true);
            if (hasName) {
                propertyElements[1].value = property['name'];
            }
            if (property['type'] == 'column') {
                propertyElements[2].selectedIndex = Math.min(propertyElements[2].options.length - 1,
                        parseInt(property['content']) + 4);
            } else if (property['type'] == 'custom') {
                propertyElements[2].selectedIndex = 1;
                var customTextBox = document.createElement('textarea');
                propertyElements[0].appendChild(customTextBox);
                customTextBox.value = property['content'];
            } else if (property['type'] == 'extended') {
                propertyElements[2].selectedIndex = 2;
                var newUL = document.createElement('ul');
                propertyElements[0].appendChild(newUL);
                loadProperty(newUL, property['content'], true);
                addAddButtonToExtended(propertyElements[0], true);
            } else if (property['type'] == 'multiple') {
                propertyElements[2].selectedIndex = 3;
                var newUL = document.createElement('ul');
                propertyElements[0].appendChild(newUL);
                loadProperty(newUL, property['content'], false);
                addAddButtonToExtended(propertyElements[0], false);
            } else {
                propertyElements[2].selectedIndex = 0;
            }
        }
    }
}


// Save a data string into the client's machine
function saveFileToLocal(data, fileName) {
    var file = new Blob([data], {'type': 'text/plain'});
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(file, fileName);
    } else {
        var a = document.createElement('a');
        var url = URL.createObjectURL(file);
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
    }
}

// Load a file from the client's machine
function openLocalFile(callback, filter) {
    var fileInputElement = document.createElement('input');
    fileInputElement.type = 'file';
	if (filter) {
		fileInputElement.accept = filter;
	}
    document.body.appendChild(fileInputElement);
    fileInputElement.onchange = function () {
            callback(fileInputElement.files[0]);
        };
    fileInputElement.click();
    setTimeout(function() {
            document.body.removeChild(fileInputElement);
        }, 0);
    
}

function removeProgressTransition() {
    var progressBar = document.getElementById('progressBar');
    progressBar.style.transition = '0s all';
}

function setProgressTransition() {
    var progressBar = document.getElementById('progressBar');
    progressBar.style.transition = '.2s all';
}

function refreshProgress(alpha) {
    var progressBar = document.getElementById('progressBar');
    progressBar.style.width = alpha * 100 + '%';
}


function ajaxCall(url, callback, arg) {
    url = encodeURI(url);
    //console.log(url);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                //alert(this.responseText);
                callback(this.responseText, arg);
            } else {
                callback('[]', arg);
            }
        }
    }
    xhttp.open('GET', url, true);
    xhttp.send();
}
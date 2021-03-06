Vue.component("modal", {
  template: "#modal-template"
});

var app = new Vue({
  el: '#app',
  data: {
    hasFile: false,
    courseID: "",
    questionsText: "",
    // answersText: "",
    zippedArray: [],
    emailaddress: "",
    showModal: false,
    queryToken: "",
    questionRows: []
  },
  methods: {
    addRow: function(event) {
      event.preventDefault();
      this.questionRows.push(this.questionsText);
      this.questionsText = "";
    },

    async openCSV(event) {
      let file = event.target.files;
      if (file.length === 0) {
        alert("No/empty file here");
        return;
      }


      let readUploadedFileAsText = inputFile => {
        const temporaryFileReader = new FileReader();

        return new Promise((resolve, reject) => {
          temporaryFileReader.onerror = () => {
            temporaryFileReader.abort();
            reject(new DOMException("Problem parsing input file."));
          };

          temporaryFileReader.onload = () => {
            resolve(temporaryFileReader.result);
          };
          temporaryFileReader.readAsText(inputFile);
        });
      };


      // const reader = new FileReader();
      // reader.onload = async function fileReadCompleted() {
      //   console.log(reader.result);
      //   return CSVToArray(reader.result, ',')
      // }
      // this.zippedArray = await reader.readAsText(event.target.files[0])
      try {
        const result = await readUploadedFileAsText(file[0]) 
        this.zippedArray = CSVToArray(result, ',');
        console.log(fileContents);
      } catch (e) {
        console.warn(e.message)
      }
      console.log("OUPTUT:")
      console.log(this.zippedArray)
      this.hasFile = true;
    },
    makePost: function (event) {
      var comp = this;
      postData = {
        courseID: "",
        query: [],
        email: this.emailaddress
      }

      if (this.courseID.length <= 1) {
        alert("INVALID/MISSING COURSE ID");
        return;
      }
      postData.courseID = this.courseID
      console.log(this.hasFile);
      // if (this.answersText.split(",").length !== this.questionsText.split(",").length && this.hasFile != true) {
      //   alert("MISMATCHED NUMBER OF QUESTIONS AND ANSWERS");
      //   return;
      // }
      if (this.hasFile === true) {
        console.log("ITS TRUE");
        postData.query = this.zippedArray;
      }
      else {
        
        console.log(this.questionRows);
      
        
        for (q in this.questionRows) {
          postData.query.push([this.questionRows[q]]);
        }
      }
      console.log("POST DATA:");
      console.log(postData);
      // Sending the data to the node server
      var req = new XMLHttpRequest();
      // Change the url here when the actual server is set up
      var url = 'https://hax.services:8030/';
      req.open('POST', url, true);
      req.setRequestHeader('Content-Type', 'application/json');
      req.send(JSON.stringify(postData));
      req.onreadystatechange = function() { 
        // If the request completed, close the extension popup
        if (req.readyState == 4)
          if (req.status == 200) 
          // alert("Your query is being processed, please save your unique query ID:\n\n\n "+ req.responseText + "\n\n\n!!!YOU MUST HAVE THIS ID TO VIEW RESULTS!!!" );
          comp.queryToken = req.responseText;
          comp.showModal = true;   
      };
      
      
      event.preventDefault();
    }
  }
})


// ref: http://stackoverflow.com/a/1293163/2343
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function CSVToArray(strData, strDelimiter) {
  // Check to see if the delimiter is defined. If not,
  // then default to comma.
  strDelimiter = (strDelimiter || ",");

  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp(
    (
      // Delimiters.
      "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

      // Quoted fields.
      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

      // Standard fields.
      "([^\"\\" + strDelimiter + "\\r\\n]*))"
    ),
    "gi"
  );


  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData = [[]];

  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches = null;


  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while (arrMatches = objPattern.exec(strData)) {

    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[1];

    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
    if (
      strMatchedDelimiter.length &&
      strMatchedDelimiter !== strDelimiter
    ) {

      // Since we have reached a new row of data,
      // add an empty row to our data array.
      arrData.push([]);

    }

    var strMatchedValue;

    // Now that we have our delimiter out of the way,
    // let's check to see which kind of value we
    // captured (quoted or unquoted).
    if (arrMatches[2]) {

      // We found a quoted value. When we capture
      // this value, unescape any double quotes.
      strMatchedValue = arrMatches[2].replace(
        new RegExp("\"\"", "g"),
        "\""
      );

    } else {

      // We found a non-quoted value.
      strMatchedValue = arrMatches[3];

    }


    // Now that we have our value string, let's add
    // it to the data array.
    arrData[arrData.length - 1].push(strMatchedValue);
  }

  // Return the parsed data.
  return (arrData);
}

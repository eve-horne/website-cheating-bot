var app = new Vue({
  el: '#app',
  data: {
    courseID: "",
    queryID: "",
    results: [],
    status: "",
    classid: "",
    query:[],
    numRes: "",
    dataArr: [],
    dateofquery: "",
    single: false,
    multi: false
  },
  methods: {
    clearIdBox: function(event) {
      this.queryID = "";
    },
    clearClassBox: function(event) {
      this.courseID = "";
    },
    getData: async function (event) {
      var resData = ""
      // Sending the data to the node server
      var req = new XMLHttpRequest();
      // Change the url here when the actual server is set up
      var url = 'https://hax.services:8030/getQuery';
      postObj = {
          id: this.queryID,
          course: this.courseID
      }
      req.open('POST', url, false);
      req.setRequestHeader('Content-Type', 'application/json');
      req.send(JSON.stringify(postObj));
      this.populateData(req.responseText);
      event.preventDefault();
    },
    populateData: async function (responseText) {
        const dataOBJ = JSON.parse(responseText);
        this.dataArr = [];
        if(dataOBJ.multi != undefined) {
          this.single = true;
          this.multi = false;
          this.classid = dataOBJ.class;
          this.status = dataOBJ.status;
          this.results = dataOBJ.results[0];
          this.query = dataOBJ.query;
          this.numRes = dataOBJ.results[0].length;
          this.dateofquery = new Date(dataOBJ.date).toString()
        }
        else {
          this.multi = true;
          this.single = false;
          console.log(dataOBJ);
        for (obj in dataOBJ)
        {
          console.log(dataOBJ[obj]);
          pushOBJ = {
            id: dataOBJ[obj].id,
            classid: dataOBJ[obj].class,
            status: dataOBJ[obj].status,
            results: dataOBJ[obj].results[0],
            query: dataOBJ[obj].query,
            datequery: new Date(dataOBJ[obj].date).toString()
          }
          if (dataOBJ[obj].results.length == 0) {
            pushOBJ["numRes"] = 0;
          }
          else {
            pushOBJ["numRes"] = dataOBJ[obj].results[0].length;
          }
          this.dataArr.push(pushOBJ);
        }
      }
        
        // console.log(dataOBJ)
        
    }
  }
})




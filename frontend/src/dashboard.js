var app = new Vue({
  el: '#app',
  data: {
    queryID: "",
    results: [],
    status: "",
    classid: "",
    query:[]
  },
  methods: {
    getData: async function (event) {
      var resData = ""
      // Sending the data to the node server
      var req = new XMLHttpRequest();
      // Change the url here when the actual server is set up
      var url = 'https://hax.services:8030/getQuery';
      postObj = {
          id: this.queryID
      }
      req.open('POST', url, false);
      req.setRequestHeader('Content-Type', 'application/json');
      req.send(JSON.stringify(postObj));
      this.populateData(req.responseText);
      event.preventDefault();
    },
    populateData: async function (responseText) {
        const dataOBJ = JSON.parse(responseText);
        this.classid = dataOBJ.class;
        this.status = dataOBJ.status;
        this.results = dataOBJ.results[0];
        this.query = dataOBJ.query;
        console.log(dataOBJ)
        
    }
  }
})




var Models = require('../models'),
	async = require('async'),
	recentCommentsModel = require('../helpers/recent');


/*
    if (!err) {
      var latestComment = "",
        i = 0;
      for (i = 0; i < teamlist.count;) {
        strTeam = strTeam + "<li>" + teamlist.teams[i].country + "</li>";
        i = i + 1;
      }
      strTeam = "<ul>" + strTeam + "</ul>";
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.write(template.build("Test web page on node.js", "Hello there", "<p>The teams in Group " + teamlist.GroupName + " for Euro 2012 are:</p>" + strTeam));
      res.end();*/



module.exports = function(viewModel, callback) {

   async.parallel([
      
        function(next) {
           Models.Comment.count({}, next);
        },
       
    ]










    , function(err, results){
//here we add the stats to our viewModel in the box for all of our sidebar data. Note how we tally each result from the four functions above, and this final function won’t run without all the results.
        viewModel.sidebar.recentCommentsModel = {
   
            comments: results[0],
           
        };
//then we send our modified viewModel back to the controller after our functions are complete
		callback(viewModel);
    });
};

//takes the browser's request and lets us send back a page or other information
var imageModel = require('../models').Image;
var stats = require('../helpers/stats');
var recentCommentsModel = require('../helpers/recent');
var comments = require('../models').Comment;

module.exports = {
	index: function(req, res) {
		var viewModel = {    
			images: {},    
			sidebar: {},
            recentComments: {}
			};


imageModel.find(function(err, images) {
        viewModel.images = images;    
        stats(viewModel, 
        	function(viewModel) {    
        		 recentCommentsModel(viewModel, 
                    function(viewModel) {     
                        res.render('index',viewModel); 
                    });   
        	});

        /*//viewModel.images = images;    
        recentCommentsModel(viewModel, 
            function(viewModel) {     
                res.render('index',viewModel);    
        });*/

        comments(viewModel,
        	function(viewModel){
        		res.render('index',{"comments":comments,});
        		//res.render('index',viewModel);

        	});        
    	}); //end of imageModel
	//	res.render('index',viewModel);
	}
}; //end of module.exports
var fs = require('fs');
var path = require('path');
var Models = require('../models');
var stats = require('../helpers/stats');
var recentCommentsModel = require('../helpers/recent');

//handles all requests for our image app
module.exports = {
	index: function(req, res) {
		var viewModel = {
			image: {},
			comments:{},
			sidebar: {}

			//include comments comment: {}
			//and everything you need in the sidebar 
		};

		//find the image using the url 
		Models.Image.findOne({ filename: { $regex: req.params.image_id } },
			function (err, image) {
				if (err) { throw err; }
				if (image) {
					//if found, adds to views
					image.views++;
					//saves the image to use as the view
					viewModel.image = image;
					//save the updated model
					image.save();

					Models.Image.find(function(err, images){
						viewModel.images = images; 
						stats(viewModel, 
			        	function(viewModel) {     
			        		//res.render('index',viewModel);    
			        	});
					});
				
					Models.Comment.find({ imageID: {$regex: req.params.image_id}},
						function (err, comments) { 
						if (comments) {
							viewModel.comments = comments;
							res.render('image',viewModel);
						} else {
							res.redirect('/');
						}
					 //end of function(err, comments)
				
					});
				}

			});

		}, //end of index
	create: function(req, res) {
		var saveImage = function() {
			//info for creating a unique identifier
			var possible = 'abcdefghijklmnopqrstuvwxyz0123456789',
                imgUrl = '';
			
			//generates the id
            for(var i=0; i < 6; i+=1) {
                imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));
            }
			//checks to see if there's an image with this filename
			Models.Image.find({ filename: imgUrl }, function(err, images) {
				if (images.length > 0) {
					//if there's a match, make a different name
					saveImage();
				} else {
					//creates the path for storing the image
					var tempPath = req.files.file.path,
						ext = path.extname(req.files.file.name).toLowerCase(),
						targetPath = path.resolve('./public/upload/' + imgUrl + ext);
					//checks to make sure we're getting an image, then stores it if valid
					if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
						fs.rename(tempPath, targetPath, function(err) { 
							if (err) { 
								throw err; 
							}
							//creates the image model with details from the request (req)
							var newImg = new Models.Image({
								title: req.body.title,
								filename: imgUrl + ext,
								description: req.body.description
							});
							//saves the image
							newImg.save(function(err, image) {
								console.log('Successfully inserted image: ' + image.filename);
								res.redirect('/images/' + imgUrl);
							});
					});
					} else {
						fs.unlink(tempPath, function () {
							if (err) {
								throw err;
							}

							res.json(500, {error: 'Only image files are allowed.'});
						});
					}
				}
			});
		};	
		saveImage();
	},
	like: function(req, res) {

	/*var viewModel = {
			sidebar: {}
		};*/
		Models.Image.findOne({ filename: { $regex: req.params.image_id } }, //use this format to grab comments. (need image ID. find image by file name, create a new vomment, whitch will push to an array of a comment object. then post to a particle image.
		//(OR add a field to the comment. store image ID)
			//parsing the info we need from the parse request
			//whatever we have in the handlebar brackets MUST correspond to the viewmodel

			function(err, image) {
				image.likes++;
				/*image.views--;*/
				console.log(image.likes);
				image.save();




				/*Models.Image.find(function(err, images){
					viewModel.images = images; 
						stats(viewModel, 
			        	function(viewModel) {     
			        		//res.render('index',viewModel);    
			        	});
					});*/
				

				res.render('image',{'image':image});

				// l.99: once you get inex working. take part of code, 
				//image.views--
			});

	},
	comment: function(req, res) {
		var pushComment = function(){
		var newComment = new Models.Comment({
				name: req.body.name,
				email: req.body.email,
				comment: req.body.comment,
				imageID: req.params.image_id
			});
			//save the comment
			newComment.save(function(err, comment) {
				if (err) { throw err; }
				if (comment) {
					//console.log(username.username);
					console.log('Successfully inserted comment' + comment.comment );
					//redirct users' browsers to the comment page. to get request /comments 
					res.redirect('/images/' + newComment.imageID );

				}else{
					res.redirect('/');
				}
			}); //end of mongooses' save function

		} //end of pushComment function 
			pushComment();
		
		//res.send('The image:comment POST controller');
		//immediately redirects user back to the image index. 
		//reloads page with the comment posting
	}// end of comment function
};//end of model.export
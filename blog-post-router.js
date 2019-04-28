const express = require('express');
const router = express.Router();
const {ListPosts} = require('./blog-post-model');
const uuid = require('uuid');

// GET all posts
router.get('/blog-posts', (req, res, next) => {

    ListPosts.get()
        .then(posts => {
            res.status(200).json({
                message: "Successfully sent the list of posts.",
                status: 200,
                posts: posts
            });
        })
        .catch(err => {
            res.status(500).json({
                message: "Internal server error.",
                status: 500
            });
            return next();
        });
});

//Post by author
router.get('/blog-posts/:author', (req, res, next) =>{
    let authorName = req.params.author;

    ListPosts.getAuthor(authorName)
			.then(posts => {
				res.status(200).json({
					message : "Found the author's posts.",
					status : 200,
					posts : posts
				});
			})
			.catch(err => {
				res.status(404).json({
					message : "Author posts not found in the list.",
					status : 404
				});
				return next();
			});
});


//POST requests of a blog post should go to /blog-posts
router.post('/blog-posts', (req, res, next) => {
    let requiredFields = ['title', 'content', 'author', 'publishDate'];

    for (let i = 0; i < requiredFields.length; i++){
        let currentField = requiredFields[i];
        if(!(currentField in req.body)){
            res.status(406).json({
                message : `Missing field ${currentField} in body.`,
                status : 406
            });
            return next();
        }
    }

    let newPost = {
        id: uuid.v4(),
        title: req.body.title,
        content: req.body.content, 
        author: req.body.author, 
        publishDate: req.body.publishDate
    };

    ListPosts.postNew(newPost)
        .then(post => {
            res.status(201).json({
                message : "Successfully added the post.",
                status : 201,
                post : post
            });
        })
        .catch(err => {
            res.status(500).json({
                message : `Internal server error.`,
                status : 500
            });
            return next();
        });

});


//DELETE requests should go to /blog-posts/:id
router.delete('/blog-posts/:id', (req, res, next) => {
    let paramId = req.params.id;
   
    ListPosts.delete(paramId)
		.then(post => {
			res.status(200).json({
				message : "Successfully deleted the post.",
				status : 200,
				post : post
			});
		})
		.catch(err => {
			res.status(404).json({
				message : "Post not found in the list.",
				status : 404
			});
			return next();
		});

});


//PUT requests should go to /blog-posts/:id
router.put('/blog-posts/:id', (req, res) => {
    let postId = req.params.id;
    let updatedPost = req.body;
    
    if(!postId){
        res.status(406).json({
            message: "Missing id field in params.",
            status: 406
        });
    }

    if(!updatedPost.title && !updatedPost.content && !updatedPost.author && !updatedPost.publishDate){
        res.status(404).json({
            message: "No data in body.",
            status: 404
        });
    }
    
    ListPosts.put(postId, updatedPost.title, updatedPost.content, updatedPost.author, updatedPost.publishDate)
        .then(post => {
            res.status(200).json({
                message : "Successfully updated the post.",
                status : 200,
                post : post
            });
        })
        .catch(err => {
            res.status(404).json({
                message : "Post not found in the list.",
                status : 404
            });
            return next();
        });

});


module.exports = router;


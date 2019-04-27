const uuid = require('uuid');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Scehma for Post Collection
let postSchema = mongoose.Schema({
    id: {type: String, required: true, unique: true},
    title: {type: String, required: true},
    content: {type: String, required: true},
    author: {type: String, required: true},
    publishDate: {type: String, required: true}
});

// Create instance of database
let Posts = mongoose.model('Posts', postSchema);

const ListPosts = {
    get : function(){
        return Posts.find()
            .then(posts => {
                return posts;
            })
            .catch(err => {
                throw new Error(err);
            });
    },
    
    getAuthor : function(myAuthor){
        return Posts.findOne({author: myAuthor})
            .then(post => {
                return post;
            })
            .catch(err => {
                throw new Error(err);
            });
    },

    postNew : function(newPost){
        return Posts.create(newPost)
            .then(post => {
                return post;
            })
            .catch(err => {
                throw new Error(err);
            });
    },

    delete : function(postId){
        return Posts.deleteOne({_id: postId})
            .then(post => {
                return post;
            })
            .catch(err => {
                throw new Error(err);
            });
    },

    put : function(postId, postTitle, postcontent, postAuthor, postDate){
        return Posts.findByIdAndUpdate({_id: postId}, {$set:{title: postTitle, content: postcontent, author: postAuthor, publishDate: postDate}})
            .then(sport => {
                return sport;
            })
            .catch(err => {
                throw new Error(err);
            }); 
    }
};

module.exports = {ListPosts}
// Collapsible MENU
$('#endpoints').on('click', '.collapsible', function(event){
    event.preventDefault();
    let action = $(this)
    action.toggleClass('activeColl')

    var content = action.next();

    if (content.css('max-height') != '0px'){
      content.css('max-height', '0px');
    }
    else{
      let scroll = content.prop('scrollHeight');
      content.css("max-height", `${scroll}px`);
    } 
});


// Functions for endpoints
// Display all posts
function displayPostList(data){
    $('#posts').html("");
    for(let i = data.posts.length - 1; i >= 0; i--){
        $('#posts').append(`
            <li>
                <p><b>Title:</b> ${data.posts[i].title}</p>
                <p><b>Author:</b> ${data.posts[i].author}</p>
                <p><b>Content:</b> ${data.posts[i].content}</p>
                <p><b>Publish Date:</b> ${data.posts[i].publishDate}</p>
                <p><b>Id:</b> ${data.posts[i]._id}</p>
            </li>
        `)
    }
}

// Update list of posts
function updatePostList(data){
    $('#posts').prepend(`
        <li>
            <p><b>Title:</b> ${data.post.title}</p>
            <p><b>Author:</b> ${data.post.author}</p>
            <p><b>Content:</b> ${data.post.content}</p>
            <p><b>Publish Date:</b> ${data.post.publishDate}</p>
            <p><b>Id:</b> ${data.post._id}</p>
        </li>
    `);
}

// Load all posts
function onload(){
    let url = "./posts/api/blog-posts";
    let settings = {
        method : "GET",
        headers : {
            'Content-Type' : 'application/json'
        }
    };

    fetch(url, settings)
        .then(response => {
            if (response.ok){
                return response.json();
            }
            throw Error(response.statusText);
        })
        .then(responseJSON => {
            displayPostList(responseJSON);
        });
}

// Load an author's posts
function getAuthorPosts(author){
    let url = `./posts/api/blog-posts/${author}`;
    let settings = {
        method : 'GET',
        headers : {
            'Content-Type' : 'application/json'
        }
    }

    fetch(url, settings)
        .then(response => {
            if (response.ok){
                return response.json();
            }
            throw Error(response.statusText);
        })
        .then(responseJSON => {
            displayPostList(responseJSON);
        })
        .catch(err => {
            alert(err.message);
			console.log(err);
		});
}

// Create a new post
function addNewPost(title, content, author, date){
	let data = {
		title : title,
        content : content,
        author : author,
        publishDate : date
	};

	let url = './posts/api/blog-posts';
	let settings = {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(data)
    };

	fetch(url, settings)
		.then(response => {
			if (response.ok){
				return response.json();
			}
			else{
				return new Promise(function(resolve, reject){
					resolve(response.json());
				})
				.then(data =>{
					throw new Error(data.message);
				});
			}
		})
		.then(responseJSON => {
			updatePostList(responseJSON);
		})
		.catch(err => {
            alert(err.message);
			console.log(err);
		});
}

function updatePost(id, title, content, author, date){
    let url = `./posts/api/blog-posts/${id}`;
    let data = {
		title : title,
        content : content,
        author : author,
        publishDate : date
	};
    let settings = {
        method : 'PUT',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(data)
    }

    fetch(url, settings)
		.then(response => {
			if (response.ok){
				return response.json();
			}
			else{
				return new Promise(function(resolve, reject){
					resolve(response.json());
				})
				.then(data =>{
					throw new Error(data.message);
				});
			}
		})
		.then(responseJSON => {
			$(onload);
		})
		.catch(err => {
            alert(err.message);
			console.log(err);
		});
}

function deletePost(id){
    let url = `./posts/api/blog-posts/${id}`;
    let settings = {
        method : 'DELETE',
        headers : {
            'Content-Type' : 'application/json'
        }
    }
    
    fetch(url, settings)
		.then(response => {
			if (response.ok){
				return response.json();
			}
			else{
				return new Promise(function(resolve, reject){
					resolve(response.json());
				})
				.then(data =>{
					throw new Error(data.message);
				});
			}
		})
		.then(responseJSON => {
			$(onload);
		})
		.catch(err => {
            alert(err.message);
			console.log(err);
		});
}

function watchForm(){
    $('#getAll').on('click', function(event) {
        event.preventDefault();
        $(onload);
    });
    
    $('#getPosts').on('click', function(event){
        event.preventDefault();
        let author = $('#authorName').val();
        getAuthorPosts(author);
        $('#authorForm').each(function(){
            this.reset();
        });
    });

    $('#createPost').on('click', function(event) {
		event.preventDefault();
		let title = $('#postTitle').val();
        let content = $('#postContent').val();
        let author = $('#postAuthor').val();
        let date = $('#postDate').val();
        if(title == "" || content == "" || author == "" || date == ""){
            alert("Please fill out all fields.")
        }else{
            addNewPost(title, content, author, date);
            $('#postForm').each(function(){
                this.reset();
            });
        }
        
    });

    $('#updatePost').on('click', function(event){
        event.preventDefault();
        let id = $('#postId').val();
        let title = $('#newTitle').val();
        let content = $('#newContent').val();
        let author = $('#newAuthor').val();
        let date = $('#newDate').val();
        if(id == "" || title == "" || content == "" || author == "" || date == ""){
            alert("Please fill out all fields.")
        }else{
            updatePost(id, title, content, author, date);
            $('#putForm').each(function(){
                this.reset();
            });
        }
    });

    $('#deletePost').on('click', function(event){
        event.preventDefault();
        let id = $('#deleteId').val();
        deletePost(id);
        $('#deleteForm').each(function(){
            this.reset();
        });
    });
}

function init(){
	$(onload);
	$(watchForm);
}

$(init);
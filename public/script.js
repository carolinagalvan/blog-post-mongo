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
    // console.log(data);
    $('#posts').html("");
    for(let i = 0; i< data.posts.length; i++){
        $('#posts').append(`
            <li>
                <p><b>Title:</b> ${data.posts[i].title}</p>
                <p><b>Author:</b> ${data.posts[i].author}</p>
                <p><b>Content:</b> ${data.posts[i].content}</p>
                <p><b>Publish Date:</b> ${data.posts[i].publishDate}</p>
                <p><b>Id:</b> ${data.posts[i].id}</p>
            </li>
        `)
    }
}

// Update list of posts
function updatePostList(data){
    $('#posts').append(`
        <li>
            <p><b>Title:</b> ${data.post.title}</p>
            <p><b>Author:</b> ${data.post.author}</p>
            <p><b>Content:</b> ${data.post.content}</p>
            <p><b>Publish Date:</b> ${data.post.publishDate}</p>
            <p><b>Id:</b> ${data.post.id}</p>
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
            throw Error(response.statusText);
        })
        .then($(onload));
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
            throw Error(response.statusText);
        })
        .then($(onload));
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
    });

    $('#createPost').on('click', function(event) {
		event.preventDefault();
		let title = $('#postTitle').val();
        let content = $('#postContent').val();
        let author = $('#postAuthor').val();
        let date = $('#postDate').val();
        addNewPost(title, content, author, date);
    });

    $('#updatePost').on('click', function(event){
        event.preventDefault();
        let id = $('postId').val();
        let title = $('#newTitle').val();
        let content = $('#newContent').val();
        let author = $('#newAuthor').val();
        let date = $('#newDate').val();
        updatePost(id, title, content, author, date);
    });

    $('#deletePost').on('click', function(event){
        event.preventDefault();
        let id = $('#deleteId').val();
        deletePost(id);
    });
}

function init(){
	$(onload);
	$(watchForm);
}

$(init);
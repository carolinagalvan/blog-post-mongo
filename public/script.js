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
    console.log(data);
    for(let i = 0; i< data.posts.length; i++){
        $('#posts').append(`
            <li>
                <p>Title: ${data.posts[i].title}</p>
                <p>Author: ${data.posts[i].author}</p>
                <p>Content: ${data.posts[i].content}</p>
                <p>Publish Date: ${data.posts[i].publishDate}</p>
            </li>
        `)
    }
}

// Update list of posts
function updatePostList(data){
    $('#posts').append(`
        <li>
            <p>Title: ${data.post.title}</p>
            <p>Author: ${data.post.author}</p>
            <p>Content: ${data.post.content}</p>
            <p>Publish Date: ${data.post.publishDate}</p>
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

function watchForm(){
	$('#createPost').on('click', function(event) {
		event.preventDefault();
		let title = $('#postTitle').val();
        let content = $('#postContent').val();
        let author = $('#postAuthor').val();
        let date = $('#postDate').val();
        addNewPost(title, content, author, date);
        $('#newPost').append(`
            Successfully created post:
            <p>Title: ${data.post.title}</p>
            <p>Author: ${data.post.author}</p>
            <p>Content: ${data.post.content}</p>
            <p>Publish Date: ${data.post.publishDate}</p>
        `);
	});
}

function init(){
	$(onload);
	$(watchForm);
}

$(init);
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
            <li>${data.posts[i].title}</li>
        `)
    }
}

// Update list of posts
function updatePosttList(data){
	$('#posts').append(`<li>${data.post.title}</li>`);
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
			updateSportList(responseJSON);
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
	});
}

function init(){
	$(onload);
	$(watchForm);
}

$(init);
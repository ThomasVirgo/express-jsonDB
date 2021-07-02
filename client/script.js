//GRAB ELEMENTS OF INTEREST
const form = document.querySelector("form");
const posts = document.getElementById("posts");

//ADD EVENT LISTENERS
form.addEventListener("submit", postData);

//FUNCTIONS
async function postData(event){
    event.preventDefault();
    let { title, name, content } = event.target;
    title = title.value;
    name = name.value;
    content = content.value;

    let data = {
        title,
        author: name,
        content
    }

    let options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(data)
    }
    let response = await fetch("http://localhost:3000/add", options);
    let responseJson = await response.json();

    console.log(responseJson);
    createPosts();

}

async function getPosts(){
    let response = await fetch("http://localhost:3000/all");
    let responseJson = await response.json();
    return responseJson
}

async function createPosts(){
    let entries = await getPosts();
    posts.innerHTML = '';
    entries.forEach(entry => createPostElement(entry));
}

function createPostElement(entry){
    let div = document.createElement('div');
    let title = document.createElement('h2');
    let author = document.createElement('h3');
    let content = document.createElement('p');
    title.textContent = entry.title;
    author.textContent = entry.author;
    content.textContent = entry.content;
    div.appendChild(title);
    div.appendChild(author);
    div.appendChild(content);
    posts.appendChild(div);
}

createPosts();

//BRING IN DEPENDENCIES
const express = require('express');
const cors = require('cors');
const { saveData, getData } = require('./util');

const app = express();

//MIDDLEWARE
app.use(cors());
app.use(express.json());

//ROUTES
app.get('/', (req,res) => {
    res.json('Hello')
});


//GET REQUEST
app.get('/all', (req, res) => {
    const posts = getData()
    res.json(posts)
})

//POST REQUEST
app.post('/add', (req, res) => {
    //get the existing user data
    const currentPosts = getData()
    
    //get the new user data from post request
    const postData = req.body
    //check if the userData fields are missing
    if (postData.title == null || postData.author == null || postData.content == null) {
        return res.status(401).send({error: true, msg: 'Data missing'})
    }
    
    //check if the username exist already
    const findExist = currentPosts.find( post => post.title === postData.title )
    if (findExist) {
        return res.status(409).send({error: true, msg: 'This title already exists, please use different title'})
    }
    //append the user data
    currentPosts.push(postData)
    //save the new user data
    saveData(currentPosts);
    res.status(201).json({success: true, message: 'Entry added successfully'});
})

//DELETE REQUEST
app.delete('/:title', (req, res) => {
    const title = req.params.title
    //get the existing entries
    const currentPosts = getData()
    //filter the entries to remove the requested deleted one
    const updatedPosts = currentPosts.filter( entry => entry.title !== title )
    if ( currentPosts.length === updatedPosts.length ) {
        return res.status(409).send({error: true, message: 'title does not exist'})
    }
    //save the filtered data
    saveData(updatedPosts)
    res.send({success: true, message: 'Post removed successfully'})
})


//UPDATE REQUEST
app.patch('/update/:title', (req, res) => {
    //get the title from url and new data from body
    const title = req.params.title;
    const updatedPost = req.body;
    //get the existing user data
    const currentPosts = getData()
    //check if the username exist or not       
    const deosExist = currentPosts.find( post => post.title === title )
    if (!deosExist) {
        return res.status(409).send({error: true, msg: 'username not exist'})
    }
    //filter the userdata
    const updatedPosts = currentPosts.filter( post => post.title !== title )
    //push the updated data
    updatedPosts.push(updatedPost)
    //finally save it
    saveData(updatedPosts)
    res.send({success: true, messageg: 'Post updated successfully'})
})

module.exports = { app };
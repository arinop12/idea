import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express()
const PORT = 3000

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "hackathon1",
    password: "simplesql",
    port: 5432,
})
db.connect()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function allComment(){
    const allItems = await db.query('SELECT * FROM comment')
    return allItems.rows
}

function time(){
    const date = new Date()
    return date.toDateString();
}

app.get("/", async (req,res)=>{
    const comments = await allComment();
    const date = time()
    console.log(comments)
    res.render("index.ejs", {
        comments: comments,
        date: date
    })
})

app.get('/about', (req,res)=>{
    res.render('about.ejs',{

    })
})

app.get('/SubmitIdea', (req,res)=>{
    res.render('SubmitIdea.ejs', {

    })
})

app.get('/allPost', async (req, res) => {
    try {
        const post =[]
        const date = time()
        const response = await db.query('SELECT * FROM user_idea');

        for(let item of response.rows){
            post.push(item)
        }

        res.render('allPost.ejs', {
            posts: post,
            date: date 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.post("/comment", async (req,res)=>{
    const comments = await allComment();
    const commentText = req.body.commentText
    const commentEmail = req.body.commentEmail
    const date = time()

    const result = await db.query('INSERT INTO comment(comment_text , comment_email) VALUES($1 , $2) RETURNING *', [commentText, commentEmail])
    
    res.redirect("/");
    console.log(result.rows[0])
})

app.post('/idea', async (req,res)=>{
    const response = await db.query('INSERT INTO user_idea(user_name , user_topic , user_idea , user_email) VALUES($1,$2,$3,$4) RETURNING *',[req.body.user_name , req.body.user_topic , req.body.user_idea , req.body.user_email ])
    console.log(response.rows)
    res.redirect('/SubmitIdea')
})

app.listen(PORT ,()=> {
    console.log('LISTENING TO THE SERVER');
    
})
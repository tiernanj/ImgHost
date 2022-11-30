const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const Str = require('@supercharge/strings')

const app = express()
const port = 3000

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use(fileUpload())

// DB
const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "./image.db"
    },
    useNullAsDefault: true
});

app.get('/', async (req, res) => {
    res.send('Hello vro!')
})

app.post('/upload', async (req, res) => {
    const {name, data} = req.files.pic;
    if (name && data) {
        var randomID = Str.random(10)
        await knex.insert({id: randomID, name: name, img: data}).into('images') 
        const url = 'http://localhost:3000/img/'
        res.redirect(url + randomID)
    }
    else {
        res.sendStatus(400)
    }
})

app.get('/img/:id', async (req, res) => {
    const id = req.params.id
    const img = await knex('images').where({id: id}).first()
    if (img) {
        res.end(img.img)
    }
    else {
        res.end('There is no image with that ID')
    }
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

const fs = require('fs')

app.use(express.json({ extends: true }))
app.use(cors())

const readFile = () => {
    const books = fs.readFileSync('./src/data/items.json', 'utf8');
    return JSON.parse(books);
}

const writeFile = (payload) => {
    const book = JSON.stringify(payload, null, 2);
    const books = fs.writeFileSync('./src/data/items.json', book, 'utf8')
}


app.get('/', (req, res) => {
    res.send('bem vindo!')
})

app.get('/list', (req, res) => {
    const books = readFile();

    res.send(books)
})

app.get('/list/:id', (req, res) => {
    try {
        const { id } = req.params;

        const books = readFile();
        const selectedItem = books.find(item => item.id == id);

        if (!selectedItem) {
            return res.status(404).send({ messege: "book not found" })
        }

        return res.send(selectedItem);
    } catch {
        res.status(500).send({ messege: "internal error" })
    }
})

app.post('/register', (req, res) => {

    try {
        const { number, title, author, year, status, loaned_to, image, evaluation} = req.body;
        const id = Math.random().toString(32).substr(2, 9)
        const books = readFile();
        const selectedItem = books.find(item => item.number == number);
        if (selectedItem) {
            return res.send({ messege: "book already registered" })
        }
        books.push({ id, number, title, author, year, status, loaned_to, image, evaluation })
        writeFile(books)
        res.send({id})

    } catch {
        res.status(500).send({ messege: "internal error" })
    }
})
app.put('/update', (req, res) => {
    try {
        const { id} = req.body;
        const books = readFile()
        const selectedItem = books.findIndex(element => element.id == id)
        console.log(id)
        if (selectedItem > -1) {
            books[selectedItem] = {
                ...req.body
            }
            res.send({ messege: "successfully changed" })
        }
        else {
            //res.status(404).send({ messege: "not found" })
        }
        writeFile(books)
    } catch {
        res.status(500).send({ messege: "internal error" })
    }
})

app.delete('/delete/:id', (req, res) => {
    try {
        const { id } = req.params
        const books = readFile()
        const selectedItem = books.findIndex(element => element.id === id)
        if (selectedItem > -1) {
            books.splice(selectedItem, 1)
            writeFile(books)
            return res.send("successfully deleted")
        }
        res.status(404).send({ messege: "not found" })
    } catch {
        res.status(500).send({ messege: "internal error" })
    }
})

app.listen(port, function () {
    console.log(`running in port ${port}`)
})
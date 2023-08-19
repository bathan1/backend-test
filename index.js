require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const Person = require('./models/person.js');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('build'));

morgan.token("json-body", (req, res) => {
    return JSON.stringify(req.body);
});
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :json-body"));

app.get("/api/persons", (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons);
    });
});

app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id).then(note => {
        response.json(note);
    });
});

app.get("/info", (request, response) => {
    const currentTime = new Date();
    response.send(`<p>Phonebook has info for ${data.length} people</p>
                    <p>${currentTime}</p>`)
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    data = data.filter(person => person.id !== id);

    response.status(204).end();
})

app.post("/api/persons", (request, response) => {
    const body = request.body;

    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({error: 'content missing'});
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    });

    person.save().then(savedPerson => {
        response.json(savedPerson);
    })

})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const express = require("express");
const morgan = require("morgan");
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('build'));

morgan.token("json-body", (req, res) => {
    return JSON.stringify(req.body);
});
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :json-body"));

let data = 
[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/api/persons", (request, response) => {
    response.json(data);
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = data.find(p => p.id === id);
    
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
})

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
    const id = Math.floor(Math.random() * 999);
    console.log(request.body);
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "content missing"
        });
    } else if (data.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: "name must be unique"
        });
    }

    const person = {
        id: id,
        name: body.name,
        number: body.number,
        
    }

    data = data.concat(person);

    response.json(data);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
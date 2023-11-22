const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(express.static('public'));


app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.listen(PORT, () => console.log(`App listening on port http://localhost:${PORT}`));

app.post('/api/notes', async (req, res) => {
  console.log(req.body)

  let title = req.body.title
  let text = req.body.text

  
    if (title && text) {
      const newNote = {
        id: crypto.randomUUID(),
        title,
        text,
      };
  
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          res.status(500).json(err);
        } else {
          const parsedNotes = JSON.parse(data);
  
          parsedNotes.push(newNote);
  
          fs.writeFile('./db/db.json', JSON.stringify(parsedNotes), err => {
          if (err) {
            res.status(500).json('Error writing file');
        } else {
          res.json(JSON.parse("success posting data" + data));
        }
          }
          );
        }
      });
    } else {
      res.status(500).json('Error posting note');
    }
  });


  app.get('/api/notes', async (req, res) => {
  
    fs.readFile ('./db/db.json', 'utf8', (err, data) => {
       if (err) {
        res.status(500).json('Error posting note');
      } else {
        res.json(JSON.parse(data));
      }
    });
});

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
  
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        res.status(500).json(err);
        return;
      }
  
      const parsedNotes = JSON.parse(data);

      const updatedNotes = parsedNotes.filter(note => note.id !== id);
      fs.writeFile('./db/db.json', JSON.stringify(updatedNotes), err => {
        if (err) {
          res.status(500).json(err);
        } else {
          res.status(200).json('Note deleted successfully');
        }
      });
    });
  });
  
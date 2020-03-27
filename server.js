  const express = require('express');
  const mongodb = require('mongodb')
  const uri = "mongodb+srv://todoAppUser:12211221@cluster0-lr1bi.mongodb.net/TodoApp?retryWrites=true&w=majority"

  const app = express()


  const port = 3000;
  let db;

  // connect to mongodb
  mongodb.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
    if (err) console.log(err)

    db = client.db();
    app.listen(port, () => console.log(`App listening on ${port}`))
  })





  app.use(express.json())
  app.use(express.urlencoded({
    extended: true
  }))


  app.get('/', (req, res) => {
    db.collection('items').find().toArray((err, items) => {
      if (err) console.log(err)

      res.send(`
          <!DOCTYPE html>
          <html>
          <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Simple To-Do App</title>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
          </head>
          <body>
          <div class="container">
            <h1 class="display-4 text-center py-1">To-Do App</h1>

            <div class="jumbotron p-3 shadow-sm">
              <form method="POST" action="/create-item">
                <div class="d-flex align-items-center">
                  <input name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                  <button class="btn btn-primary">Add New Item</button>
                </div>
              </form>
            </div>

            <ul class="list-group pb-5">
                ${items.map(item => {
                  return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                            <span class="item-text">${item.text}</span>
                            <div>
                              <button class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
                              <button class="delete-me btn btn-danger btn-sm">Delete</button>
                            </div>
                        </li>`
                }).join('')}
            </ul>

          </div>

          </body>
          </html>
          `)
    })

  })


  app.post('/create-item', (req, res) => {
    db.collection('items').insertOne({
      text: req.body.item
    }, () => {
      res.redirect('/')
    })
  })

  app.get('/create-item', (req, res) => {
    res.send('<h3>Are you lost? Could not found what you are looking for.</h3>')
  });

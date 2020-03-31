  const express = require('express');
  const mongodb = require('mongodb')
  const uri = "mongodb+srv://todoAppUser:12211221@cluster0-lr1bi.mongodb.net/TodoApp?retryWrites=true&w=majority"

  // sanitize-html package is for cleaning-up create item text.
  const sanitizeHTML = require('sanitize-html')
  const app = express()
  const port = 5500;

  app.use(express.static('public'))

  // connect to mongodb

  let db;
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
    extended: false
  }))

  // function for protect website using password
  let passwordProtect = (req, res, next) => {
    res.set('WWW-Authenticate', 'Basic realm="Simple Todo App"')
    if (req.headers.authorization === 'Basic YWRtaW46dG9kbyQxMjM0') {
      next();
    } else {
      res.status(401).send('Authenticaion required.')
    }
  }

  // To protect all route
  app.use(passwordProtect);

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
              <form id='create-form' action="/create-item" method="POST">
                <div class="d-flex align-items-center">
                  <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                  <button class="btn btn-primary">Add New Item</button>
                </div>
              </form>
            </div>

            <ul id="item-list" class="list-group pb-5">
            </ul>

          </div>

          <script>
            let items = ${JSON.stringify(items)};
          </script>
          <!-To enable axios library->
          <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
          <script src="browser.js"></script>
          </body>
          </html>
          `)
    })

  })

  app.post('/create-item', (req, res) => {
    let safeText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: {}})
    db.collection('items').insertOne({
      text: safeText
    }, (err, result) => {
      res.json(result.ops[0])
    })
  })


  app.post('/update-item', (req, res) => {
    let safeText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: {}})
    db.collection('items').findOneAndUpdate({
      _id: new mongodb.ObjectId(req.body.id)
    }, {
      $set: {
        text: safeText
      }
    }, () => {
      res.send(console.log('Update success.'))
    })
  })


  app.post('/delete-item', (req, res) => {
    db.collection('items').deleteOne({_id: new mongodb.ObjectId(req.body.id)}, () => {
      res.send('success')
    })
  })

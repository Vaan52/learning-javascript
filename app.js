require('app-module-path').addPath(__dirname)

const express = require('express')
const app = express()
const port = 3000

app.use('/static', express.static('public'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
const gameRoute = require('routes/game')
app.use('/game', gameRoute)

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})

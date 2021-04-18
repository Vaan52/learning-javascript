const express = require('express')
const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

const gameLib = require('lib/game')

router.get('/:gameId/', function (req, res) {
    let gameId = req.params.gameId

    console.log("Getting Game: " + gameId)

    game = gameLib.getGame(gameId)

    res.send(game)
})

router.post('/', function (req, res) {
    gameId = gameLib.newGame()

    console.log("Creating Game...")

    if (gameId === null) {
        res.status = 400
        res.send('No such game with game ID: ' + gameId)
    }

    console.log("Created Game: " + gameId)

    res.send(gameId)
})

router.put('/:gameId/', function (req, res) {
    let gameId = req.params.gameId
    let player = req.body.player
    let position = req.body.position

    console.log('Updating Game ' + gameId + ' for player ' + player + ' on position ' + position)

    updatedGame = gameLib.updateGame(gameId, player, position)
    if (updatedGame === null) {
        res.status = 400
        res.send(
            "Something went wrong in updating game ID: " + gameId +
            " for player " + player + " on position: " + position)
    }
    else {
        res.send(updatedGame)
    }
})

module.exports = router

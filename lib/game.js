const { v4: uuidv4 } = require('uuid')
const _ = require('lodash')

const gameRepo = {}
const gameSize = 3

const gameboardKey = 'GAMEBOARD'
const gameMetaKey = 'META'

const gameMetaNextPlayerKey = 'next'
const gameMetaPlayerXKey = 'X'
const gameMetaPlayerOKey = 'O'
const gameMetaWinner = 'winner'

const gameCellBlank = null
const gameCellX = 'X'
const gameCellO = 'O'
const gamePlayerCellMapping = {
    [gameMetaPlayerXKey]: gameCellX,
    [gameMetaPlayerOKey]: gameCellO,
}
const gameCellPlayerMapping = {
    [gameCellX]: gameMetaPlayerXKey,
    [gameCellO]: gameMetaPlayerOKey,
}

function newGame () {
    let newGameId = _generateGameId()
    _.set(gameRepo, newGameId, _generateGame())
    return newGameId
}

function _generateGameId () {
    let newGameId = uuidv4()
    while (_.has(gameRepo, newGameId)) {
        newGameId = uuidv4()
    }

    return newGameId
}

function _generateGame () {
    let game = _.times(
        gameSize, function () {
            return _.times(
                gameSize,
                _.constant(gameCellBlank))
        })
    let metadata = {
        [gameMetaPlayerXKey]: '0', // TODO: Player using gameCellX
        [gameMetaPlayerOKey]: '1', // TODO: Player using gameCellY
        [gameMetaNextPlayerKey]: gameMetaPlayerXKey,
        [gameMetaWinner]: null,
    }

    return {
        [gameboardKey]: game,
        [gameMetaKey]: metadata,
    }
}

function getGame (gameId) {
    if (_.has(gameRepo, gameId)) {
        return _.get(gameRepo, gameId)
    }
    return null
}

function updateGame (gameId, player, gridPosition) {
    let game = getGame(gameId)
    if (game === null) {
        return null
    }

    if (!(_isOngoing(game))) {
        return null
    }

    if (!(_isNext(game, player))) {
        return null
    }

    position = _parseGridPosition(gridPosition)
    if (!(_validPosition(position)) || !(_validCell(game, position))) {
        return null
    }

    update_success = _applyUpdate(game, position)
    if (!(update_success)) {
        return null
    }

    _checkWinner(game)

    return game
}

function _isOngoing({[gameMetaKey]: {[gameMetaWinner]: winner}}) {
    return winner === null
}

function _isNext ({[gameMetaKey]: gameMeta}, player) {
    let nextPlayerKey = _.get(gameMeta, gameMetaNextPlayerKey)
    let nextPlayer = _.get(gameMeta, nextPlayerKey)

    return player === nextPlayer
}

function _parseGridPosition (gridPosition) {
    return gridPosition.split(',')
}

function _validPosition ([positionX, positionY]) {
    return (positionX >= 0 && gameSize > positionX) && (
        positionY >= 0 && gameSize > positionY)
}

function _validCell (game, [positionX, positionY]) {
    gameboard = game[gameboardKey]
    return gameboard[positionY][positionX] === gameCellBlank
}

function _applyUpdate ({
        [gameboardKey]: gameboard,
        [gameMetaKey]: gameMeta
        }, [positionX, positionY]) {
    currentCellValue = gamePlayerCellMapping[gameMeta[gameMetaNextPlayerKey]]
    gameboard[positionY][positionX] = currentCellValue

    nextPlayer = _getNextPlayerKey(gameMeta[gameMetaNextPlayerKey])
    if (nextPlayer === null) {
        return false
    }

    gameMeta[gameMetaNextPlayerKey] = nextPlayer
    return true
}

function _getNextPlayerKey (currentPlayerKey) {
    if (currentPlayerKey === gameMetaPlayerXKey) {
        return gameMetaPlayerOKey
    }
    if (currentPlayerKey === gameMetaPlayerOKey) {
        return gameMetaPlayerXKey
    }

    return null
}

function _checkWinner ({[gameboardKey]: gameboard, [gameMetaKey]: gameMeta}) {
    let winningPlayer = null
    // checking rows
    for (let gameboardRow of gameboard) {
        winningPlayer = _checkStraightForWinner(gameboardRow)
        if (winningPlayer !== null) {
            gameMeta[gameMetaWinner] = winningPlayer
            return true
        }
    }

    // checking columns
    for (let col = 0; gameSize > col; col++) {
        let gameboardCol = _.map(gameboard, (row) => row[col])
        winningPlayer = _checkStraightForWinner(gameboardCol)
        if (winningPlayer !== null) {
            gameMeta[gameMetaWinner] = winningPlayer
            return true
        }
    }

    // checking diagonals
    let diagonal1 = _.map(gameboard, (row, rowIndex) => row[rowIndex])
    winningPlayer = _checkStraightForWinner(diagonal1)
    if (winningPlayer !== null) {
        gameMeta[gameMetaWinner] = winningPlayer
        return true
    }

    let diagonal2 = _.map(gameboard, (row, rowIndex) => row[gameSize - rowIndex - 1])
    winningPlayer = _checkStraightForWinner(diagonal2)
    if (winningPlayer !== null) {
        gameMeta[gameMetaWinner] = winningPlayer
        return true
    }

    return false
}

function _checkStraightForWinner (gameboardStraight) {
    let hasWinner = gameboardStraight.every(cell => cell === gameboardStraight[0])
    if (hasWinner) {
        let winningCell = gameboardStraight[0]
        if (winningCell === null) {
            return null
        }

        let winningPlayer = gameCellPlayerMapping[gameboardStraight[0]]
        return winningPlayer
    }
    return null
}

module.exports = {
    getGame,
    newGame,
    updateGame
}

const express = require('express')
const path = require('path')
const rp = require('request-promise')
const exphbs = require('express-handlebars')

const app = express()
const steamDevKey = '34911F5A45CEE890461DD83C489B330B'
const steamId = '76561198067110213'
const apiUri = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' +
    steamDevKey + '&steamid=' + steamId + '&format=json&include_appinfo=1'

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    rp({
            uri: 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/',
            qs: {
                key: '34911F5A45CEE890461DD83C489B330B',
                steamid: '76561198067110213',
                include_appinfo: '1',
                format: 'json'
            },
            json: true
        })
        .then((data) => {
            var result = processResponse(data.response)
            var game = result.selected_game
            var logo_url = "http://media.steampowered.com/steamcommunity/public/images/apps/" + game.appid + "/" + game.img_logo_url + ".jpg"
            res.render('home', {
                    game_count: result.game_count,
                    game_name: game.name,
                    game_logo_url: logo_url
                })
                // res.end(JSON.stringify({
                //     game_count: result.game_count,
                //     game_name: game.name,
                //     game_logo_url: logo_url
                // }))

        })
        .catch((err) => {
            console.log(err)
        })
})

app.listen(3000)

var processResponse = function(response) {
    var games = response.games
    var randomGame = pickRandomGame(games)

    var result = {
        game_count: response.game_count,
        selected_game: randomGame
    }

    return result
}

var pickRandomGame = function(items) {
    return items[Math.floor(Math.random() * items.length)]
}
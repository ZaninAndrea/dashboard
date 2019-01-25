var request = require("request")
const { exec, spawn } = require("child_process")
require("dotenv").config()

function colorizeTravisStatus(status) {
    return status === "passed" ? `{green-fg}Passed{/}` : "{red-fg}Failed{/}"
}
function colorizeHerokuStatus(status) {
    return status === "up" ? `{green-fg}Up{/}` : `{red-fg}${status}{/}`
}

function loadHeroku() {
    return new Promise((resolve, reject) => {
        exec("heroku ps -a igloo-production --json", (err, stdout, stderr) => {
            try {
                const data = JSON.parse(stdout)
                resolve(colorizeHerokuStatus(data[0].state))
            } catch (e) {
                resolve("Err")
            }
        })
    })
}

function loadTravis() {
    return new Promise((resolve, reject) => {
        var options = {
            method: "GET",
            url: "https://api.travis-ci.org/repos/IglooCloud/IglooBering",
            headers: {
                authorization: "token " + process.env.TRAVIS_TOKEN,
                accept: "application/vnd.travis-ci.2.1+json",
                "user-agent": "MyClient/1.0.0",
            },
            json: true,
        }

        request(options, function(error, response, body) {
            if (error) resolve("Err")

            resolve(colorizeTravisStatus(body.repo.last_build_state))
        })
    })
}

async function loadBering(box, screen) {
    let travisStatus = "?"
    let herokuStatus = "?"

    loadTravis().then(newStatus => {
        travisStatus = newStatus
        box.setContent(`\n Travis: ${travisStatus}\n\n Heroku: ${herokuStatus}`)
        screen.render()
    })

    loadHeroku().then(newStatus => {
        herokuStatus = newStatus
        box.setContent(`\n Travis: ${travisStatus}\n\n Heroku: ${herokuStatus}`)
        screen.render()
    })
}

module.exports = loadBering

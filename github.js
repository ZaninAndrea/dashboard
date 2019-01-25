const contribution = require("./githubStreak")

module.exports = (box, screen) => {
    contribution("ZaninAndrea", {
        onSuccess: data => {
            box.setContent(
                `\n Current streak: ${
                    data.streak.current
                } \n\n Contributions made: ${data.contributions.total}`
            )
            screen.render()
        },
        onFailure: error => {
            box.setContent(
                `\n Current streak: Err \n\n Contributions made: Err`
            )
            screen.render()
        },
    })
}

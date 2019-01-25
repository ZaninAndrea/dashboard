const contribution = require("./githubStreak")

function colorizeStreak(streak) {
    return streak === 0
        ? `{red-fg}0{/}`
        : streak < 100
        ? `{green-fg}${streak}{/}`
        : `{blue-fg}${streak}{/}`
}

module.exports = (box, screen) => {
    contribution("ZaninAndrea", {
        onSuccess: data => {
            box.setContent(
                `\n Current streak: ${colorizeStreak(
                    data.streak.current
                )} \n\n Contributions made: ${data.contributions.total}`
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

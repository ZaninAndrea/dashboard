var request = require("request")
require("dotenv").config()

function loadMeditation(box, screen) {
    var options = {
        method: "GET",
        url: "https://api.prod.headspace.com/content/user-stats",
        qs: { userId: "HSUSER_PLHDGRHR0CU8BQ8R" },
        headers: { authorization: "bearer " + process.env.HEADSPACE_TOKEN },
        json: true,
    }

    request(options, function(error, response, body) {
        if (error) throw new Error(error)

        const streak = body.data.filter(
            dataPoint => dataPoint.attributes.label === "RUN_STREAK"
        )[0].attributes.currentValue
        const totalMinutes = body.data.filter(
            dataPoint => dataPoint.attributes.label === "TOTAL_MINUTES"
        )[0].attributes.currentValue

        box.setContent(
            `\n Current streak: ${streak} \n\n Total minutes meditated: ${totalMinutes}`
        )
        screen.render()
    })
}

module.exports = loadMeditation

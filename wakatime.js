var request = require("request")
require("dotenv").config()

function loadStepsData(bar, screen) {
    var options = {
        method: "GET",
        url: process.env.WAKATIME_URL,
        json: true,
    }

    function getDay(rawDate) {
        const date = new Date(rawDate)
        switch (date.getDay()) {
            case 0:
                return "Sun"
            case 1:
                return "Mon"
            case 2:
                return "Tue"
            case 3:
                return "Wed"
            case 4:
                return "Thu"
            case 5:
                return "Fri"
            case 6:
                return "Sat"
        }
    }

    request(options, function(error, response, body) {
        if (error) throw new Error(error)

        const dataPoints = body.data
            .map(
                point =>
                    point.grand_total.hours * 60 + point.grand_total.minutes
            )
            .slice(0, 6)
        const dates = body.data
            .map(point => getDay(point.range.date))
            .slice(0, 6)

        bar.setData({ titles: dates, data: dataPoints })
        screen.render()
    })
}

module.exports = loadStepsData

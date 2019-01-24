var request = require("request")
require("dotenv").config()

function loadStepsData(bar, screen) {
    var today = new Date()
    today.setHours(0, 0, 0, 0)

    var options = {
        method: "POST",
        url: "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
        headers: {
            authorization: `Bearer ${process.env.GOOGLE_FIT_KEY}`,
            "content-type": "application/json",
        },
        body: {
            aggregateBy: [
                {
                    dataTypeName: "com.google.step_count.delta",
                    dataSourceId:
                        "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
                },
            ],
            bucketByTime: { durationMillis: 86400000 },
            startTimeMillis: +today - 86400000 * 6,
            endTimeMillis: +today,
        },
        json: true,
    }

    function getDay(date) {
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

        if (!body.bucket) {
            bar.setData({
                titles: ["err", "err", "err", "err", "err", "err"],
                data: [0, 0, 0, 0, 0, 0],
            })
        } else {
            const points = body.bucket.map(day => {
                const parsedDay = new Date(parseInt(day.startTimeMillis))
                return {
                    steps: day.dataset[0].point[0].value[0].intVal,
                    day: getDay(parsedDay),
                }
            })

            const dataPoints = points.map(point => point.steps)
            const dates = points.map(point => point.day)

            bar.setData({ titles: dates, data: dataPoints })
        }
        screen.render()
    })
}

module.exports = loadStepsData

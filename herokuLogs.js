const { exec, spawn } = require("child_process")

module.exports = (log, screen) => {
    const herokuLogs = spawn("heroku logs -a igloo-production -t", {
        shell: true,
    })

    herokuLogs.stdout.setEncoding("utf8")
    herokuLogs.stdout.on("data", data => {
        log.log(data)
        screen.render()
    })

    herokuLogs.stderr.setEncoding("utf8")
    herokuLogs.stderr.on("data", data => {
        log.log("ERROR: " + data)
        screen.render()
    })

    return herokuLogs
}

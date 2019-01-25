var blessed = require("blessed"),
    contrib = require("blessed-contrib")
var loadStepsData = require("./steps")
var loadHeroku = require("./herokuLogs")
var loadWakatime = require("./wakatime")
var loadGmail = require("./gmailList")
var loadTrello = require("./trelloList")
var loadHeadspace = require("./headspace")
var loadGithub = require("./github")
var opn = require("opn")
var screen = blessed.screen()

var grid = new contrib.grid({ rows: 12, cols: 12, screen: screen })

var stepsBar = grid.set(0, 8, 4, 4, contrib.bar, {
    label: "Steps",
    barWidth: 5,
    barSpacing: 6,
    xOffset: 2,
    maxHeight: 9,
    barBgColor: "red",
})
var wakatimeBar = grid.set(0, 4, 4, 4, contrib.bar, {
    label: "Wakatime (mins)",
    barWidth: 5,
    barSpacing: 6,
    xOffset: 2,
    maxHeight: 9,
})

var herokuLog = grid.set(8, 0, 4, 12, contrib.log, {
    fg: "white",
    selectedFg: "white",
    label: "Heroku logs",
})

var gmailTable = grid.set(0, 0, 4, 4, contrib.table, {
    keys: true,
    fg: "white",
    selectedFg: "white",
    selectedBg: "blue",
    interactive: false,
    label: "Mail",
    columnWidth: [100],
})
var trelloTable = grid.set(4, 0, 4, 6, contrib.table, {
    keys: true,
    fg: "white",
    selectedFg: "white",
    selectedBg: "blue",
    interactive: false,
    label: "Trello",
    columnWidth: [50, 30],
})

var headspaceBox = grid.set(4, 8, 2, 4, blessed.box, {
    content: "\n Current streak: ? \n\n Total minutes meditated: ?",
    label: "Headspace",
    xOffset: 2,
    xPadding: 2,
    tags: true,
})
var githubBox = grid.set(6, 8, 2, 4, blessed.box, {
    content: "\n Current streak: ? \n\n Contributions made: ?",
    label: "Github",
    xOffset: 2,
    xPadding: 2,
    tags: true,
})

clearLog(herokuLog)
loadGithub(githubBox, screen)
loadHeadspace(headspaceBox, screen)
loadStepsData(stepsBar, screen)
loadWakatime(wakatimeBar, screen)
loadGmail(gmailTable, screen)
loadTrello(trelloTable, screen)
let herokuProcess = loadHeroku(herokuLog, screen)

screen.key(["escape", "q", "C-c"], function(ch, key) {
    return process.exit(0)
})

function clearLog(log) {
    for (let i = 0; i < 25; i++) {
        log.log("")
    }
    screen.render()
}

screen.key(["C-r"], function(ch, key) {
    stepsBar.setData({ titles: [], data: [] })
    wakatimeBar.setData({ titles: [], data: [] })
    gmailTable.setData({ headers: [], data: [] })
    trelloTable.setData({ headers: [], data: [] })
    headspaceBox.setContent(
        "\n Current streak: ? \n\n Total minutes meditated: ?"
    )
    githubBox.setContent("\n Current streak: ? \n\n Contributions made: ?")

    clearLog(herokuLog)
    if (herokuProcess) herokuProcess.kill()

    loadStepsData(stepsBar, screen)
    loadGithub(githubBox, screen)
    loadHeadspace(headspaceBox, screen)
    loadWakatime(wakatimeBar, screen)
    loadGmail(gmailTable, screen)
    loadTrello(trelloTable, screen)
    herokuProcess = loadHeroku(herokuLog, screen)

    screen.render()
})
screen.key(["g"], function(ch, key) {
    opn("https://gmail.com")
})

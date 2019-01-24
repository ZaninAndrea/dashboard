const getMails = require("./gmail")

module.exports = async (table, screen) => {
    try {
        const mails = await getMails()
        table.setData({ headers: [" Subject "], data: mails })
    } catch (e) {
        table.setData({ headers: ["Error"], data: [] })
    }
    screen.render()
}

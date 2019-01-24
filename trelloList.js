var Trello = require("trello")
require("dotenv").config()
var trello = new Trello(process.env.TRELLO_KEY, process.env.TRELLO_TOKEN)

const TRACKED_LISTS = [
    "5c0d143bf5350729d2425a5c",
    "5c0a93da9296f66dae1bfa3a",
    "5b432c1bac1c58f504cb1a8c",
    "5b6439043ca618117a4670fd",
]

function fetchCardsFromList(id) {
    return new Promise((resolve, reject) => {
        trello.getCardsOnList(id, (err, res) => {
            resolve(
                typeof res !== "string"
                    ? res.map(card => {
                          const tag =
                              card.labels
                                  .map(label => label.name)
                                  .filter(
                                      name =>
                                          ["Short", "Average", "Long"].indexOf(
                                              name
                                          ) !== -1
                                  )[0] || ""

                          return [card.name, tag]
                      })
                    : []
            )
        })
    })
}

async function fetchAllCards() {
    const allCards = await Promise.all(TRACKED_LISTS.map(fetchCardsFromList))

    return allCards.reduce((acc, curr) => [...acc, ...curr], [])
}

module.exports = async (table, screen) => {
    try {
        const cards = await fetchAllCards()
        table.setData({
            headers: [` ${cards.length} CARDS TO NEXT RELEASE`, "TIME NEEDED"],
            data: cards,
        })
    } catch (e) {
        table.setData({ headers: ["Error"], data: [] })
    }
    screen.render()
}

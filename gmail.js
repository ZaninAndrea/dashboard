const fs = require("fs")
const { google } = require("googleapis")

const TOKEN_PATHS = ["token.json", "token2.json", "token3.json"]

function fetchMails() {
    return new Promise((resolve, reject) => {
        fs.readFile("credentials.json", async (err, content) => {
            if (err) reject("Error loading client secret file:", err)

            const allMails = await Promise.all(
                TOKEN_PATHS.map(
                    TOKEN_PATH =>
                        new Promise((resolve, reject) => {
                            const {
                                client_secret,
                                client_id,
                                redirect_uris,
                            } = JSON.parse(content).installed
                            const oAuth2Client = new google.auth.OAuth2(
                                client_id,
                                client_secret,
                                redirect_uris[0]
                            )
                            // Check if we have previously stored a token.
                            fs.readFile(TOKEN_PATH, (err, token) => {
                                if (err) resolve("run getNewToken function")
                                oAuth2Client.setCredentials(JSON.parse(token))

                                resolve(fetchUserMails(oAuth2Client))
                            })
                        })
                )
            )

            const flattenedMails = allMails.reduce(
                (acc, curr) => [...acc, ...curr],
                []
            )

            resolve(flattenedMails)
        })
    })
}

function fetchUserMails(auth) {
    return new Promise((resolve, reject) => {
        const gmail = google.gmail({ version: "v1", auth })
        gmail.users.messages.list(
            {
                userId: "me",
                q: "is:unread label:INBOX",
            },
            async (err, res) => {
                if (err) resolve("API error")
                else if (res.data.resultSizeEstimate === 0) {
                    resolve([])
                } else {
                    const messages = res.data.messages
                    const subjects = await Promise.all(
                        messages.map(message =>
                            findMessageHeader(message.threadId, gmail)
                        )
                    )
                    resolve(subjects)
                }
            }
        )
    })
}

function findMessageHeader(id, gmail) {
    return new Promise((resolve, reject) => {
        gmail.users.messages.get(
            {
                userId: "me",
                id: id,
            },
            (err, res) => {
                if (err) resolve("API error")
                else if (!res.data.payload) resolve("Empty result")
                else {
                    const message = res.data.payload.headers.filter(
                        header => header.name === "Subject"
                    )[0].value
                    resolve([message])
                }
            }
        )
    })
}

module.exports = fetchMails

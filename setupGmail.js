const readline = require("readline")
var opn = require("opn")
const fs = require("fs")
const { google } = require("googleapis")

const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]

function getNewToken() {
    fs.readFile("credentials.json", async (err, content) => {
        if (err) reject("Error loading client secret file:", err)

        const { client_secret, client_id, redirect_uris } = JSON.parse(
            content
        ).installed
        const oAuth2Client = new google.auth.OAuth2(
            client_id,
            client_secret,
            redirect_uris[0]
        )

        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: "offline",
            scope: SCOPES,
        })
        opn(authUrl)

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        })
        rl.question("Enter the code from that page here: ", code => {
            rl.question("token file name: ", TOKEN_PATH => {
                rl.close()

                oAuth2Client.getToken(code, (err, token) => {
                    if (err)
                        return console.error(
                            "Error retrieving access token",
                            err
                        )
                    oAuth2Client.setCredentials(token)
                    // Store the token to disk for later program executions
                    fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
                        if (err) return console.error(err)
                        console.log("Token stored to", TOKEN_PATH)
                    })
                })
            })
        })
    })
}

getNewToken()

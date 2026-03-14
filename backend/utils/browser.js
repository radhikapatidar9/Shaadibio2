const puppeteer = require("puppeteer")

let browser = null

const getBrowser = async () => {

if(!browser || !browser.isConnected()){

browser = await puppeteer.launch({
headless: true,
args: ["--no-sandbox","--disable-setuid-sandbox"]
})

}

return browser

}

module.exports = getBrowser
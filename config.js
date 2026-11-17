// ---------------------------------------------------------------------------
// FirmwareNerds Poster: site settings.
// Every price, number and name on the site comes from here. Edit, commit, push.
// ---------------------------------------------------------------------------
window.FNP_CONFIG = {
  currency: "USD",

  // One-off prices. Keep whole dollars: they dial cleanly in the USSD code.
  prices: {
    diy: 5,     // "Do it yourself"
    setup: 10,  // "Setup with me"
  },

  // EcoCash wallet that receives payments.
  ecocashNumber: "0779787091",
  ecocashName: "Bigwell Baramasimbe",   // the name EcoCash shows the payer

  // WhatsApp number for proof of payment, international format, no + or spaces.
  whatsappNumber: "263779787091",

  // EcoCash USD send-money code. {number} and {amount} are filled in automatically.
  ussdTemplate: "*153*1*1*{number}*{amount}#",

  // A real post published by the agent (shown as proof on the page).
  examplePostUrl: "https://www.linkedin.com/feed/update/urn:li:share:7528401878389493761/",
};

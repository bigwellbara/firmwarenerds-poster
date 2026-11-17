// ---------------------------------------------------------------------------
// FirmwareNerds Poster: site settings.
// Every price, number and name on the site comes from here. Edit, commit, push.
// ---------------------------------------------------------------------------
window.FNP_CONFIG = {
  currency: "USD",

  // One-off prices.
  prices: {
    diy: 0,     // TODO: "Do it yourself" price
    setup: 0,   // TODO: "Setup with me" price
  },

  // EcoCash wallet that receives payments.
  ecocashNumber: "07XXXXXXXX",          // TODO: e.g. 0771234567
  ecocashName: "YOUR REGISTERED NAME",  // TODO: the name EcoCash shows the payer

  // WhatsApp number for proof of payment, international format, no + or spaces.
  whatsappNumber: "2637XXXXXXXX",       // TODO: e.g. 263771234567

  // Send-money USSD code. {number} and {amount} are filled in automatically.
  // TODO: confirm this exact code works on your phone for the wallet you use.
  ussdTemplate: "*151*1*1*{number}*{amount}#",

  // A real post published by the agent (shown as proof on the page).
  examplePostUrl: "https://www.linkedin.com/feed/update/urn:li:share:7528401878389493761/",
};

// Fills prices and payment links from config.js. No other dependencies.
(function () {
  var C = window.FNP_CONFIG;
  if (!C) return;

  var PLAN_NAMES = { diy: "Do it yourself", setup: "Setup with me" };

  function money(n) {
    return C.currency + " " + Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 });
  }

  function ussdCode(amount) {
    return C.ussdTemplate.replace("{number}", C.ecocashNumber).replace("{amount}", String(amount));
  }

  // Prices anywhere on the page: <span data-price="diy"></span>
  document.querySelectorAll("[data-price]").forEach(function (el) {
    el.textContent = money(C.prices[el.getAttribute("data-price")]);
  });
  document.querySelectorAll("[data-ecocash-name]").forEach(function (el) { el.textContent = C.ecocashName; });
  document.querySelectorAll("[data-ecocash-number]").forEach(function (el) { el.textContent = C.ecocashNumber; });
  document.querySelectorAll("[data-example-post]").forEach(function (el) { el.href = C.examplePostUrl; });
  document.querySelectorAll("[data-whatsapp-help]").forEach(function (el) {
    el.href = "https://wa.me/" + C.whatsappNumber + "?text=" +
      encodeURIComponent("Hi FirmwareNerds, I have a question about FirmwareNerds Poster: ");
  });

  var payBtn = document.getElementById("pay-ecocash");
  var codeEl = document.getElementById("ussd-code");
  var amountEl = document.getElementById("pay-amount");
  var proofBtn = document.getElementById("send-proof");

  function selectPlan(plan) {
    var amount = C.prices[plan];
    var code = ussdCode(amount);
    if (codeEl) codeEl.textContent = code;
    if (amountEl) amountEl.textContent = money(amount) + " (" + PLAN_NAMES[plan] + ")";
    // "#" must be encoded as %23 in tel: links or Android drops everything after it.
    if (payBtn) payBtn.href = "tel:" + code.replace(/#/g, "%23");
    if (proofBtn) {
      var msg =
        "Hi FirmwareNerds, I have paid for FirmwareNerds Poster.\n" +
        "Plan: " + PLAN_NAMES[plan] + " (" + money(amount) + ")\n" +
        "My GitHub username: \n" +
        "My EcoCash confirmation message (pasted below):\n";
      proofBtn.href = "https://wa.me/" + C.whatsappNumber + "?text=" + encodeURIComponent(msg);
    }
    var radio = document.querySelector('input[name="plan"][value="' + plan + '"]');
    if (radio) radio.checked = true;
  }

  document.querySelectorAll('input[name="plan"]').forEach(function (r) {
    r.addEventListener("change", function () { selectPlan(r.value); });
  });
  // "Choose" buttons on the price cards pre-select the plan.
  document.querySelectorAll("[data-choose]").forEach(function (b) {
    b.addEventListener("click", function () { selectPlan(b.getAttribute("data-choose")); });
  });

  var copyBtn = document.getElementById("copy-code");
  if (copyBtn && codeEl) {
    copyBtn.addEventListener("click", function () {
      var done = function () { copyBtn.textContent = "Copied"; setTimeout(function () { copyBtn.textContent = "Copy"; }, 1500); };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(codeEl.textContent).then(done, function () {});
      }
    });
  }

  selectPlan("diy");

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

# FirmwareNerds Poster: sales site

Public product page for FirmwareNerds Poster, served by GitHub Pages at
https://bigwellbara.github.io/firmwarenerds-poster/

- `index.html`: the product page, with pricing and EcoCash payment.
- `setup.html`: the buyer setup guide. **Generated; don't edit it by hand.**
- `config.js`: prices, EcoCash number and name, WhatsApp number and USSD code. **Change these here only.**
- `assets/`: styles, script and logo.

## Update the setup guide

`setup.html` is built from the README of the private template repo (`../firmwarenerds-poster-agent/README.md`):

```bash
pip install markdown
python tools/build_setup.py ../firmwarenerds-poster-agent/README.md setup.html
```

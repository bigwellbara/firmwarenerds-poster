"""Build setup.html from the buyer README in the private template repo.

Usage (needs the `markdown` package):
    python tools/build_setup.py ../firmwarenerds-poster-agent/README.md setup.html
"""
import re
import sys
from pathlib import Path

import markdown

PAGE = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Setup Guide · FirmwareNerds Poster</title>
  <meta name="description" content="Step-by-step setup guide for FirmwareNerds Poster, the daily LinkedIn post agent.">
  <meta name="theme-color" content="#1f2328">
  <link rel="icon" href="assets/logo.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap">
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="./"><img src="assets/logo.png" alt=""> FirmwareNerds Poster</a>
    <nav class="nav">
      <a href="./#how" class="hide-sm">How it works</a>
      <a href="./#pricing" class="nav-cta">Prices</a>
    </nav>
  </div>
</header>
<main>
  <div class="guide-hero">
    <div class="wrap">
      <h1>Setup guide</h1>
      <p>Everything you need to get FirmwareNerds Poster posting on your LinkedIn profile, step by step. It takes about 30 minutes.</p>
    </div>
  </div>
  <section>
    <div class="wrap guide">
{body}
    </div>
  </section>
</main>
<footer class="site-footer">
  <div class="wrap">
    <span>© FirmwareNerds · Harare, Zimbabwe</span>
    <span><a href="./">Home</a> · <a data-whatsapp-help href="#" target="_blank" rel="noopener">WhatsApp</a></span>  </div>
</footer>
<script src="config.js"></script>
<script src="assets/site.js"></script>
</body>
</html>
"""


def main(src: str, dest: str) -> None:
    text = Path(src).read_text(encoding="utf-8")
    # Public page tweaks: no link to the private LICENSE file, and the product
    # page link points to this site's home page.
    text = text.replace("See [LICENSE.md](LICENSE.md). In short: this", "This")
    text = text.replace("](https://bigwellbara.github.io/firmwarenerds-poster/)", "](./)")
    # The page banner already shows the title.
    text = re.sub(r"^# FirmwareNerds Poster\s*$", "", text, count=1, flags=re.M)
    html = markdown.markdown(text, extensions=["tables", "sane_lists"])
    # External links open in a new tab.
    html = re.sub(r'<a href="(https?://[^"]+)">', r'<a href="\1" target="_blank" rel="noopener">', html)
    Path(dest).write_text(PAGE.replace("{body}", html), encoding="utf-8", newline="\n")
    print(f"Wrote {dest}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])

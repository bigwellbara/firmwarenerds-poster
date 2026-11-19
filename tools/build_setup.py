"""Build the public setup.html preview from the buyer README in the private template repo.

Only the first part of the guide (up to the end of Step 1) is published. The
remaining steps appear as titles over blurred placeholder lines behind a lock;
their real text is NOT included in the page, so it can't be read from the HTML.
Buyers read the full guide in their private copy (the template repo README).

Usage (needs the `markdown` package):
    python tools/build_setup.py ../firmwarenerds-poster-agent/README.md setup.html
"""
import html as htmllib
import re
import sys
from pathlib import Path

import markdown

CUT_AT = "## Step 2."          # everything from this heading on is locked

PAGE = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Setup Guide · FirmwareNerds Poster</title>
  <meta name="description" content="A preview of the setup guide for FirmwareNerds Poster, the daily LinkedIn post agent.">
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
      <p>A preview of the step-by-step guide. Buyers get the full guide with their copy. Setup takes about 30 minutes.</p>
    </div>
  </div>
  <section>
    <div class="wrap guide">
{body}
{locked}
    </div>
  </section>
</main>
<footer class="site-footer">
  <div class="wrap">
    <span>© FirmwareNerds · Harare, Zimbabwe</span>
    <span><a href="./">Home</a> · <a data-whatsapp-help href="#" target="_blank" rel="noopener">WhatsApp</a></span>
  </div>
</footer>
<script src="config.js"></script>
<script src="assets/site.js"></script>
</body>
</html>
"""

LOCK_ICON = (
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 '
    '2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 1 1 6 0v3H9Zm3 3.5a1.75 1.75 0 0 1 1 3.2V19h-2v-2.3a1.75 '
    '1.75 0 0 1 1-3.2Z"/></svg>'
)


def locked_section(rest: str) -> str:
    """Titles of the locked steps over blurred placeholder lines. No real text."""
    titles = re.findall(r"^## (.+)$", rest, flags=re.M)
    widths = ["96%", "88%", "92%", "70%", "84%", "60%"]
    preview = []
    for i, title in enumerate(titles):
        bars = "".join(f'<span style="width:{widths[(i + j) % len(widths)]}"></span>' for j in range(4))
        preview.append(f"<h2>{htmllib.escape(title)}</h2><div class=\"ph\">{bars}</div>")
    steps = [t for t in titles if t.lower().startswith("step")]
    return f"""
<div class="locked">
  <div class="locked-preview" aria-hidden="true">
    {''.join(preview)}
  </div>
  <div class="locked-overlay">
    <div class="locked-card">
      <a class="lock" href="./#pay" aria-label="The rest of the guide is for buyers. See how to pay.">
        {LOCK_ICON}
        <span class="lock-tip">Unlock the full guide → <u>See how to pay</u></span>
      </a>
      <h3>The rest of the guide is for buyers</h3>
      <p>{len(steps)} more steps cover your free Gemini key, your LinkedIn app and token, your settings, testing and going live. You get the full guide, and your own copy of the agent, as soon as your payment is confirmed.</p>
      <a class="btn btn-primary" href="./#pay">See how to pay</a>
    </div>
  </div>
</div>"""


def main(src: str, dest: str) -> None:
    text = Path(src).read_text(encoding="utf-8")
    head, sep, rest = text.partition(CUT_AT)
    if not sep:
        raise SystemExit(f"Cut marker {CUT_AT!r} not found in {src}")
    rest = sep + rest

    # Public preview tweaks.
    head = re.sub(r"^# FirmwareNerds Poster\s*$", "", head, count=1, flags=re.M)   # the banner shows the title
    head = head.replace("Thank you for buying FirmwareNerds Poster. Once it's set up, it", "Once it's set up, FirmwareNerds Poster")
    head = head.replace("](https://bigwellbara.github.io/firmwarenerds-poster/)", "](./)")
    head = re.sub(r"\n---\s*$", "\n", head.rstrip()) + "\n"

    body = markdown.markdown(head, extensions=["tables", "sane_lists"])
    body = re.sub(r'<a href="(https?://[^"]+)">', r'<a href="\1" target="_blank" rel="noopener">', body)
    page = PAGE.replace("{body}", body).replace("{locked}", locked_section(rest))
    Path(dest).write_text(page, encoding="utf-8", newline="\n")
    print(f"Wrote {dest}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])

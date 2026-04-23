## Setup

```bash
# 1. Clone the repo
git clone https://github.com/Tatyanya/intercars-playwright.git
cd intercars-playwright

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install chromium
```

---

## Run the test

```bash
# Headless (default)
npm test

# Headed — recommended, required if CAPTCHA appears
npm run test:headed

# View HTML report after run
npm run test:report
```


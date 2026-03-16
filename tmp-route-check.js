const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('http://localhost:3000/course-player/1', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1500);

  const results = [];

  async function clickAndCheck(linkText, expectedPath, expectedMarker) {
    await page.getByRole('link', { name: linkText }).first().click({ timeout: 10000 });
    await page.waitForTimeout(1500);
    const url = page.url();
    const hasMarker = (await page.content()).toLowerCase().includes(expectedMarker.toLowerCase());
    const hasCourseHeader = (await page.content()).toLowerCase().includes('course outline');
    results.push({ linkText, url, hasMarker, hasCourseHeader });
    return url.includes(expectedPath) && hasMarker && !hasCourseHeader;
  }

  const dashboardOk = await clickAndCheck('Dashboard', '/dashboard', 'career insights');
  const jobsOk = await clickAndCheck('Jobs', '/jobs', 'job');

  console.log(JSON.stringify({ dashboardOk, jobsOk, results }, null, 2));
  await browser.close();
})();

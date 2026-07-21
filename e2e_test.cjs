const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const logs = [];
  page.on('console', m => logs.push(`[console.${m.type()}] ${m.text()}`));
  page.on('pageerror', e => logs.push(`[pageerror] ${e.message}`));

  const BASE = 'https://xnpc100-ai.github.io/novel-workshop-standalone/';
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2500);

  console.log('STEP1 url:', page.url());
  await page.screenshot({ path: 'shot1_home.png' });

  // 列出所有按钮文本
  const btns1 = await page.$$('button');
  console.log('Buttons on home:', btns1.length);
  for (const b of btns1) {
    const t = (await b.textContent() || '').trim();
    if (t) console.log('  BTN:', JSON.stringify(t));
  }

  // 找激活码输入框
  const inputs = await page.$$('input');
  console.log('Inputs:', inputs.length);
  let filled = false;
  for (const inp of inputs) {
    const ph = (await inp.getAttribute('placeholder')) || '';
    const t = (await inp.getAttribute('type')) || '';
    console.log('  INPUT placeholder=', JSON.stringify(ph), 'type=', t);
    if (ph.includes('激活') || ph.includes('请输入') || t === 'text') {
      await inp.fill('XSGC918388928759');
      filled = true;
    }
  }
  console.log('Filled code:', filled);

  // 点激活按钮（找含"激活"或"立即"的）
  let clicked = false;
  const btns2 = await page.$$('button');
  for (const b of btns2) {
    const t = (await b.textContent() || '').trim();
    if (t.includes('激活') || t.includes('立即')) {
      await b.click();
      clicked = true;
      console.log('Clicked button:', JSON.stringify(t));
      break;
    }
  }
  await page.waitForTimeout(3000);
  console.log('STEP2 url:', page.url());
  await page.screenshot({ path: 'shot2_after_activate.png' });

  // 检查邮箱弹窗
  const body2 = await page.textContent('body');
  console.log('Has 绑定邮箱:', body2.includes('绑定邮箱'));
  console.log('Has 稍后绑定:', body2.includes('稍后绑定'));

  // 点 稍后绑定
  let skipped = false;
  const btns3 = await page.$$('button');
  for (const b of btns3) {
    const t = (await b.textContent() || '').trim();
    if (t.includes('稍后绑定')) {
      await b.click();
      skipped = true;
      console.log('Clicked 稍后绑定');
      break;
    }
  }
  await page.waitForTimeout(3000);
  console.log('STEP3 url:', page.url());
  await page.screenshot({ path: 'shot3_after_skip.png' });

  const body3 = await page.textContent('body');
  console.log('Workbench body length:', body3.length);
  console.log('Workbench has 仿写 or 工作台:', body3.includes('仿写') || body3.includes('工作台') || body3.includes('核心'));

  console.log('--- ERRORS ---');
  const errs = logs.filter(l => l.includes('pageerror') || (l.includes('console.error')));
  console.log(errs.length ? errs.join('\n') : 'NO JS ERRORS');

  console.log('=== SUMMARY ===');
  console.log(JSON.stringify({ filled, clicked, skipped, finalUrl: page.url(), hasBind: body2.includes('绑定邮箱'), workbenchLen: body3.length }));

  await browser.close();
})().catch(e => { console.error('TEST FAILED:', e); process.exit(1); });

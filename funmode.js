/* ============================================
   TRYB Z JAJEM — wyniki opisowe, pasek ryzyka,
   licznik kebabów, easter eggi i fruwające emoji.
   Dołącz ten plik PO script.js — nic w nim nie zmienia,
   tylko obserwuje wynik i dorysowuje resztę.
   ============================================ */

(function () {
  const TXT = {
    pl: {
      risk: [
        { max: 1.2, cls: 'risk-low', text: '😎 Spokojny Duch — ufasz swojemu jelitu' },
        { max: 1.8, cls: 'risk-mid', text: '🙂 Rozsądny Pakowacz' },
        { max: 2.5, cls: 'risk-mid', text: '😅 Strategiczna Rezerwa' },
        { max: 3.5, cls: 'risk-high', text: '😰 Kryzysowy Bufor Bezpieczeństwa' },
        { max: Infinity, cls: 'risk-extreme', text: '🚨💩 TRYB PRZETRWANIA — pakuj cały dobytek' }
      ],
      riskBarLabel: (pct) => `Ryzyko Sraczkowości: ${pct}%`,
      kebabPrefix: 'Bezpieczna liczba kebabów przed wyjazdem: ',
      kebabZero: '0 — i tak już jest za późno 💀',
      kebabSuffix: (n) => `${n} 🌯 — jedz śmiało`,
      eggs: {
        longTrip: '🏕️ Wyjazd czy przeprowadzka? 30 dni to poważna deklaracja.',
        oneDayTrip: '⚡ Jednodniowa wycieczka. Nawet Twoje jelito da radę bez kalkulatora.',
        deathCombo: '☢️ KOMBINACJA ŚMIERCI: ciężki alkohol + ekstremalny błonnik. Rozważ zostanie w domu.',
        sixtyNine: '😏 69 par bielizny. Nice.',
        zeroResult: '🤔 Zero par bielizny? Albo jesteś odważnym minimalistą, albo coś poszło nie tak.'
      }
    },
    en: {
      risk: [
        { max: 1.2, cls: 'risk-low', text: '😎 Calm Spirit — you trust your gut' },
        { max: 1.8, cls: 'risk-mid', text: '🙂 Reasonable Packer' },
        { max: 2.5, cls: 'risk-mid', text: '😅 Strategic Reserve' },
        { max: 3.5, cls: 'risk-high', text: '😰 Crisis Safety Buffer' },
        { max: Infinity, cls: 'risk-extreme', text: '🚨💩 SURVIVAL MODE — pack everything you own' }
      ],
      riskBarLabel: (pct) => `Diarrhea Risk: ${pct}%`,
      kebabPrefix: 'Safe number of kebabs before departure: ',
      kebabZero: '0 — it is already too late 💀',
      kebabSuffix: (n) => `${n} 🌯 — eat freely`,
      eggs: {
        longTrip: '🏕️ Trip or moving out? 30 days is a serious commitment.',
        oneDayTrip: '⚡ A one-day trip. Even your gut can handle this without a calculator.',
        deathCombo: '☢️ DEATH COMBO: heavy alcohol + extreme fiber. Consider staying home.',
        sixtyNine: '😏 69 pairs of underwear. Nice.',
        zeroResult: '🤔 Zero pairs? Either you are a bold minimalist, or something went wrong.'
      }
    }
  };

  function currentLang() {
    const enBtn = document.getElementById('btn-lang-en');
    return enBtn && enBtn.classList.contains('active') ? 'en' : 'pl';
  }

  function ensureElements() {
    const resultCard = document.querySelector('.result-card');
    if (!resultCard || document.getElementById('resultLabel')) return;

    const label = document.createElement('div');
    label.id = 'resultLabel';
    label.className = 'result-label';

    const barContainer = document.createElement('div');
    barContainer.className = 'risk-bar-container';
    barContainer.innerHTML =
      '<div id="riskBar" class="risk-bar-fill"></div><div id="riskBarLabel" class="risk-bar-label"></div>';

    const kebab = document.createElement('div');
    kebab.id = 'kebabCounter';
    kebab.className = 'kebab-counter';

    const egg = document.createElement('div');
    egg.id = 'easterEggBox';
    egg.className = 'easter-egg-box';
    egg.style.display = 'none';

    const breakdown = resultCard.querySelector('.result-breakdown');
    if (breakdown) {
      resultCard.insertBefore(label, breakdown);
      resultCard.insertBefore(barContainer, breakdown);
    } else {
      resultCard.appendChild(label);
      resultCard.appendChild(barContainer);
    }
    resultCard.appendChild(kebab);
    resultCard.appendChild(egg);

    if (!document.getElementById('emojiLayer')) {
      const layer = document.createElement('div');
      layer.id = 'emojiLayer';
      document.body.appendChild(layer);
    }
  }

  function getNum(id, fallback) {
    const el = document.getElementById(id);
    if (!el) return fallback;
    const v = parseFloat(el.value);
    return isNaN(v) ? fallback : v;
  }

  let lastEggMsg = null;

  function updateFunMode() {
    const totalEl = document.getElementById('resTotal');
    if (!totalEl) return;

    const total = parseFloat(totalEl.textContent) || 0;
    const days = getNum('totalDays', 1);
    const alcohol = getNum('globalAlcohol', 0);
    const fiber = getNum('globalFiber', 0);
    const lang = currentLang();
    const t = TXT[lang];
    const ratio = total / Math.max(days, 1);

    // --- Wynik opisowy ---
    const band = t.risk.find((b) => ratio <= b.max);
    const labelEl = document.getElementById('resultLabel');
    if (labelEl && band) {
      labelEl.textContent = band.text;
      labelEl.className = 'result-label ' + band.cls;
    }

    // --- Pasek ryzyka ---
    const pct = Math.min(100, Math.round((ratio / 4) * 100));
    const bar = document.getElementById('riskBar');
    const barLabel = document.getElementById('riskBarLabel');
    if (bar) {
      bar.style.width = pct + '%';
      let color;
      if (pct < 30) color = '#4caf50';
      else if (pct < 55) color = '#f2c230';
      else if (pct < 80) color = '#e67e22';
      else color = '#8b4513';
      bar.style.background = color;
    }
    if (barLabel) barLabel.textContent = t.riskBarLabel(pct);

    // --- Licznik kebabów ---
    const kebabEl = document.getElementById('kebabCounter');
    if (kebabEl) {
      const safeKebabs = Math.round((1 - fiber - alcohol * 0.5) * 5);
      kebabEl.innerHTML =
        t.kebabPrefix + '<strong>' + (safeKebabs <= 0 ? t.kebabZero : t.kebabSuffix(safeKebabs)) + '</strong>';
    }

    // --- Easter eggi ---
    const eggEl = document.getElementById('easterEggBox');
    let eggMsg = null;
    if (days >= 30) eggMsg = t.eggs.longTrip;
    else if (days === 1) eggMsg = t.eggs.oneDayTrip;
    if (alcohol >= 0.6 && fiber >= 0.7) eggMsg = t.eggs.deathCombo;
    if (total === 69) eggMsg = t.eggs.sixtyNine;
    if (total === 0) eggMsg = t.eggs.zeroResult;

    if (eggEl) {
      if (eggMsg) {
        eggEl.textContent = eggMsg;
        eggEl.style.display = 'block';
      } else {
        eggEl.style.display = 'none';
      }
    }

    // --- Fruwające emoji przy wysokim ryzyku (nie spamuj przy każdej mikro-zmianie) ---
    if (ratio > 2.5 && eggMsg !== lastEggMsg) {
      spawnEmojiBurst(ratio > 3.5 ? 10 : 5);
    }
    lastEggMsg = eggMsg;
  }

  function spawnEmojiBurst(count) {
    const layer = document.getElementById('emojiLayer');
    if (!layer) return;
    const emojis = ['💩', '🧻', '🚽', '🔥'];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'flying-emoji';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left = Math.random() * 100 + 'vw';
      el.style.animationDelay = Math.random() * 0.6 + 's';
      el.style.fontSize = 1.5 + Math.random() * 1.5 + 'rem';
      layer.appendChild(el);
      setTimeout(() => el.remove(), 3200);
    }
  }

  function init() {
    ensureElements();
    const totalEl = document.getElementById('resTotal');
    if (totalEl) {
      const observer = new MutationObserver(updateFunMode);
      observer.observe(totalEl, { childList: true, characterData: true, subtree: true });
    }
    ['btn-lang-pl', 'btn-lang-en'].forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => setTimeout(updateFunMode, 50));
    });
    setTimeout(updateFunMode, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
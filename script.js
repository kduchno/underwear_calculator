let currentMode = 'simple';
let laundrySessions = [];

const poopQuotes = [
    "„Gdy kupa w nosie gnieździ, sraczka po jelitach jeździ.”",
    "„Sraczka nie wybiera – dopadnie nawet bohatera.”",
    "„Lepszy wróg w progu niż kupa w nogawce.”",
    "„Nie odkładaj na jutro tego, co możesz zesrać dzisiaj.”",
    "„Kto z rana sra na całe gardło, temu w dzień nic nie pobrakło.”",
    "„Czasem człowiek myśli, że to tylko bąk... i wtedy zaczyna się tragedia.”",
    "„Prawdziwego przyjaciela poznaje się po tym, że pożyczy rolkę papieru.”",
    "„Gdy żołądek głośno gra, wiedz że zaraz będzie sra.”",
    "„Trzeba brać życie za rogi, a dupę trzymać z dala od podłogi.”",
    "„Przezorny zawsze spakowany, zwłaszcza gdy obiad był niepewny.”",
    "„Lepiej głośno pierdnąć w tłumie, niż cicho zesrać się w samotności.”",
    "„Sraczka jest jak niespodziewana wizyta teściowej – wchodzi bez pukania.”",
    "„Gdy w brzuchu burza świszcze, papier toaletowy jest Twoim ojczystym dziedzictwem.”",
    "„Życie jest jak papier toaletowy – długie, szare i w pewnym momencie się kończy.”",
    "„Świat należy do tych, co zdążyli do łazienki.”",
    "„Gdy zjesz kebab u araba, w nocy będzie straszna draka.”",
    "„Porażka boli, ale zesranie się w miejscowym autobusie boli bardziej.”",
    "„Bądź jak tygrys – skacz szybko, gdy poczujesz ucisk.”",
    "„Gdzie diabeł nie może, tam sraczkę pośle.”",
    "„Pamiętaj chemiku młody: nigdy nie ufaj pierdnięciu po ostrej potrawie.”"
];

function drawQuote() {
    const randomIndex = Math.floor(Math.random() * poopQuotes.length);
    document.getElementById('quoteText').innerText = poopQuotes[randomIndex];
}

const underwearTypes = {
    slips: `<svg class="underwear-icon-sm" viewBox="0 0 100 100"><path d="M15 30 C 35 28, 65 28, 85 30 C 80 55, 65 70, 58 72 L 42 72 C 35 70, 20 55, 15 30 Z" fill="currentColor"/></svg>`,
    boxers: `<svg class="underwear-icon-sm" viewBox="0 0 100 100"><path d="M15 30 C 15 25, 85 25, 85 30 L 82 75 L 53 75 L 50 50 L 47 75 L 18 75 Z" fill="currentColor"/></svg>`,
    briefs: `<svg class="underwear-icon-sm" viewBox="0 0 100 100"><path d="M20 32 C 35 30, 65 30, 80 32 C 78 52, 62 68, 56 68 L 44 68 C 38 68, 22 52, 20 32 Z" fill="currentColor"/></svg>`,
    thong: `<svg class="underwear-icon-sm" viewBox="0 0 100 100"><path d="M15 30 L 85 30 C 65 35, 53 65, 52 75 L 48 75 C 47 65, 35 35, 15 30 Z" fill="currentColor"/></svg>`,
    classic: `<svg class="underwear-icon-sm" viewBox="0 0 100 100"><path d="M18 32 C 35 30, 65 30, 82 32 C 78 55, 64 70, 55 70 L 45 70 C 36 70, 22 55, 18 32 Z" fill="currentColor"/></svg>`,
    longs: `<svg class="underwear-icon-sm" viewBox="0 0 100 100"><path d="M25 25 L 75 25 L 72 88 L 53 88 L 50 55 L 47 88 L 28 88 Z" fill="currentColor"/></svg>`
};

const defaultMealTypes = [
    { id: 'm1', name: 'Śniadanie', styleName: 'Slipki Bawełniane', icon: underwearTypes.slips, defaultHour: 8, defaultRisk: '0.33', simpleActive: true },
    { id: 'm2', name: 'II Śniadanie', styleName: 'Figi Codzienne', icon: underwearTypes.classic, defaultHour: 11, defaultRisk: '0.33', simpleActive: true },
    { id: 'm3', name: 'Obiad / Posiłek', styleName: 'Bokserki Bojowe', icon: underwearTypes.boxers, defaultHour: 14, defaultRisk: '0.33', simpleActive: true },
    { id: 'm4', name: 'Podwieczorek', styleName: 'Majtki Sportowe', icon: underwearTypes.briefs, defaultHour: 17, defaultRisk: '0.15', simpleActive: false },
    { id: 'm5', name: 'Kolacja', styleName: 'Bielizna Elegancka', icon: underwearTypes.longs, defaultHour: 20, defaultRisk: '0.33', simpleActive: true },
    { id: 'm6', name: 'Street Food / Impreza', styleName: 'Stringi Ryzyka', icon: underwearTypes.thong, defaultHour: 23, defaultRisk: '0.60', simpleActive: false }
];

const riskOptions = [
    { val: '0.00', label: '0% - Brak (Sterylnie)' },
    { val: '0.05', label: '5% - B. Niskie (Hotel 5*)' },
    { val: '0.10', label: '10% - Niskie (Sprawdzony lokal)' },
    { val: '0.25', label: '25% - Średnie (Standard)' },
    { val: '0.33', label: '33% - Standard Sraczkowości' },
    { val: '0.50', label: '50% - Wysokie (Street Food)' },
    { val: '0.75', label: '75% - Bardzo Wysokie (Surowe)' },
    { val: '0.95', label: '95% - Ruletka (Kranówka)' }
];

function toggleSpecialModule(modId) {
    const isChecked = document.getElementById(`mod${modId.charAt(0).toUpperCase() + modId.slice(1)}Active`)?.checked;
    const panel = document.getElementById(`panel-${modId}`);
    if (panel) {
        panel.style.display = isChecked ? 'block' : 'none';
    }
    updateActiveModulesCount();
    oblicz();
}

function updateActiveModulesCount() {
    const activeRadiusz = document.getElementById('modRadiuszActive')?.checked;
    const activeLives = document.getElementById('modLivesActive')?.checked;
    const activeHeat = document.getElementById('modHeatActive')?.checked;
    let count = 0;
    if (activeRadiusz) count++;
    if (activeLives) count++;
    if (activeHeat) count++;
    
    const countEl = document.getElementById('activeModulesCount');
    if (countEl) countEl.innerText = count;
}

function getRiskColor(riskVal) {
    const val = parseFloat(riskVal);
    if (val <= 0.05) return '#4B7B4E';
    if (val <= 0.25) return '#1A1611';
    if (val <= 0.33) return '#D9662B';
    return '#B33A2E';
}

function setMode(mode) {
    currentMode = mode;

    document.getElementById('btnSimple').classList.toggle('active', mode === 'simple');
    document.getElementById('btnAdvanced').classList.toggle('active', mode === 'advanced');

    document.getElementById('simpleInfo').style.display = mode === 'simple' ? 'block' : 'none';
    document.getElementById('daysList').style.display = mode === 'advanced' ? 'flex' : 'none';

    oblicz();
}

function renderDays() {
    const totalDays = parseInt(document.getElementById('totalDays').value) || 1;
    const daysList = document.getElementById('daysList');
    daysList.innerHTML = '';

    for (let d = 1; d <= totalDays; d++) {
        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';

        let tableRows = defaultMealTypes.map(m => {
            const optionsHtml = riskOptions.map(r =>
                `<option value="${r.val}" ${r.val === m.defaultRisk ? 'selected' : ''}>${r.label}</option>`
            ).join('');

            return `
                <tr id="row_d${d}_${m.id}">
                    <td style="width: 40px; text-align: center;">
                        <input type="checkbox" class="meal-active" id="act_d${d}_${m.id}" ${m.simpleActive ? 'checked' : ''} onchange="oblicz()">
                    </td>
                    <td>
                        <div class="underwear-cell">
                            <span id="icon_wrap_d${d}_${m.id}" style="color: ${getRiskColor(m.defaultRisk)}">
                                ${m.icon}
                            </span>
                            <div>
                                <div><strong>${m.name}</strong></div>
                                <div style="font-size: 0.7rem; color: var(--text-muted); font-weight: 500;">${m.styleName}</div>
                            </div>
                        </div>
                    </td>
                    <td style="width: 90px;">
                        <input type="number" id="time_d${d}_${m.id}" value="${m.defaultHour}" min="0" max="23" onchange="oblicz()">
                    </td>
                    <td style="width: 220px;">
                        <select id="risk_d${d}_${m.id}" onchange="updateIconColor('d${d}_${m.id}'); oblicz();">
                            ${optionsHtml}
                        </select>
                    </td>
                </tr>
            `;
        }).join('');

        dayCard.innerHTML = `
            <div class="day-header">
                <span>DZIEŃ ${d}</span>
                <span id="status_d${d}" style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted);"></span>
            </div>
            <div class="table-wrapper">
                <table class="meals-table">
                    <thead>
                        <tr>
                            <th style="width: 40px; text-align: center;">Jem?</th>
                            <th>Posiłek i Typ Majtek</th>
                            <th style="width: 90px;">Godzina</th>
                            <th style="width: 220px;">Poziom Ryzyka</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        `;
        daysList.appendChild(dayCard);
    }

    if (laundrySessions.length === 0) {
        addLaundrySession(Math.max(1, Math.ceil(totalDays / 2)), 2);
    } else {
        renderLaundrySessions();
    }

    oblicz();
}

function addLaundrySession(day = 1, count = 2) {
    const totalDays = parseInt(document.getElementById('totalDays').value) || 1;
    const validDay = Math.min(day, totalDays);
    laundrySessions.push({ id: Date.now() + Math.random(), day: validDay, count: count });
    renderLaundrySessions();
    oblicz();
}

function removeLaundrySession(id) {
    laundrySessions = laundrySessions.filter(s => s.id !== id);
    renderLaundrySessions();
    oblicz();
}

function updateLaundrySession(id, field, value) {
    const session = laundrySessions.find(s => s.id === id);
    if (session) {
        session[field] = parseInt(value) || 0;
        oblicz();
    }
}

function renderLaundrySessions() {
    const container = document.getElementById('laundrySessionsContainer');
    if (!container) return;

    const totalDays = parseInt(document.getElementById('totalDays').value) || 1;
    container.innerHTML = '';

    laundrySessions.forEach((session, index) => {
        let optionsHtml = '';
        for (let d = 1; d <= totalDays; d++) {
            optionsHtml += `<option value="${d}" ${d === session.day ? 'selected' : ''}>Dzień ${d}</option>`;
        }

        const sessionRow = document.createElement('div');
        sessionRow.className = 'laundry-session-row';
        sessionRow.innerHTML = `
            <div class="input-group" style="width: 120px;">
                <label>Pranie #${index + 1}:</label>
                <select onchange="updateLaundrySession(${session.id}, 'day', this.value)">
                    ${optionsHtml}
                </select>
            </div>
            <div class="input-group" style="width: 80px;">
                <label>Pary:</label>
                <input type="number" min="1" max="30" value="${session.count}" id="laundry_count_${session.id}" oninput="updateLaundrySession(${session.id}, 'count', this.value)">
            </div>
            <div class="laundry-available-info" id="laundry_info_${session.id}" style="font-size:0.8rem; color:var(--text-muted); flex: 1;">
                Dostępne: <strong>0</strong> par
            </div>
            <button type="button" class="remove-laundry-btn" onclick="removeLaundrySession(${session.id})">✕</button>
        `;
        container.appendChild(sessionRow);
    });
}

function updateIconColor(idKey) {
    const riskEl = document.getElementById(`risk_${idKey}`);
    if (!riskEl) return;
    const riskVal = riskEl.value;
    const iconWrap = document.getElementById(`icon_wrap_${idKey}`);
    if (iconWrap) {
        iconWrap.style.color = getRiskColor(riskVal);
    }
}

function getFiberAlcoholMultiplier() {
    const alcVal = parseFloat(document.getElementById('globalAlcohol')?.value || 0);
    const fiberVal = parseFloat(document.getElementById('globalFiber')?.value || 0);
    return 1 + alcVal + fiberVal;
}

function updateDeficitIndicator(totalPairs, basePairs, emergencyPairs) {
    const indicatorEl = document.getElementById('safetyIndicatorBar');
    const labelEl = document.getElementById('safetyIndicatorLabel');
    if (!indicatorEl || !labelEl) return;

    const minRequired = basePairs + emergencyPairs;
    const safetyRatio = totalPairs / (minRequired || 1);
    const percentage = Math.min(Math.round(safetyRatio * 100), 100);

    indicatorEl.style.width = `${percentage}%`;

    if (percentage >= 100) {
        indicatorEl.style.backgroundColor = '#4B7B4E';
        labelEl.innerText = `Poziom Bezpieczeństwa: ${percentage}% (Pancerny Zapas)`;
    } else if (percentage >= 70) {
        indicatorEl.style.backgroundColor = '#D9662B';
        labelEl.innerText = `Poziom Bezpieczeństwa: ${percentage}% (Uwaga na dokładki)`;
    } else {
        indicatorEl.style.backgroundColor = '#B33A2E';
        labelEl.innerText = `Poziom Bezpieczeństwa: ${percentage}% (Kroczysz po cienkim lodzie!)`;
    }
}

function generatePDF() {
    const totalPairs = document.getElementById('resTotal')?.innerText || '0';
    const basePairs = document.getElementById('resBase')?.innerText || '0';
    const emergencyPairs = document.getElementById('resEmergency')?.innerText || '0';
    const bufferPairs = document.getElementById('resBuffer')?.innerText || '0';

    const element = document.createElement('div');
    element.style.padding = '20px';
    element.style.fontFamily = 'sans-serif';
    element.innerHTML = `
        <h2 style="color: #1A1611;">📋 Taktyczna Lista Pakowania Bielizny</h2>
        <hr style="margin: 10px 0;">
        <p style="font-size: 1.2rem;"><strong>Suma do spakowania: ${totalPairs} par(y)</strong></p>
        <ul style="margin: 15px 0; padding-left: 20px;">
            <li>Bielizna Podstawowa (Rutynowa): <strong>${basePairs} par</strong></li>
            <li>Rezerwa Taktyczna (Sraczkowość): <strong>${emergencyPairs} par</strong></li>
            <li>Zapas Buforowy i Bezpieczeństwa: <strong>${bufferPairs} par</strong></li>
        </ul>
        <hr style="margin: 10px 0;">
        <h3>Ekwipunek Asekuracyjny:</h3>
        <p><input type="checkbox"> Rolka papieru toaletowego (Asekuracja)</p>
        <p><input type="checkbox"> Stoperan / Węgiel aktywny / Elektrolity</p>
        <p><input type="checkbox"> Mydło do prania w płynie / Proszek</p>
        <br>
        <p style="font-size: 0.8rem; color: #666;">Wygenerowano z Kalkulatora Sraczkowości</p>
    `;

    if (typeof html2pdf !== 'undefined') {
        html2pdf().from(element).save('lista_pakowania_bielizny.pdf');
    } else {
        alert("Błąd: Biblioteka html2pdf.js nie została załadowana!");
    }
}

function buildRiskFormula(riskList) {
    if (riskList.length === 0) return '0';

    const counts = {};
    riskList.forEach(r => {
        const key = r.toFixed(2);
        counts[key] = (counts[key] || 0) + 1;
    });

    return Object.keys(counts)
        .sort((a, b) => b - a)
        .map(key => `${counts[key]} × ${key}`)
        .join(' + ');
}

function oblicz() {
    const totalDays = parseInt(document.getElementById('totalDays').value) || 1;
    const startHour = parseInt(document.getElementById('startHour').value);
    const endHour = parseInt(document.getElementById('endHour').value);

    const globalMultiplier = getFiberAlcoholMultiplier();

    let totalExpectedFailures = 0;
    let totalActiveMeals = 0;
    let riskList = [];

    for (let d = 1; d <= totalDays; d++) {
        let activeMealsInDay = 0;

        defaultMealTypes.forEach(m => {
            let isActive = false;
            let mealTime = m.defaultHour;
            let mealRisk = parseFloat(m.defaultRisk);

            if (currentMode === 'simple') {
                isActive = m.simpleActive;
                mealTime = m.defaultHour;
                mealRisk = 0.33;
            } else {
                const checkbox = document.getElementById(`act_d${d}_${m.id}`);
                isActive = checkbox ? checkbox.checked : m.simpleActive;
                
                const timeEl = document.getElementById(`time_d${d}_${m.id}`);
                mealTime = timeEl ? parseInt(timeEl.value) : m.defaultHour;

                const riskEl = document.getElementById(`risk_d${d}_${m.id}`);
                mealRisk = riskEl ? parseFloat(riskEl.value) : parseFloat(m.defaultRisk);
            }

            let isValidTime = true;
            if (d === 1 && mealTime < startHour) isValidTime = false;
            if (d === totalDays && mealTime > endHour) isValidTime = false;

            const row = document.getElementById(`row_d${d}_${m.id}`);
            if (row) row.style.opacity = !isValidTime ? '0.3' : '1';

            if (isActive && isValidTime) {
                const finalMealRisk = Math.min(1.0, mealRisk * globalMultiplier);
                activeMealsInDay++;
                totalActiveMeals++;
                totalExpectedFailures += finalMealRisk;
                riskList.push(finalMealRisk);
            }
        });

        const statusEl = document.getElementById(`status_d${d}`);
        if (statusEl) statusEl.innerText = `Posiłki: ${activeMealsInDay}`;
    }

    // --- MODUŁY SPECJALNE ---
    const isRadiuszActive = document.getElementById('modRadiuszActive')?.checked || false;
    const isLivesActive = document.getElementById('modLivesActive')?.checked || false;
    const isHeatActive = document.getElementById('modHeatActive')?.checked || false;

    const livesPerPair = isLivesActive ? (parseInt(document.getElementById('underwearLives')?.value) || 1) : 1;
    const dailyLivesNeeded = isHeatActive ? 2 : 1;
    
    const baseLives = totalDays * dailyLivesNeeded;
    const emergencyLives = Math.ceil(totalExpectedFailures);
    const bufferLives = Math.ceil(totalDays / 2);
    const safetyLives = 3;

    const totalLivesNeeded = baseLives + bufferLives + emergencyLives + safetyLives;

    // --- PRZELICZENIE NA PARY ---
    const basePairs = Math.ceil(baseLives / livesPerPair);
    const bufferPairs = Math.ceil(bufferLives / livesPerPair);
    const emergencyPairs = Math.ceil(emergencyLives / livesPerPair);
    const safetyPairs = Math.ceil(safetyLives / livesPerPair);

    const rawTotal = Math.ceil(totalLivesNeeded / livesPerPair);

    // --- PRANIE (RADIUSZ) ---
    let totalWashedPairs = 0;
    let laundryWarningTriggered = false;

    if (isRadiuszActive) {
        const sortedSessions = [...laundrySessions].sort((a, b) => a.day - b.day);
        let alreadyWashedCumulative = 0;

        sortedSessions.forEach(session => {
            if (session.day > totalDays) return;

            let dirtyLivesSoFar = session.day * dailyLivesNeeded;
            let dirtyPairsAvailable = Math.floor(dirtyLivesSoFar / livesPerPair) + Math.floor(totalExpectedFailures * (session.day / totalDays));
            
            const maxAvailableToWash = Math.max(0, dirtyPairsAvailable - alreadyWashedCumulative);
            
            const infoEl = document.getElementById(`laundry_info_${session.id}`);
            if (infoEl) {
                infoEl.innerHTML = `Dostępne: <strong>${maxAvailableToWash}</strong> par`;
            }

            let effectiveWash = Math.min(session.count, maxAvailableToWash);

            if (session.count > maxAvailableToWash) {
                laundryWarningTriggered = true;
                session.count = maxAvailableToWash;
                const inputEl = document.getElementById(`laundry_count_${session.id}`);
                if (inputEl) inputEl.value = maxAvailableToWash;
            }

            alreadyWashedCumulative += effectiveWash;
            totalWashedPairs += effectiveWash;
        });
    }

    const total = isRadiuszActive ? Math.max(1, rawTotal - totalWashedPairs) : rawTotal;
    const appliedReduction = rawTotal - total;

    // --- RENDER WIDOKU ---
    const warningEl = document.getElementById('laundryWarning');
    if (warningEl) {
        if (isRadiuszActive && laundryWarningTriggered) {
            warningEl.style.display = 'block';
            warningEl.innerText = `⚠️ Propozycja prania została skorygowana do faktycznie dostępnej brudnej bielizny.`;
        } else {
            warningEl.style.display = 'none';
        }
    }

    document.getElementById('resTotal').innerText = total;
    document.getElementById('resBase').innerText = basePairs;
    document.getElementById('resBuffer').innerText = bufferPairs;
    document.getElementById('resEmergency').innerText = emergencyPairs;

    const livesLine = document.getElementById('resLivesLine');
    const livesValue = document.getElementById('resLives');
    if (livesLine && livesValue) {
        livesLine.style.display = isLivesActive ? 'inline' : 'none';
        livesValue.innerText = `${livesPerPair} Życia/Parę`;
    }

    const heatLine = document.getElementById('resHeatLine');
    const heatValue = document.getElementById('resHeat');
    if (heatLine && heatValue) {
        heatLine.style.display = isHeatActive ? 'inline' : 'none';
        heatValue.innerText = `+${Math.ceil(totalDays / livesPerPair)}`;
    }

    const laundryLine = document.getElementById('resLaundryLine');
    const laundryValue = document.getElementById('resLaundry');
    if (laundryLine && laundryValue) {
        laundryLine.style.display = isRadiuszActive ? 'inline' : 'none';
        laundryValue.innerText = `−${appliedReduction}`;
    }

    const emergencyCard = document.getElementById('emergencyFormulaCard');
    if (emergencyCard) {
        const riskFormula = buildRiskFormula(riskList);
        emergencyCard.innerHTML = `
            <span class="formula-title">📐 Wzór Rezerwy Awaryjnej</span>
            <span class="formula-line">ceil( Σ Posiłki<sub>ryzyko</sub> × Mnożnik Modyfikatorów )</span>
            Mnożnik diety/alkoholu: <strong>${globalMultiplier.toFixed(2)}x</strong><br>
            Aktywne posiłki: <strong>${totalActiveMeals}</strong><br>
            Suma oczekiwanych awarii: <strong>${riskFormula} = ${totalExpectedFailures.toFixed(2)}</strong><br>
            <span class="formula-line">Rezerwa: ${totalExpectedFailures.toFixed(2)} awarii → ${emergencyPairs} par(y)</span>
        `;
    }

    const totalCard = document.getElementById('totalFormulaCard');
    if (totalCard) {
        totalCard.innerHTML = `
            <span class="formula-title">📐 Podsumowanie Modelu Skalowanego</span>
            <span class="formula-line">Suma: ${totalLivesNeeded} żyć / ${livesPerPair} = ${rawTotal} par</span>
            Podstawa rutynowa: <strong>${basePairs} par</strong><br>
            Zapas buforowy: <strong>${bufferPairs} par</strong><br>
            Awarie (Sraczkowość): <strong>+${emergencyPairs} par</strong><br>
            ${isRadiuszActive ? `Pranie (Radiusz): <strong>−${appliedReduction} par</strong><br>` : ''}
            <span class="formula-line">Suma do spakowania: ${total} par(y)</span>
        `;
    }

    const mainSvgPath = document.querySelector('#mainUnderwearSvg path');
    if (mainSvgPath) {
        if (emergencyPairs >= 5) {
            mainSvgPath.setAttribute('fill', '#B33A2E');
        } else if (emergencyPairs >= 2) {
            mainSvgPath.setAttribute('fill', '#D9662B');
        } else {
            mainSvgPath.setAttribute('fill', '#F2C230');
        }
    }

    updateDeficitIndicator(total, basePairs, emergencyPairs);
}

renderDays();
setMode('simple');
drawQuote();
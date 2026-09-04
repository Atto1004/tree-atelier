/* =========================================================
   히어로 미니게임 — 물을 주면 소나무가 자라고, 다 크면 출하합니다.
   서비스의 핵심 서사(재배 → 출하 → 제값 받기)를 3초 안에 체험시키는 후킹 장치.
   ========================================================= */

const STAGES = [
  {
    name: '씨앗',
    msg: '할아버지가 심으신 소나무 씨앗입니다. 물을 주어 키워 보세요.',
    svg: `<svg viewBox="0 0 200 220" aria-hidden="true">
      <ellipse cx="100" cy="204" rx="26" ry="7" fill="#5C4227" opacity=".45"/>
      <ellipse cx="100" cy="198" rx="9" ry="12" fill="#8B6239" transform="rotate(-12 100 198)"/>
      <path d="M96 194c2-4 6-6 9-5" stroke="#6B4B2E" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>`,
  },
  {
    name: '새싹',
    msg: '싹이 텄습니다. 이 작은 싹이 20년 뒤 조경수가 됩니다.',
    svg: `<svg viewBox="0 0 200 220" aria-hidden="true">
      <ellipse cx="100" cy="204" rx="28" ry="7" fill="#5C4227" opacity=".45"/>
      <path d="M100 200v-26" stroke="#4E8C46" stroke-width="4" stroke-linecap="round"/>
      <path d="M100 182c-14-3-20-13-19-21 9-2 18 6 19 21z" fill="#63B056"/>
      <path d="M100 176c13-4 19-14 18-22-9-2-17 7-18 22z" fill="#7CC46B"/>
    </svg>`,
  },
  {
    name: '묘목',
    msg: '묘목이 되었습니다. 가지를 뻗기 시작했어요.',
    svg: `<svg viewBox="0 0 200 220" aria-hidden="true">
      <ellipse cx="100" cy="204" rx="34" ry="8" fill="#5C4227" opacity=".45"/>
      <rect x="96" y="150" width="8" height="52" rx="3" fill="#7A5533"/>
      <path d="M100 108l26 42H74z" fill="#3E8F5C"/>
      <path d="M100 126l31 38H69z" fill="#4EA36B"/>
    </svg>`,
  },
  {
    name: '어린나무',
    msg: '수고 2m를 넘겼습니다. 이제 시세가 잡히기 시작합니다.',
    svg: `<svg viewBox="0 0 200 220" aria-hidden="true">
      <ellipse cx="100" cy="204" rx="44" ry="9" fill="#5C4227" opacity=".45"/>
      <rect x="93" y="132" width="14" height="70" rx="5" fill="#7A5533"/>
      <path d="M100 62l30 50H70z" fill="#2F7D4E"/>
      <path d="M100 88l38 50H62z" fill="#3E8F5C"/>
      <path d="M100 116l46 50H54z" fill="#4EA36B"/>
    </svg>`,
  },
  {
    name: '성목',
    msg: '근원경 R15 성목이 되었습니다. 조경 시장에 나갈 수 있는 규격입니다.',
    svg: `<svg viewBox="0 0 200 220" aria-hidden="true">
      <ellipse cx="100" cy="204" rx="56" ry="11" fill="#5C4227" opacity=".45"/>
      <rect x="90" y="120" width="20" height="82" rx="7" fill="#7A5533"/>
      <path d="M100 16l34 52H66z" fill="#256C42"/>
      <path d="M100 46l44 54H56z" fill="#2F7D4E"/>
      <path d="M100 80l54 56H46z" fill="#3E8F5C"/>
      <path d="M100 114l62 54H38z" fill="#4EA36B"/>
    </svg>`,
  },
  {
    name: '출하 준비',
    msg: '굴취까지 끝났습니다. 이제 제값에 팔 차례입니다.',
    svg: `<svg viewBox="0 0 200 220" aria-hidden="true">
      <ellipse cx="100" cy="206" rx="56" ry="10" fill="#5C4227" opacity=".35"/>
      <path d="M100 16l34 52H66z" fill="#256C42"/>
      <path d="M100 46l44 54H56z" fill="#2F7D4E"/>
      <path d="M100 80l54 56H46z" fill="#3E8F5C"/>
      <path d="M100 114l62 54H38z" fill="#4EA36B"/>
      <rect x="90" y="120" width="20" height="46" rx="7" fill="#7A5533"/>
      <path d="M72 166h56l-11 34H83z" fill="#A08054"/>
      <path d="M74 176h52M78 188h44" stroke="#6B4B2E" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`,
  },
];

(function initGame() {
  const stage = document.getElementById('gameTree');
  if (!stage) return;

  const sky     = document.getElementById('gameSky');
  const nameEl  = document.getElementById('gameStageName');
  const barEl   = document.getElementById('gameBarFill');
  const msgEl   = document.getElementById('gameMsg');
  const waterBtn= document.getElementById('waterBtn');
  const liveEl  = document.getElementById('gameLive');
  const doneBox = document.getElementById('gameDone');

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const PER_STAGE = 2;          // 단계당 물주기 횟수
  let idx = 0, taps = 0;

  function paint(grew) {
    const s = STAGES[idx];
    stage.innerHTML = s.svg;
    if (grew && !reduce) {
      stage.classList.remove('grow-pop');
      void stage.offsetWidth;
      stage.classList.add('grow-pop');
    }
    nameEl.textContent = s.name;
    msgEl.textContent = s.msg;
    const total = (STAGES.length - 1) * PER_STAGE;
    const done = idx * PER_STAGE + taps;
    barEl.style.width = Math.min(100, (done / total) * 100) + '%';
    liveEl.textContent = `${s.name} 단계, 성장 ${Math.round(Math.min(100, done / total * 100))}퍼센트`;
  }

  function rain() {
    if (reduce) return;
    const box = sky.getBoundingClientRect();
    for (let i = 0; i < 7; i++) {
      const d = document.createElement('span');
      d.className = 'drop';
      d.style.left = (box.width * 0.5 + (Math.random() - 0.5) * box.width * 0.44) + 'px';
      d.style.top = (box.height * 0.12) + 'px';
      d.style.animationDelay = (i * 55) + 'ms';
      sky.appendChild(d);
      setTimeout(() => d.remove(), 1100 + i * 55);
    }
  }

  function sparkle(text) {
    if (reduce) return;
    const box = sky.getBoundingClientRect();
    const s = document.createElement('span');
    s.className = 'sparkle';
    s.textContent = text;
    s.style.left = (box.width * 0.5 - 12 + (Math.random() - 0.5) * 60) + 'px';
    s.style.top = (box.height * 0.42) + 'px';
    sky.appendChild(s);
    setTimeout(() => s.remove(), 1200);
  }

  function finish() {
    waterBtn.disabled = true;
    waterBtn.textContent = '다 자랐습니다';
    doneBox.hidden = false;
    sparkle('✦');
    doneBox.querySelector('a')?.focus({ preventScroll: true });
  }

  waterBtn.addEventListener('click', () => {
    rain();
    taps++;
    let grew = false;
    if (taps >= PER_STAGE && idx < STAGES.length - 1) {
      idx++; taps = 0; grew = true;
      sparkle('✦');
    }
    paint(grew);
    if (idx === STAGES.length - 1) finish();
  });

  document.getElementById('skipBtn')?.addEventListener('click', () => {
    idx = STAGES.length - 1; taps = 0;
    paint(true);
    finish();
  });

  paint(false);
})();

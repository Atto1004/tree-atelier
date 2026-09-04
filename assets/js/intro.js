/* =========================================================
   첫 방문 인트로
   광고(인스타그램 등)에서 유입된 사람이 처음 보는 화면.
   물주기 → 성장 → "재배하시겠습니까?" → 브랜드 카피 → 아래로 둘러보기.
   한 번 본 사람에게는 다시 보여주지 않습니다. (?intro 로 강제 재생)
   ========================================================= */
(function () {
  const intro = document.getElementById('intro');
  const html = document.documentElement;
  if (!intro || typeof STAGES === 'undefined') return;

  /* 표시 여부는 head 인라인 스크립트가 첫 페인트 전에 결정합니다 */
  if (!html.classList.contains('intro-on')) { intro.remove(); return; }

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $i = s => intro.querySelector(s);

  const treeEl   = $i('#introTree');
  const stageEl  = $i('#introStage');
  const barEl    = $i('#introBar');
  const msgEl    = $i('#introMsg');
  const btn      = $i('#introAction');
  const liveEl   = $i('#introLive');

  /* 인트로 전용 짧은 문구 — 광고 유입 기준 호흡 */
  const MSG = [
    '',
    '싹이 텄습니다. 물을 주면 자랍니다.',
    '묘목이 되었습니다. 계속 주세요.',
    '벌써 2m를 넘겼습니다. 조금만 더!',
    '성목이 되었습니다. 20년이 이렇게 지났습니다.',
    '수고하셨습니다. 이제 제값 받을 차례입니다.',
  ];

  const FIRST = 1;    // 새싹부터 시작
  const GROWN = 4;    // 성목
  const HARVEST = 5;  // 출하 준비 (분 뜬 모습)
  let idx = FIRST;
  let phase = 'grow'; // grow → ready → finale
  let busy = false;

  window.scrollTo(0, 0);

  function paint(pop) {
    treeEl.innerHTML = STAGES[idx].svg;
    if (pop && !reduce && phase !== 'finale') {
      treeEl.classList.remove('grow-pop');
      void treeEl.offsetWidth;
      treeEl.classList.add('grow-pop');
    }
    stageEl.textContent = STAGES[idx].name;
    barEl.style.width = Math.min(100, ((idx - FIRST) / (GROWN - FIRST)) * 100) + '%';
    msgEl.textContent = MSG[idx];
    liveEl.textContent = STAGES[idx].name + ' 단계';
  }

  /* 물주기 연출 — 물뿌리개가 나무 위로 와서 기울고, 주둥이에서 물방울이 떨어집니다 */
  const canEl = $i('#introCan');
  function rain() {
    if (reduce) return;
    const ir = intro.getBoundingClientRect();
    const tr = treeEl.getBoundingClientRect();

    /* 그려진 나무의 실제 윗선 (씨앗·새싹은 박스 아래쪽에만 그려져 있음) */
    let top = tr.top;
    try { const bb = treeEl.querySelector('svg').getBBox(); top = tr.top + bb.y / 220 * tr.height; } catch (e) {}

    const canW = canEl.getBoundingClientRect().width || 130;
    const tipX = tr.left + tr.width * 0.5 + 8;             // 주둥이 끝: 수관 바로 위
    const tipY = Math.max(ir.top + 150, top - 36);
    canEl.style.left = (tipX - ir.left - canW * 0.08) + 'px';
    canEl.style.top  = (tipY - ir.top - canW * 0.75 * 0.33) + 'px';
    canEl.classList.remove('is-pouring');
    void canEl.offsetWidth;
    canEl.classList.add('is-pouring');

    const fall = Math.max(70, tr.bottom - 16 - tipY);
    for (let i = 0; i < 9; i++) {
      const d = document.createElement('span');
      d.className = 'intro-drop';
      d.style.left = (tipX - ir.left - 5 + (Math.random() - 0.5) * 22) + 'px';
      d.style.top  = (tipY - ir.top + 2) + 'px';
      d.style.setProperty('--fall', fall + 'px');
      d.style.setProperty('--dx', (-14 + Math.random() * 10) + 'px');
      d.style.animationDelay = (230 + i * 65) + 'ms';
      intro.appendChild(d);
      setTimeout(() => d.remove(), 1050 + i * 65);
    }
  }

  function sparkle(n) {
    if (reduce) return;
    const ir = intro.getBoundingClientRect();
    const tr = treeEl.getBoundingClientRect();
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.className = 'sparkle';
      s.textContent = '✦';
      s.style.left = (tr.left - ir.left + Math.random() * tr.width) + 'px';
      s.style.top  = (tr.top - ir.top + Math.random() * tr.height * 0.7) + 'px';
      s.style.animationDelay = (i * 90) + 'ms';
      s.style.zIndex = 8;
      intro.appendChild(s);
      setTimeout(() => s.remove(), 1400 + i * 90);
    }
  }

  function markSeen() {
    try { localStorage.setItem('soopro:introSeen', '1'); } catch (e) {}
  }

  /* 물주기 / 재배 버튼 */
  btn.addEventListener('click', () => {
    if (busy) return;

    if (phase === 'grow') {
      busy = true;
      rain();
      setTimeout(() => {
        idx++;
        paint(true);
        sparkle(2);
        if (idx >= GROWN) {
          phase = 'ready';
          btn.textContent = '재배하시겠습니까?';
          btn.classList.add('is-harvest');
        }
        busy = false;
      }, reduce ? 0 : 820);
      return;
    }

    if (phase === 'ready') {
      phase = 'finale';
      busy = true;
      markSeen();

      idx = HARVEST;
      paint(false);
      intro.classList.add('is-finale');
      sparkle(8);
      $i('#introHud').hidden = true;
      $i('#introPanel').hidden = true;

      setTimeout(() => {
        const fin = $i('#introFinale');
        fin.hidden = false;
        requestAnimationFrame(() => fin.classList.add('is-in'));
        html.classList.remove('intro-lock');  // 이제 아래로 드래그 가능
        $i('#introBrowse').focus({ preventScroll: true });
      }, reduce ? 150 : 1150);
    }
  });

  /* 둘러보기 — 인트로를 걷어내고 홈 첫 화면으로 */
  function browse() {
    markSeen();
    html.classList.remove('intro-lock');
    intro.classList.add('is-leaving');
    setTimeout(() => {
      html.classList.remove('intro-on');
      intro.remove();
      window.scrollTo(0, 0);
    }, reduce ? 0 : 420);
  }
  /* 아래로 내려서 구경하기 — 인트로 아래 홈으로 스크롤 */
  function down() {
    html.classList.remove('intro-lock');
    const main = document.getElementById('main');
    if (main) main.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }
  $i('#introBrowse').addEventListener('click', browse);
  $i('#introDown').addEventListener('click', down);

  /* 건너뛰기 — 언제든 */
  function skip() {
    markSeen();
    html.classList.remove('intro-lock');
    html.classList.remove('intro-on');
    intro.remove();
    window.scrollTo(0, 0);
  }
  $i('#introSkip').addEventListener('click', skip);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && html.classList.contains('intro-lock')) skip();
  });

  paint(false);
})();

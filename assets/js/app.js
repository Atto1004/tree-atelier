/* =========================================================
   공통 스크립트 — 헤더/드로어/탭바/카드 렌더링
   file:// 로 열어도 동작하도록 fetch 없이 템플릿 문자열로 주입합니다.
   ========================================================= */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

/* 사용자가 입력한 문자열은 항상 이스케이프해서 붙입니다 */
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* ---------- 아이콘 ---------- */
const ICON = {
  tree: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L6.5 10h3L5 17h6v5h2v-5h6l-4.5-7h3z"/></svg>',
  search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  menu: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  heart: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1l8.8 8.8 8.8-8.8a5 5 0 0 0 0-7.1z"/></svg>',
  home: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5L12 3l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/></svg>',
  grid: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></svg>',
  chart: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16v-4M13 16V8M18 16v-6"/></svg>',
  chat: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 15a2 2 0 0 1-2 2H8l-4 3.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/></svg>',
  user: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.7"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg>',
  plus: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  check: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5.5 5.5L20 6.5"/></svg>',
  sun: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/></svg>',
  moon: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>',
  location: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  shield: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5.5c0 4.4-3 8.2-7 9.5-4-1.3-7-5.1-7-9.5V6z"/><path d="M9 12l2 2 4-4"/></svg>',
  arrow: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M12.5 6l6 6-6 6"/></svg>',
  ruler: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="8" width="20" height="8" rx="1.5"/><path d="M7 8v3M12 8v4M17 8v3"/></svg>',
};

/* ---------- 네비게이션 정의 ---------- */
const NAV = [
  { href: 'listings.html',  label: '나무 찾기',   icon: 'grid'  },
  { href: 'market.html',    label: '실거래 시세', icon: 'chart' },
  { href: 'guide.html',     label: '규격 안내',   icon: 'ruler' },
  { href: 'movers.html',    label: '굴취·운반',   icon: 'tree'  },
  { href: 'community.html', label: '커뮤니티',    icon: 'chat'  },
];

const TABBAR = [
  { href: 'index.html',     label: '홈',     icon: 'home'  },
  { href: 'listings.html',  label: '나무',   icon: 'grid'  },
  { href: 'inquiry.html',   label: '문의',   icon: 'chat'  },
  { href: 'sell.html',      label: '등록',   icon: 'plus'  },
  { href: 'market.html',    label: '시세',   icon: 'chart' },
  { href: 'mypage.html',    label: '내정보', icon: 'user'  },
];

const page = () => (location.pathname.split('/').pop() || 'index.html');

/* ---------- 헤더 ---------- */
function renderChrome() {
  const cur = page();
  const isCur = h => (h === cur ? ' aria-current="page"' : '');

  const header = `
<a class="skip-link" href="#main">본문 바로가기</a>
<header class="header">
  <div class="wrap header-in">
    <a class="logo" href="index.html" aria-label="Tree Atelier 홈">
      <span class="logo-mark" aria-hidden="true">${ICON.tree}</span>
      <span>Tree Atelier</span>
    </a>
    <nav class="nav" aria-label="주요 메뉴">
      ${NAV.map(n => `<a href="${n.href}"${isCur(n.href)}>${n.label}</a>`).join('')}
    </nav>
    <div class="header-actions">
      <form class="header-search hide-sm" role="search" id="hsearchForm">
        <label class="sr-only" for="hsearch">수종·규격·수량으로 검색</label>
        <div class="input-group">
          <span class="ig-icon" aria-hidden="true">${ICON.search}</span>
          <input class="input" id="hsearch" type="search" placeholder="예: 소나무 R20 30주">
        </div>
      </form>
      <a class="btn btn-secondary btn-sm hide-sm" href="login.html">로그인</a>
      <a class="btn btn-secondary btn-sm hide-sm" href="inquiry.html"${isCur('inquiry.html')}>${ICON.chat}<span>구매 문의</span></a>
      <a class="btn btn-primary btn-sm" href="sell.html">${ICON.plus}<span>농원 등록</span></a>
      <button class="btn btn-ghost btn-icon hamburger" id="menuBtn" aria-label="메뉴 열기" aria-expanded="false">${ICON.menu}</button>
    </div>
  </div>
</header>

<div class="drawer-back" id="drawerBack" hidden></div>
<aside class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="전체 메뉴" hidden>
  <div class="drawer-head">
    <span class="strong">전체 메뉴</span>
    <button class="btn btn-ghost btn-icon" id="drawerClose" aria-label="메뉴 닫기">${ICON.close}</button>
  </div>
  <nav class="drawer-nav" aria-label="전체 메뉴">
    <a href="index.html"${isCur('index.html')}>홈</a>
    ${NAV.map(n => `<a href="${n.href}"${isCur(n.href)}>${n.label}</a>`).join('')}
    <a href="inquiry.html"${isCur('inquiry.html')}>구매 문의</a>
    <a href="sell.html"${isCur('sell.html')}>농원 등록</a>
    <a href="mypage.html"${isCur('mypage.html')}>마이페이지</a>
    <div class="divider mt3 mb3"></div>
    <a href="login.html"${isCur('login.html')}>로그인 · 회원가입</a>
  </nav>
</aside>`;

  const tabbar = `
<nav class="tabbar" aria-label="빠른 이동">
  ${TABBAR.map(t => `<a href="${t.href}"${isCur(t.href)}>${ICON[t.icon]}<span>${t.label}</span></a>`).join('')}
</nav>`;

  const footer = `
<footer class="footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <a class="logo mb3" href="index.html">
          <span class="logo-mark" aria-hidden="true">${ICON.tree}</span><span>Tree Atelier</span>
        </a>
        <p class="small muted" style="max-width:34ch">
          나무를 키운 사람이 제값을 받는 거래.<br>
          재배자와 구매자를 직접 잇고, 모든 실거래가를 공개합니다.
        </p>
        <p class="tiny muted mt4">
          가상의 서비스 프로토타입입니다. 게시된 시세·매물·업체 정보는 실제 데이터가 아닙니다.
        </p>
      </div>
      <div>
        <h4>거래</h4>
        <ul>
          <li><a href="farm.html">농장 소개 · 지도</a></li>
          <li><a href="listings.html">나무 찾기</a></li>
          <li><a href="inquiry.html">구매 문의</a></li>
          <li><a href="sell.html">농원 등록</a></li>
          <li><a href="market.html">실거래 시세</a></li>
          <li><a href="guide.html">나무 규격 안내</a></li>
          <li><a href="movers.html">굴취·운반 견적</a></li>
        </ul>
      </div>
      <div>
        <h4>커뮤니티</h4>
        <ul>
          <li><a href="community.html">재배 노하우</a></li>
          <li><a href="community.html">거래 후기</a></li>
          <li><a href="community.html">질문답변</a></li>
          <li><a href="community.html">정책·지원 소식</a></li>
        </ul>
      </div>
      <div>
        <h4>고객지원</h4>
        <ul>
          <li><a href="#">이용안내</a></li>
          <li><a href="#">수수료 정책</a></li>
          <li><a href="#">분쟁 조정</a></li>
          <li><a href="#">1:1 문의</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Tree Atelier · 프로토타입</span>
      <span>거래 수수료 3% · 판매자 정산 D+2</span>
    </div>
  </div>
</footer>`;

  const hSlot = $('#site-header');
  const fSlot = $('#site-footer');
  if (hSlot) hSlot.outerHTML = header;
  if (fSlot) fSlot.outerHTML = footer + tabbar;

  bindChrome();
}

/* ---------- 드로어 / 테마 ---------- */
function bindChrome() {
  const drawer = $('#drawer'), back = $('#drawerBack'), btn = $('#menuBtn');
  let lastFocus = null;

  function open() {
    lastFocus = document.activeElement;
    drawer.hidden = false; back.hidden = false;
    requestAnimationFrame(() => { drawer.classList.add('is-open'); back.classList.add('is-open'); });
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    $('#drawerClose').focus();
  }
  function close() {
    drawer.classList.remove('is-open'); back.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(() => { drawer.hidden = true; back.hidden = true; }, 260);
    if (lastFocus) lastFocus.focus();
  }
  /* 헤더 검색 — 수종·규격·수량 문장을 목록 검색 조건으로 바꿉니다 (예: "소나무 R20 30주") */
  $('#hsearchForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const v = $('#hsearch').value.trim();
    if (!v) return;
    location.href = 'listings.html?' + specQuery(v).toString();
  });

  btn?.addEventListener('click', open);
  $('#drawerClose')?.addEventListener('click', close);
  back?.addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer && !drawer.hidden) close();
  });

}

/* ---------- 자연어 검색 → 목록 조건 ----------
   "소나무 R20 30주", "반송 20-28", "느티 R15이상 10그루" 같은 입력을 species/rmin/rmax/qty 로 풉니다. */
function specQuery(text) {
  const p = new URLSearchParams();
  let t = String(text || '').trim();
  const sp = SPECIES.find(s => t.includes(s.name) || (s.name.length > 2 && t.includes(s.name.slice(0, 2))));
  if (sp) { p.set('species', sp.id); t = t.replace(sp.name, ' '); }
  else if (/적송|육송/.test(t)) p.set('species', 'sonamu');
  const qty = t.match(/(\d+)\s*(주|그루|본)/);
  if (qty) { p.set('qty', qty[1]); t = t.replace(qty[0], ' '); }
  const range = t.match(/R?\s*(\d+)\s*[-~–]\s*R?\s*(\d+)/i);
  if (range) { p.set('rmin', range[1]); p.set('rmax', range[2]); }
  else {
    const one = t.match(/R\s*(\d+)/i) || t.match(/(\d+)\s*(cm|센치|이상|짜리)/) || t.match(/(\d{2})/);
    if (one) p.set('rmin', one[1]);
  }
  if (!p.toString()) p.set('q', text.trim());
  return p;
}

/* ---------- 매물 썸네일 (사진 대신 결정적 SVG 플레이스홀더) ---------- */
function thumbSVG(l) {
  const h = l.hue;
  const trunk = `hsl(28 32% ${l.dug ? 34 : 30}%)`;
  const c1 = `hsl(${h} 42% 46%)`, c2 = `hsl(${h} 38% 32%)`, c3 = `hsl(${h} 46% 58%)`;
  const sky1 = `hsl(${(h + 60) % 360} 44% 88%)`, sky2 = `hsl(${h} 34% 80%)`;
  const id = 'g' + l.id.replace(/\W/g, '');
  return `<svg class="ph" viewBox="0 0 400 300" role="img" aria-label="${speciesName(l.species)} 이미지">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${sky1}"/><stop offset="1" stop-color="${sky2}"/></linearGradient></defs>
    <rect width="400" height="300" fill="url(#${id})"/>
    <ellipse cx="200" cy="300" rx="230" ry="72" fill="${c2}" opacity=".35"/>
    <rect x="192" y="150" width="17" height="112" rx="5" fill="${trunk}"/>
    <ellipse cx="200" cy="132" rx="86" ry="66" fill="${c2}"/>
    <ellipse cx="163" cy="146" rx="58" ry="45" fill="${c1}"/>
    <ellipse cx="238" cy="142" rx="54" ry="42" fill="${c1}"/>
    <ellipse cx="200" cy="106" rx="52" ry="40" fill="${c3}"/>
    <ellipse cx="200" cy="264" rx="62" ry="13" fill="${c2}" opacity=".45"/>
  </svg>`;
}

/* 등록된 사진이 있으면 사진, 없으면 플레이스홀더 */
/* 사진이 없는 매물은 법원리농원 현장 사진을 대표 이미지로 씁니다 (침엽수 로트) */
const FARM_THUMBS = [
  'assets/img/farm/farm-view-01.jpg', 'assets/img/farm/farm-view-02.jpg', 'assets/img/farm/farm-view-03.jpg',
  'assets/img/farm/farm-view-04.jpg', 'assets/img/farm/farm-view-05.jpg', 'assets/img/farm/farm-view-06.jpg',
  'assets/img/farm/tree-unassigned-01.jpg', 'assets/img/farm/tree-unassigned-02.jpg',
];
function farmThumbOf(l) {
  if (!/^(sonamu|bansong|geumgang)$/.test(l.species)) return null;
  let h = 0; for (const ch of String(l.id)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return FARM_THUMBS[h % FARM_THUMBS.length];
}
function thumbOf(l) {
  const p = (l.photoData && l.photoData[0]) || farmThumbOf(l);
  return p ? `<img class="ph" src="${p}" alt="" loading="lazy">` : thumbSVG(l);
}

/* ---------- 매물 카드 ----------
   가격(호가)은 화면에 노출하지 않습니다. 규격·개체코드 중심으로 보여주고,
   가격은 문의를 통해서만 오갑니다. 시세(시장 데이터)는 별도로 공개합니다. */
function listingCard(l) {
  const sold = l.status === '거래완료';
  const faved = typeof Store !== 'undefined' && Store.Favs.has(l.id);
  const noteStr = l.notation || specNotation(l.species, l.spec) || specLine(l);
  return `
<article class="card card-link listing">
  <div class="listing-thumb">
    ${thumbOf(l)}
    <div class="badges">
      ${l.mine ? '<span class="badge badge-info">내 매물</span>' : ''}
      ${l.verified ? `<span class="badge badge-green">${ICON.shield} 인증농가</span>` : ''}
      ${l.dug ? '<span class="badge badge-wood">굴취완료</span>' : ''}
      ${sold ? '<span class="badge badge-gray">거래완료</span>' : ''}
      ${l.status === '협의중' ? '<span class="badge badge-warn">협의중</span>' : ''}
    </div>
    <button class="listing-fav" type="button" aria-pressed="${faved}" data-fav="${esc(l.id)}"
            aria-label="${esc(l.title)} 관심 매물로 저장">${ICON.heart}</button>
  </div>
  <div class="listing-body">
    <div class="row g2 wrapf">
      <span class="badge badge-gray">${speciesName(l.species)}</span>
      <span class="tree-code">${(SPECIES_CODE[l.species] || 'ET')}${l.id.slice(-4)}</span>
    </div>
    <h3 class="listing-title"><a href="detail.html?id=${encodeURIComponent(l.id)}">${esc(l.title)}</a></h3>
    <div class="listing-spec">
      <b class="num">${noteStr}</b>
      <span>${ICON.location} ${esc(l.region)}</span>
      <span>${won(l.qty)}주</span>
    </div>
    <div class="listing-price">
      <span class="price-ask">가격 문의</span>
      <span class="tiny muted">문의 시 시세 자료와 함께 안내</span>
    </div>
    <div class="listing-meta">
      <span>${esc(l.grower)}</span><span aria-hidden="true">·</span>
      <span>조회 ${won(l.views)}</span>
    </div>
  </div>
</article>`;
}

/* 관심 버튼 토글 (이벤트 위임) — 저장소에 남습니다 */
document.addEventListener('click', e => {
  const fav = e.target.closest('.listing-fav');
  if (!fav) return;
  e.preventDefault();
  const id = fav.dataset.fav;
  const on = id && typeof Store !== 'undefined'
    ? Store.Favs.toggle(id)
    : fav.getAttribute('aria-pressed') !== 'true';
  fav.setAttribute('aria-pressed', String(on));
});

/* ---------- 토스트 ---------- */
function toast(msg, kind) {
  let box = document.getElementById('toastBox');
  if (!box) {
    box = document.createElement('div');
    box.id = 'toastBox';
    box.className = 'toast-box';
    box.setAttribute('role', 'status');
    box.setAttribute('aria-live', 'polite');
    document.body.appendChild(box);
  }
  const t = document.createElement('div');
  t.className = 'toast' + (kind ? ' toast-' + kind : '');
  t.textContent = msg;
  box.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(6px)';
    setTimeout(() => t.remove(), 260);
  }, 2600);
}

/* 폼 필드 오류 표시 */
function setError(input, msg) {
  const field = input.closest('.field') || input.parentElement;
  let el = field.querySelector('.err');
  if (msg) {
    input.setAttribute('aria-invalid', 'true');
    if (!el) {
      el = document.createElement('p');
      el.className = 'err';
      field.appendChild(el);
    }
    el.textContent = msg;
  } else {
    input.removeAttribute('aria-invalid');
    if (el) el.remove();
  }
}

/* =========================================================
   최근 실거래 배너
   "이 규격의 소나무가 얼마에 팔렸다"를 한 줄로 보여줍니다.
   ========================================================= */
function dealLine(d) {
  const v = dealVsIndex(d);
  return `
  <div class="deal">
    <span class="deal-species">${speciesName(d.species)}</span>
    <span class="deal-spec num">${specNotation(d.species, d.spec)}</span>
    <span class="deal-sep" aria-hidden="true">·</span>
    <span class="deal-meta">${d.region} · ${won(d.qty)}주</span>
    <span class="deal-arrow" aria-hidden="true">→</span>
    <span class="deal-price num">주당 ${won(d.unitPrice)}원</span>
    ${v ? `<span class="deal-tag deal-${v.key}">${v.text}</span>` : ''}
    <span class="deal-when">${daysAgo(d.date)} 거래</span>
  </div>`;
}

/* el 안에 회전 배너를 만듭니다. deals 는 최신순 배열 */
function dealTicker(el, deals, opts) {
  if (!el || !deals || !deals.length) return;
  const o = opts || {};
  const rows = deals.slice(0, o.max || 8);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let i = 0, timer = null, paused = false;

  el.innerHTML = `
    <div class="ticker${o.soft ? ' ticker-soft' : ''}">
      <div class="${o.soft ? '' : 'wrap '}ticker-in">
        <span class="ticker-label">
          <span class="ticker-dot" aria-hidden="true"></span>
          최근 실거래
        </span>
        <div class="ticker-view" id="tv"></div>
        <div class="ticker-ctrl">
          <button type="button" class="ticker-btn" data-step="-1" aria-label="이전 거래">‹</button>
          <button type="button" class="ticker-btn" data-toggle aria-label="자동 넘김 일시정지" aria-pressed="false">॥</button>
          <button type="button" class="ticker-btn" data-step="1" aria-label="다음 거래">›</button>
        </div>
      </div>
    </div>`;

  const view = el.querySelector('#tv');
  const toggle = el.querySelector('[data-toggle]');

  function paint() {
    view.innerHTML = dealLine(rows[i]);
    view.firstElementChild.classList.add('deal-in');
  }
  function step(n) {
    i = (i + n + rows.length) % rows.length;
    paint();
  }
  function start() {
    if (reduce || paused || rows.length < 2) return;
    stop();
    timer = setInterval(() => step(1), o.interval || 4200);
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  el.addEventListener('click', e => {
    const s = e.target.closest('[data-step]');
    if (s) { step(Number(s.dataset.step)); start(); return; }
    if (e.target.closest('[data-toggle]')) {
      paused = !paused;
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.setAttribute('aria-label', paused ? '자동 넘김 다시 시작' : '자동 넘김 일시정지');
      toggle.textContent = paused ? '▶' : '॥';
      paused ? stop() : start();
    }
  });

  /* 마우스를 올리거나 키보드 포커스가 들어오면 멈춥니다 */
  el.addEventListener('mouseenter', stop);
  el.addEventListener('mouseleave', () => { if (!paused) start(); });
  el.addEventListener('focusin', stop);
  el.addEventListener('focusout', () => { if (!paused) start(); });
  document.addEventListener('visibilitychange', () => {
    document.hidden ? stop() : (!paused && start());
  });

  paint();
  start();
}

/* 목록형 — 배너 대신 여러 건을 한 번에 보여줄 때 */
function dealList(deals, emptyMsg) {
  if (!deals || !deals.length) {
    return `<p class="small muted">${emptyMsg || '조건에 맞는 최근 거래가 없습니다.'}</p>`;
  }
  return `<ul class="deal-list">${deals.map(d => {
    const v = dealVsIndex(d);
    return `<li>
      <div class="row between wrapf g2">
        <span class="strong num">${specNotation(d.species, d.spec)}</span>
        <span class="strong num">${won(d.unitPrice)}원</span>
      </div>
      <div class="row between wrapf g2 mt1">
        <span class="tiny muted">${d.region} · ${won(d.qty)}주 · ${daysAgo(d.date)}</span>
        ${v ? `<span class="deal-tag deal-${v.key}">${v.text}</span>` : ''}
      </div>
    </li>`;
  }).join('')}</ul>`;
}

/* ---------- 시세 막대 차트 ---------- */
function barsHTML(history, months) {
  const max = Math.max(...history) * 1.12;
  return `<div class="bars" role="img" aria-label="최근 6개월 시세 추이">
    ${history.map((v, i) => `
      <div class="bar-col${i === history.length - 1 ? ' is-now' : ''}">
        <span class="bar-val num">${wonShort(v)}</span>
        <div class="bar" style="height:${(v / max * 100).toFixed(1)}%"></div>
        <span class="bar-lab">${months[i]}</span>
      </div>`).join('')}
  </div>`;
}

document.addEventListener('DOMContentLoaded', renderChrome);


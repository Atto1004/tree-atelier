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
      <form class="header-search" role="search" id="hsearchForm">
        <label class="sr-only" for="hsearch">수종·규격·수량으로 검색</label>
        <div class="input-group">
          <span class="ig-icon" aria-hidden="true">${ICON.search}</span>
          <input class="input" id="hsearch" type="search" placeholder="수종·규격으로 찾기" autocomplete="off">
        </div>
      </form>
      <button class="btn btn-ghost btn-icon search-btn" id="searchBtn" type="button" aria-label="나무 검색" aria-expanded="false">${ICON.search}</button>
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
  /* 헤더 검색 — 검색창을 누르면 조건 패널이 열리고, 문장 입력("소나무 R20 30주")도 조건으로 풉니다 */
  const sForm = $('#hsearchForm'), sInput = $('#hsearch');
  if (sForm && sInput) {
    const sp = buildSearchPanel(sForm, sInput);
    sForm.addEventListener('submit', e => {
      e.preventDefault();
      const p = sp.params();
      location.href = 'listings.html' + (p.toString() ? '?' + p.toString() : '');
    });
    $('#searchBtn')?.addEventListener('click', e => {
      e.stopPropagation();
      if (sp.isOpen()) { sp.close(); return; }
      sp.open();
      $('#searchBtn').setAttribute('aria-expanded', 'true');
      setTimeout(() => $('#spQ')?.focus(), 30);
    });
  }

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


/* ---------- 수형 실루엣 아이콘 ---------- */
const SHAPE_ICONS = {
  natural:  '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M24 44V26"/><path d="M24 26l-6-6M24 22l7-6"/><path d="M10 20c-2-8 5-14 12-13 4-4 12-3 14 3 5 2 6 9 2 12 1 5-4 9-9 7-3 3-9 3-12-1-4 1-8-3-7-8z"/></svg>',
  sculpt:   '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M24 44V30"/><path d="M24 30v-6M24 24v-9"/><ellipse cx="17" cy="27" rx="9" ry="3.5"/><ellipse cx="30" cy="20" rx="9" ry="3.5"/><ellipse cx="20" cy="12" rx="7" ry="3"/></svg>',
  straight: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M24 44V28"/><ellipse cx="24" cy="17" rx="9" ry="13"/></svg>',
  curved:   '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M22 44c0-6 6-8 6-14s-8-8-6-14"/><path d="M13 14c-2-7 6-11 11-8 6-3 13 1 12 8 4 3 2 9-3 9-2 4-9 5-12 1-5 1-9-3-8-10z"/></svg>',
  multi:    '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M24 44V32M24 38l-8-9M24 38l8-9"/><path d="M8 20c-2-8 6-13 12-10 3-5 11-5 14 0 6-3 14 2 12 10 2 6-4 10-9 8-3 3-9 3-12 0-5 2-11-2-9-8-5 1-10-3-8-8z"/></svg>',
  round:    '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M24 44v-8"/><circle cx="24" cy="21" r="15"/></svg>',
  umbrella: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M24 44V22"/><path d="M24 22l-7-5M24 22l7-5"/><path d="M4 20c4-9 12-13 20-13s16 4 20 13c-6 2-13 3-20 3S10 22 4 20z"/></svg>',
  cone:     '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M24 44v-6"/><path d="M24 4L10 38h28z"/><path d="M24 12l-8 18M24 12l8 18"/></svg>',
};
function shapeIcon(id) { return `<span class="shape-ic" aria-hidden="true">${SHAPE_ICONS[id] || SHAPE_ICONS.natural}</span>`; }
function listingShape(l) {
  if (l.shape) return l.shape;
  if ((l.tags || []).includes('다간형')) return 'multi';
  return null;
}

/* 사이트에 매물이 있는 수종만 — 검색 패널·필터의 수종 목록 */
function speciesWithStock() {
  const count = {};
  for (const l of Store.Listings.all()) count[l.species] = (count[l.species] || 0) + (l.qty || 0);
  return SPECIES.filter(s => count[s.id]).map(s => ({ ...s, qty: count[s.id] }));
}

/* ---------- 공통 매물 조건 판정 ----------
   crit: { species:Set, shapes:Set, rmin, rmax, hmin, hmax, qty, tags:Set, region, q, verified, dug } */
function matchListing(l, c) {
  if (c.species && c.species.size && !c.species.has(l.species)) return false;
  if (c.shapes && c.shapes.size) { const sh = listingShape(l); if (!sh || !c.shapes.has(sh)) return false; }
  if (c.region && l.region !== c.region) return false;
  const R = l.spec && l.spec.R, H = l.spec && l.spec.H;
  if (c.rmin != null && (!R || R < c.rmin)) return false;
  if (c.rmax != null && (!R || R > c.rmax)) return false;
  if (c.hmin != null && (!H || H < c.hmin)) return false;
  if (c.hmax != null && (!H || H > c.hmax)) return false;
  if (c.qty != null && l.qty < c.qty) return false;
  if (c.verified && !l.verified) return false;
  if (c.dug && !l.dug) return false;
  if (c.tags && c.tags.size) for (const t of c.tags) if (!(l.tags || []).includes(t)) return false;
  const needle = (c.q || '').trim().toLowerCase();
  if (needle) {
    const hay = (l.title + ' ' + (l.desc || '') + ' ' + l.region + ' ' + speciesName(l.species)).toLowerCase();
    if (!hay.includes(needle)) return false;
  }
  return true;
}

/* ---------- 구간 슬라이더 (최소·최대 두 손잡이) ----------
   rangeSlider(el, { min, max, step, lo, hi, unit, label, fmt, plus, onChange })
   손잡이가 양 끝에 있으면 그 쪽은 조건 없음(null)으로 봅니다. */
function rangeSlider(el, o) {
  const min = o.min, max = o.max, step = o.step || 1;
  const fmt = o.fmt || (v => String(v));
  let lo = o.lo != null ? o.lo : min, hi = o.hi != null ? o.hi : max;
  el.classList.add('rslider');
  el.innerHTML = `
    <div class="rs-head"><span class="rs-label">${o.label || ''}</span><span class="rs-val" aria-live="polite"></span></div>
    <div class="rs-track">
      <div class="rs-fill"></div>
      <input type="range" class="rs-a" min="${min}" max="${max}" step="${step}" value="${lo}" aria-label="${o.label || ''} 최소">
      <input type="range" class="rs-b" min="${min}" max="${max}" step="${step}" value="${hi}" aria-label="${o.label || ''} 최대">
    </div>
    <div class="rs-ends"><span>${fmt(min)}</span><span>${fmt(max)}${o.plus ? '+' : ''}</span></div>`;
  const a = el.querySelector('.rs-a'), b = el.querySelector('.rs-b'), fill = el.querySelector('.rs-fill'), val = el.querySelector('.rs-val');
  const pct = v => ((v - min) / (max - min)) * 100;
  function paint() {
    fill.style.left = pct(lo) + '%'; fill.style.right = (100 - pct(hi)) + '%';
    const u = o.unit || '';
    if (lo <= min && hi >= max) val.textContent = '전체';
    else if (lo <= min) val.textContent = `${fmt(hi)}${u} 이하`;
    else if (hi >= max) val.textContent = `${fmt(lo)}${u} 이상`;
    else val.textContent = `${fmt(lo)} – ${fmt(hi)}${u}`;
    /* 두 손잡이가 왼쪽 끝에서 겹치면 위쪽 손잡이를 앞으로 */
    b.style.zIndex = (hi - min) < (max - min) * 0.05 ? 5 : 3;
  }
  function get() { return { lo: lo <= min ? null : lo, hi: hi >= max ? null : hi }; }
  function emit() { paint(); if (o.onChange) o.onChange(get()); }
  a.addEventListener('input', () => { lo = Math.min(Number(a.value), hi); a.value = lo; emit(); });
  b.addEventListener('input', () => { hi = Math.max(Number(b.value), lo); b.value = hi; emit(); });
  function set(nlo, nhi, silent) {
    lo = nlo == null ? min : Math.max(min, Math.min(max, nlo));
    hi = nhi == null ? max : Math.max(min, Math.min(max, nhi));
    if (lo > hi) [lo, hi] = [hi, lo];
    a.value = lo; b.value = hi;
    silent ? paint() : emit();
  }
  paint();
  return { get, set, reset: silent => set(null, null, silent) };
}

/* ---------- 헤더 검색 패널 ----------
   검색창을 누르면 열립니다. 보유 수종 다중 선택 → 수종별 수형 선택 → 규격 구간 슬라이더 → 결과 보기. */
function buildSearchPanel(form, input) {
  const panel = document.createElement('div');
  panel.className = 'search-panel'; panel.id = 'searchPanel'; panel.hidden = true;
  panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', '조건으로 나무 찾기');
  panel.innerHTML = `
    <div class="sp-mobile-q">
      <div class="input-group"><span class="ig-icon" aria-hidden="true">${ICON.search}</span>
        <input class="input" id="spQ" type="search" placeholder="예: 소나무 R20 30주" autocomplete="off"></div>
      <button class="btn btn-ghost btn-icon" type="button" id="spClose" aria-label="닫기">${ICON.close}</button>
    </div>
    <section class="sp-sec">
      <div class="sp-head"><h3>수종</h3><span class="sp-sub">여러 개 고를 수 있습니다</span></div>
      <div class="sp-species" id="spSpecies"></div>
    </section>
    <section class="sp-sec" id="spShapeSec" hidden>
      <div class="sp-head"><h3>수형</h3><span class="sp-sub" id="spShapeSub"></span></div>
      <div class="sp-shapes" id="spShapes"></div>
    </section>
    <section class="sp-sec">
      <div class="sp-head"><h3>규격</h3><span class="sp-sub">손잡이를 끌어 범위를 정합니다</span></div>
      <div class="sp-sliders"><div id="spR"></div><div id="spH"></div></div>
    </section>
    <div class="sp-foot">
      <button class="btn btn-ghost btn-sm" type="button" id="spReset">초기화</button>
      <span class="sp-count" id="spCount"></span>
      <button class="btn btn-primary" type="submit" id="spGo">나무 보기</button>
    </div>`;
  form.appendChild(panel);

  const crit = { species: new Set(), shapes: new Set(), rmin: null, rmax: null, hmin: null, hmax: null };
  const sR = rangeSlider(panel.querySelector('#spR'), { min: 5, max: 40, step: 1, label: '근원직경 R', unit: 'cm', plus: true,
    onChange: v => { crit.rmin = v.lo; crit.rmax = v.hi; update(); } });
  const sH = rangeSlider(panel.querySelector('#spH'), { min: 1, max: 10, step: 0.5, label: '수고 H', unit: 'm', plus: true,
    fmt: v => Number(v).toFixed(1).replace(/\.0$/, ''),
    onChange: v => { crit.hmin = v.lo; crit.hmax = v.hi; update(); } });

  function renderSpecies() {
    const all = Store.Listings.all();
    panel.querySelector('#spSpecies').innerHTML = speciesWithStock().map(s => {
      const n = all.filter(l => l.species === s.id).length;
      return `<button class="sp-chip" type="button" data-sp="${s.id}" aria-pressed="${crit.species.has(s.id)}">
        <b>${s.name}</b><span>${n}건 · ${s.qty.toLocaleString()}주</span></button>`;
    }).join('');
  }
  function renderShapes() {
    const sec = panel.querySelector('#spShapeSec');
    if (!crit.species.size) { sec.hidden = true; crit.shapes.clear(); return; }
    const list = shapesFor(crit.species);
    for (const id of [...crit.shapes]) if (!list.some(s => s.id === id)) crit.shapes.delete(id);
    sec.hidden = false;
    panel.querySelector('#spShapeSub').textContent = [...crit.species].map(speciesName).join(' · ') + '에서 고를 수 있는 형태';
    panel.querySelector('#spShapes').innerHTML = list.map(sh =>
      `<button class="sp-shape" type="button" data-shape="${sh.id}" aria-pressed="${crit.shapes.has(sh.id)}">
        ${shapeIcon(sh.id)}<b>${sh.name}</b><span>${sh.desc}</span></button>`).join('');
  }
  function update() {
    const rows = Store.Listings.all().filter(l => matchListing(l, crit));
    const trees = rows.reduce((a, l) => a + (l.qty || 0), 0);
    panel.querySelector('#spCount').textContent = rows.length ? `${rows.length}건 · ${trees.toLocaleString()}주` : '조건에 맞는 나무가 없습니다';
    panel.querySelector('#spGo').textContent = rows.length ? `나무 ${rows.length}건 보기` : '나무 보기';
  }
  function params() {
    const p = new URLSearchParams();
    const text = (input.value || panel.querySelector('#spQ').value || '').trim();
    if (text) for (const [k, v] of specQuery(text)) p.set(k, v);
    if (crit.species.size) p.set('species', [...crit.species].join(','));
    if (crit.shapes.size) p.set('shape', [...crit.shapes].join(','));
    for (const k of ['rmin', 'rmax', 'hmin', 'hmax']) if (crit[k] != null) p.set(k, crit[k]);
    return p;
  }
  function open() {
    if (!panel.hidden) return;
    renderSpecies(); renderShapes(); update();
    panel.hidden = false; form.classList.add('is-open');
    document.addEventListener('pointerdown', onOutside, true);
  }
  function close() {
    panel.hidden = true; form.classList.remove('is-open');
    document.removeEventListener('pointerdown', onOutside, true);
  }
  function onOutside(e) { if (!form.contains(e.target) && !e.target.closest('#searchBtn')) close(); }

  panel.addEventListener('click', e => {
    const sp = e.target.closest('[data-sp]'), sh = e.target.closest('[data-shape]');
    if (sp) { crit.species.has(sp.dataset.sp) ? crit.species.delete(sp.dataset.sp) : crit.species.add(sp.dataset.sp);
      sp.setAttribute('aria-pressed', crit.species.has(sp.dataset.sp)); renderShapes(); update(); }
    if (sh) { crit.shapes.has(sh.dataset.shape) ? crit.shapes.delete(sh.dataset.shape) : crit.shapes.add(sh.dataset.shape);
      sh.setAttribute('aria-pressed', crit.shapes.has(sh.dataset.shape)); update(); }
    if (e.target.closest('#spReset')) {
      crit.species.clear(); crit.shapes.clear(); crit.rmin = crit.rmax = crit.hmin = crit.hmax = null;
      sR.reset(true); sH.reset(true); input.value = ''; panel.querySelector('#spQ').value = '';
      renderSpecies(); renderShapes(); update();
    }
    if (e.target.closest('#spClose')) close();
  });
  input.addEventListener('focus', open);
  input.addEventListener('click', open);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) close(); });
  return { open, close, params, isOpen: () => !panel.hidden };
}

/* =========================================================
   더미 데이터 — 풀스택 전환 시 이 구조가 그대로 API 응답 스키마가 됩니다.
   ========================================================= */

/* 수종 마스터 */
const SPECIES = [
  { id: 'sonamu',   name: '소나무',   group: '침엽수', emoji: '' },
  { id: 'bansong',  name: '반송',     group: '침엽수', emoji: '' },
  { id: 'geumgang', name: '금강송',   group: '침엽수', emoji: '' },
  { id: 'juyok',    name: '주목',     group: '침엽수', emoji: '' },
  { id: 'neuti',    name: '느티나무', group: '활엽수', emoji: '' },
  { id: 'ipap',     name: '이팝나무', group: '활엽수', emoji: '' },
  { id: 'baerong',  name: '배롱나무', group: '활엽수', emoji: '' },
  { id: 'danpung',  name: '단풍나무', group: '활엽수', emoji: '' },
  { id: 'gamnamu',  name: '감나무',   group: '유실수', emoji: '' },
];

/* 수형(모양) — 수종을 고르면 그 수종에서 나오는 형태만 보여줍니다. icon 은 app.js SHAPE_ICONS 키 */
const SHAPES = [
  { id: 'natural',  name: '자연형', desc: '키운 그대로',      for: ['sonamu', 'geumgang', 'juyok', 'danpung', 'gamnamu', 'neuti'] },
  { id: 'sculpt',   name: '조형',   desc: '층으로 다듬음', for: ['sonamu', 'geumgang', 'juyok', 'baerong'] },
  { id: 'straight', name: '직간',   desc: '곧게 선 줄기',      for: ['sonamu', 'geumgang', 'neuti', 'ipap', 'danpung', 'baerong'] },
  { id: 'curved',   name: '곡간',   desc: '굽이진 줄기',       for: ['sonamu', 'geumgang'] },
  { id: 'multi',    name: '다간',   desc: '여러 갈래 줄기',         for: ['sonamu', 'bansong', 'neuti', 'ipap', 'baerong', 'danpung'] },
  { id: 'round',    name: '둥근형', desc: '둥근 수관',   for: ['bansong', 'juyok', 'gamnamu'] },
  { id: 'umbrella', name: '우산형', desc: '넓게 퍼진 수관',   for: ['neuti', 'sonamu', 'ipap', 'bansong'] },
  { id: 'cone',     name: '원추형', desc: '위로 좁아짐', for: ['juyok', 'geumgang'] },
];
function shapesFor(speciesIds) {
  const ids = [...speciesIds];
  return SHAPES.filter(sh => ids.some(id => sh.for.includes(id)));
}
function shapeName(id) { return (SHAPES.find(s => s.id === id) || {}).name || id; }

const REGIONS = ['경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];

/* =========================================================
   조경수 표준 규격 (국내 조경 실무 표기법)

   측정 기준
     H  수고     지표면 ~ 수관 정상부 (m)
     W  수관폭   수관의 최대 폭 (m)
     B  흉고직경 지표면에서 1.2m 높이 줄기 지름 (cm)
     R  근원직경 지표면에 닿는 줄기 지름 (cm)
     L  지하고   지표면 ~ 최초 가지까지 높이 (m)

   수종에 따라 쓰는 조합이 정해져 있습니다.
     침엽수·상록교목   H × W          (수관이 값을 좌우)
     직간 활엽교목     H × B          (흉고 측정이 쉬움)
     근원부가 굵은 수종 H × R
     관목·다간형       H × W (+ 주립수)

   ※ 표기 조합은 조경설계기준·조경공사 표준시방서의 통용 관행을 따랐습니다.
      실제 납품 규격은 발주처 시방서를 확인해야 합니다.
   ========================================================= */
/* notation = 표기에 실제로 찍히는 항목(순서대로)
   required = 반드시 입력받아야 하는 항목
   optional = 표기에는 안 쓰지만 참고로 받아두는 항목 */
const SPEC_RULES = {
  sonamu:   { group: '침엽교목',    notation: ['H','W','R'], required: ['H','W'], optional: ['B'], primary: 'R', ball: 5, season: '11월 ~ 3월' },
  bansong:  { group: '침엽교목',    notation: ['H','W'],     required: ['H','W'], optional: ['R'], primary: 'H', ball: 5, season: '연중' },
  geumgang: { group: '침엽교목',    notation: ['H','W','R'], required: ['H','W'], optional: ['B'], primary: 'R', ball: 5, season: '12월 ~ 2월' },
  juyok:    { group: '상록교목',    notation: ['H','W'],     required: ['H','W'], optional: ['R'], primary: 'H', ball: 5, season: '10월 ~ 4월' },
  neuti:    { group: '낙엽활엽교목', notation: ['H','R'],     required: ['H','R'], optional: ['B','W'], primary: 'R', ball: 4, season: '11월 ~ 3월' },
  ipap:     { group: '낙엽활엽교목', notation: ['H','B'],     required: ['H','B'], optional: ['R','W'], primary: 'B', ball: 4, season: '11월 ~ 3월' },
  baerong:  { group: '낙엽활엽교목', notation: ['H','R'],     required: ['H','R'], optional: ['W'],  primary: 'R', ball: 4, season: '11월 ~ 3월' },
  danpung:  { group: '낙엽활엽교목', notation: ['H','R'],     required: ['H','R'], optional: ['B','W'], primary: 'R', ball: 4, season: '11월 ~ 3월' },
  gamnamu:  { group: '유실수',      notation: ['H','R'],     required: ['H','R'], optional: ['W'],  primary: 'R', ball: 4, season: '12월 ~ 3월' },
  etc:      { group: '기타',        notation: ['H','W','B','R'], required: ['H'], optional: [],   primary: 'R', ball: 4, season: '11월 ~ 3월' },
};

const SPEC_META = {
  H: { name: '수고',     unit: 'm',  where: '지표면에서 수관 정상부까지' },
  W: { name: '수관폭',   unit: 'm',  where: '수관의 최대 폭' },
  B: { name: '흉고직경', unit: 'cm', where: '지표면에서 1.2m 높이의 줄기 지름' },
  R: { name: '근원직경', unit: 'cm', where: '지표면에 닿는 부분의 줄기 지름' },
};

/* 규격 표기 문자열 — 예) H4.0×W2.4×R15 */
function specNotation(speciesId, spec) {
  const rule = SPEC_RULES[speciesId] || SPEC_RULES.etc;
  const parts = rule.notation
    .filter(k => spec[k] != null && spec[k] !== '' && Number(spec[k]) > 0)
    .map(k => {
      const v = Number(spec[k]);
      return k + (k === 'H' || k === 'W' ? v.toFixed(1) : String(v));
    });
  return parts.join('×');
}

/* 뿌리분 크기 — 조경 실무 관용식
   분 지름 = 24 + (근원직경 − 3) × 상수 (활엽수 4 · 침엽수 5)
   분 깊이는 보통분 기준 지름의 약 2/3
   ※ 실제 시공 기준은 조경공사 표준시방서 최신본을 확인해야 합니다. */
function rootBall(R, speciesId) {
  const rule = SPEC_RULES[speciesId] || SPEC_RULES.etc;
  const r = Number(R);
  if (!r || r <= 0) return null;
  const dia = Math.round(24 + (r - 3) * rule.ball);
  return { dia, depth: Math.round(dia * 2 / 3), factor: rule.ball };
}

/* =========================================================
   개체 코드 시스템 — 핵심 기능
   나무 한 그루마다 고유 코드가 있고, 코드만 있으면 누구나
   그 나무의 사진·실측 규격·소속 매물을 조회할 수 있습니다.

   코드 형식: [수종 2자][매물번호 뒤 4자리]-[개체 순번 2자리]
   예) SN0142-03 = 소나무 · 매물 0142 · 3번 나무
   ========================================================= */
const SPECIES_CODE = {
  sonamu: 'SN', bansong: 'BS', geumgang: 'GG', juyok: 'JM', neuti: 'NT',
  ipap: 'IP', baerong: 'BR', danpung: 'DP', gamnamu: 'GN', etc: 'ET',
};
const CODE_RE = /^([A-Z]{2})\s?(\d{4})\s?-?\s?(\d{1,2})$/;

/* 결정적 난수 — 같은 매물이면 언제 봐도 같은 개체 목록이 나옵니다 */
function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/* 매물의 개체 목록.
   시드 매물 = 실측 등록된 대표 개체 (규격이 조금씩 다름)
   사용자 매물 = 실측 전이라 매물 규격 그대로 (표기해 줌) */
function individualsOf(l) {
  if (!l) return [];
  const n = Math.min(l.qty, 10);
  const rand = mulberry32(hashSeed(l.id));
  const sc = SPECIES_CODE[l.species] || 'ET';
  const sp4 = l.id.slice(-4);
  const measured = !l.mine;
  const out = [];

  for (let i = 1; i <= n; i++) {
    const vary = k => {
      const base = l.spec[k];
      if (base == null) return null;
      if (!measured) return base;
      const x = base * (0.92 + rand() * 0.16);       /* ±8% 개체 편차 */
      return (k === 'H' || k === 'W') ? Math.round(x * 10) / 10 : Math.round(x * 2) / 2;
    };
    const spec = { H: vary('H'), W: vary('W'), B: vary('B'), R: vary('R') };
    const gradeRoll = rand(), statusRoll = rand();

    out.push({
      code: `${sc}${sp4}-${String(i).padStart(2, '0')}`,
      listingId: l.id,
      species: l.species,
      idx: i,
      spec,
      notation: specNotation(l.species, spec),
      grade: measured ? (gradeRoll < 0.3 ? 'A' : gradeRoll < 0.85 ? 'B' : 'C') : null,
      status: l.status === '거래완료' ? '거래완료'
            : (measured && statusRoll < 0.14 ? '예약중' : '판매중'),
      measured,
      measuredAt: l.createdAt,
      hue: ((l.hue || 120) + i * 9) % 360,
    });
  }
  return out;
}

/* 코드로 개체 찾기 — listings 는 Store.Listings.all() 을 넘겨받습니다 */
function treeByCode(code, listings) {
  const m = CODE_RE.exec(String(code || '').trim().toUpperCase());
  if (!m) return null;
  const l = listings.find(x =>
    x.id.slice(-4) === m[2] && (SPECIES_CODE[x.species] || 'ET') === m[1]);
  if (!l) return null;
  return individualsOf(l)[Number(m[3]) - 1] || null;
}

/* 굴취·운반 장비 구간 (근원직경 기준 · 참고값) */
function equipTier(R) {
  const r = Number(R);
  if (!r) return null;
  if (r <= 10) return { label: 'R10 이하 소형', gear: '굴삭기 03W', dig: '3~6만원/주', move: '25만원~/차' };
  if (r <= 20) return { label: 'R10~R20 중형', gear: '굴삭기 06W · 5t 카고', dig: '8~15만원/주', move: '45만원~/차' };
  if (r <= 30) return { label: 'R20~R30 대형', gear: '크레인 25t · 트레일러', dig: '20~40만원/주', move: '80만원~/차' };
  return { label: 'R30 이상 특대', gear: '크레인 50t 이상 · 도로 협의', dig: '현장 견적', move: '현장 견적' };
}

/* 시세 기준가 (원/주) — 규격 중앙값 기준 */
const PRICE_INDEX = {
  sonamu:   { now: 285000, prev: 262000, unit: 'R15 기준', refSpec: { R: 15 }, low: 180000, high: 420000,
              history: [232000, 240000, 251000, 248000, 262000, 285000] },
  bansong:  { now: 640000, prev: 655000, unit: 'H2.5 기준', refSpec: { H: 2.5 }, low: 420000, high: 980000,
              history: [700000, 688000, 671000, 660000, 655000, 640000] },
  geumgang: { now: 1250000, prev: 1180000, unit: 'R20 기준', refSpec: { R: 20 }, low: 850000, high: 1900000,
              history: [1020000, 1080000, 1110000, 1150000, 1180000, 1250000] },
  neuti:    { now: 420000, prev: 418000, unit: 'R20 기준', refSpec: { R: 20 }, low: 300000, high: 610000,
              history: [402000, 408000, 412000, 415000, 418000, 420000] },
  ipap:     { now: 195000, prev: 172000, unit: 'B12 기준', refSpec: { B: 12 }, low: 120000, high: 280000,
              history: [150000, 158000, 163000, 168000, 172000, 195000] },
  baerong:  { now: 168000, prev: 175000, unit: 'R10 기준', refSpec: { R: 10 }, low: 95000, high: 240000,
              history: [188000, 184000, 180000, 178000, 175000, 168000] },
  danpung:  { now: 310000, prev: 298000, unit: 'R15 기준', refSpec: { R: 15 }, low: 210000, high: 450000,
              history: [275000, 282000, 288000, 293000, 298000, 310000] },
  juyok:    { now: 225000, prev: 225000, unit: 'H2.0 기준', refSpec: { H: 2.0 }, low: 150000, high: 330000,
              history: [220000, 222000, 224000, 225000, 225000, 225000] },
  gamnamu:  { now: 132000, prev: 121000, unit: 'R10 기준', refSpec: { R: 10 }, low: 80000, high: 190000,
              history: [110000, 114000, 116000, 119000, 121000, 132000] },
};

const PRICE_MONTHS = ['4월', '5월', '6월', '7월', '8월', '9월'];

/* 매물 — 런칭 단계: 파주 법원리농원(1호 농가) 단독 입점.
   할아버지가 30년 넘게 기른 소나무를 규격별 로트로 나눠 등록합니다.
   unitPrice 는 비공개 내부값(문의 회신·시세 피드백 기준)입니다. */
const FARM = {
  name: '법원리농원',
  owner: '법원리농원 김OO',
  init: '김',
  no: 1,                       /* 인증 농가 1호 */
  region: '경기',
  addr: '경기 파주시 법원읍',
  years: 32,
  area: '약 4만 평 (13ha)',
  stock: '적송 239주 실측',
  story: '파주 법원리에서 30년 넘게 소나무만 길러 온 농원입니다. 적송 239주가 구역·줄·번호 코드로 실측 등록되어 있고, 배치도에서 자리를 고르면 그 나무의 사진과 규격을 바로 볼 수 있습니다.',
};

const LISTINGS = [
  {
    id: 'L2409-0142', species: 'sonamu', shape: 'natural', title: '적송 R15 균일주 · 조경 식재 바로 가능',
    grower: FARM.owner, growerInit: FARM.init, verified: true, years: FARM.years, deals: 41, rating: 4.9,
    region: FARM.region, addr: FARM.addr, qty: 120, unitPrice: 268000,
    spec: { R: 15, H: 4.2, W: 2.4, B: null }, notation: 'H4.2×W2.4×R15',
    dug: false, season: '11월 ~ 3월', hue: 142,
    status: '판매중', createdAt: '2026-08-28', views: 412, favs: 37,
    tags: ['현장확인가능', '대량보유', '규격균일'],
    desc: '20년생 적송입니다. 근원경 15cm 내외로 균일하게 관리했고 수형은 자연형입니다. 120주 전량 동일 규격군이라 대단지 조경 공사에 적합합니다. 현장 확인 언제든 환영합니다.',
    photos: 8,
  },
  {
    id: 'L2409-0121', species: 'sonamu', shape: 'straight', title: '적송 R12 · 단지 조경용 200주',
    grower: FARM.owner, growerInit: FARM.init, verified: true, years: FARM.years, deals: 41, rating: 4.9,
    region: FARM.region, addr: FARM.addr, qty: 200, unitPrice: 205000,
    spec: { R: 12, H: 3.6, W: 2.0, B: null }, notation: 'H3.6×W2.0×R12',
    dug: false, season: '11월 ~ 3월', hue: 136,
    status: '판매중', createdAt: '2026-08-30', views: 318, favs: 24,
    tags: ['대량보유', '규격균일', '현장확인가능'],
    desc: '15년생 적송 200주입니다. 간격을 넓게 잡고 키워 수관이 고르게 퍼져 있습니다. 아파트 단지·공원 녹지 일괄 납품에 맞춰 규격을 맞췄습니다.',
    photos: 6,
  },
  {
    id: 'L2409-0133', species: 'sonamu', shape: 'sculpt', title: '적송 R18 특선 · 수형 관리목 40주',
    grower: FARM.owner, growerInit: FARM.init, verified: true, years: FARM.years, deals: 41, rating: 4.9,
    region: FARM.region, addr: FARM.addr, qty: 40, unitPrice: 385000,
    spec: { R: 18, H: 5.0, W: 3.0, B: 15 }, notation: 'H5.0×W3.0×R18',
    dug: false, season: '11월 ~ 3월', hue: 148,
    status: '판매중', createdAt: '2026-08-25', views: 505, favs: 58,
    tags: ['수형우수', '현장확인가능'],
    desc: '매년 전정으로 수형을 잡아 온 25년생 특선목입니다. 리조트·관공서 상징목으로 여러 차례 납품했습니다. 개체 코드로 한 그루씩 수형을 확인하고 고르실 수 있습니다.',
    photos: 12,
  },
  {
    id: 'L2409-0108', species: 'sonamu', shape: 'curved', title: '적송 R22 대형목 · 상징목급 12주',
    grower: FARM.owner, growerInit: FARM.init, verified: true, years: FARM.years, deals: 41, rating: 4.9,
    region: FARM.region, addr: FARM.addr, qty: 12, unitPrice: 520000,
    spec: { R: 22, H: 6.2, W: 3.8, B: 18 }, notation: 'H6.2×W3.8×R22',
    dug: false, season: '12월 ~ 2월', hue: 152,
    status: '협의중', createdAt: '2026-08-19', views: 887, favs: 96,
    tags: ['수형우수', '희소', '현장확인필수'],
    desc: '농장에서 가장 오래 키운 30년생 대형목입니다. 통직도와 수형 모두 상징목급입니다. 대형목 특성상 굴취·운반 여건(진입로·크레인)을 현장에서 함께 확인해야 합니다.',
    photos: 15,
  },
  {
    id: 'L2409-0114', species: 'bansong', shape: 'round', title: '반송 H2.5 · 굴취 완료 즉시 출하 18주',
    grower: FARM.owner, growerInit: FARM.init, verified: true, years: FARM.years, deals: 41, rating: 4.9,
    region: FARM.region, addr: FARM.addr, qty: 18, unitPrice: 690000,
    spec: { R: null, H: 2.5, W: 3.0, B: null }, notation: 'H2.5×W3.0',
    dug: true, season: '연중', hue: 118,
    status: '판매중', createdAt: '2026-08-31', views: 634, favs: 71,
    tags: ['굴취완료', '수형우수', '즉시출하'],
    desc: '하부 가지 정리를 마친 반송입니다. 수관폭 3m 내외로 풍성하고, 굴취 후 분 뜨기까지 완료되어 계약 즉시 상차 가능합니다.',
    photos: 10,
  },
  {
    id: 'L2409-0074', species: 'bansong', shape: 'round', title: '소형 반송 H1.5 · 주택 정원용 (판매 완료)',
    grower: FARM.owner, growerInit: FARM.init, verified: true, years: FARM.years, deals: 41, rating: 4.9,
    region: FARM.region, addr: FARM.addr, qty: 36, unitPrice: 385000,
    spec: { R: null, H: 1.5, W: 1.8, B: null }, notation: 'H1.5×W1.8',
    dug: true, season: '연중', hue: 128,
    status: '거래완료', createdAt: '2026-08-06', views: 731, favs: 92,
    tags: ['굴취완료', '정원용'],
    desc: '주택 정원 규격의 소형 반송 36주. Tree Atelier 첫 거래로 전량 판매되었습니다.',
    photos: 9,
  },
  {
    id: 'L2409-0097', species: 'geumgang', shape: 'straight', title: '금강송 R20 · 문화재 보수용 규격 6주',
    grower: FARM.owner, growerInit: FARM.init, verified: true, years: FARM.years, deals: 41, rating: 4.9,
    region: FARM.region, addr: FARM.addr, qty: 6, unitPrice: 1180000,
    spec: { R: 20, H: 6.8, W: 3.0, B: 17 }, notation: 'H6.8×W3.0×R20',
    dug: false, season: '12월 ~ 2월', hue: 158,
    status: '판매중', createdAt: '2026-08-21', views: 1204, favs: 156,
    tags: ['희소', '이력증명', '현장확인필수'],
    desc: '농장 뒤 산지의 금강송입니다. 수령 30년 이상, 통직도가 우수해 문화재 보수·고급 한옥 자재용으로 적합합니다. 산림청 이력 서류를 구비하고 있습니다.',
    photos: 14,
  },
  {
    id: 'L2409-0089', species: 'sonamu', shape: 'natural', title: '적송 R10 · 육성용 300주 일괄',
    grower: FARM.owner, growerInit: FARM.init, verified: true, years: FARM.years, deals: 41, rating: 4.9,
    region: FARM.region, addr: FARM.addr, qty: 300, unitPrice: 145000,
    spec: { R: 10, H: 2.8, W: 1.6, B: null }, notation: 'H2.8×W1.6×R10',
    dug: false, season: '11월 ~ 3월', hue: 132,
    status: '판매중', createdAt: '2026-08-15', views: 246, favs: 19,
    tags: ['대량보유', '일괄거래'],
    desc: '10년생 육성목입니다. 옮겨 심어 몇 년 더 키우면 조경 규격이 되는 나무들로, 조경수 재배를 시작하는 농가나 대규모 녹화 사업에 맞습니다. 일괄 거래 시 협의 가능합니다.',
    photos: 5,
  },
];

/* =========================================================
   최근 실거래 내역 — 배너·시세 근거로 쓰입니다.
   정산까지 끝난 건만 들어갑니다.
   ========================================================= */
const RECENT_DEALS = [
  { species:'sonamu',   spec:{H:4.2,W:2.4,R:15}, qty:80,  unitPrice:281000,  region:'경기', date:'2026-09-01' },
  { species:'bansong',  spec:{H:2.5,W:3.1},      qty:12,  unitPrice:668000,  region:'전북', date:'2026-09-01' },
  { species:'ipap',     spec:{H:4.0,B:12},       qty:220, unitPrice:186000,  region:'전남', date:'2026-08-31' },
  { species:'sonamu',   spec:{H:5.0,W:3.2,R:18}, qty:24,  unitPrice:372000,  region:'경남', date:'2026-08-30' },
  { species:'neuti',    spec:{H:6.0,R:18},       qty:16,  unitPrice:388000,  region:'경기', date:'2026-08-30' },
  { species:'danpung',  spec:{H:3.6,R:15},       qty:34,  unitPrice:318000,  region:'경기', date:'2026-08-29' },
  { species:'geumgang', spec:{H:6.8,W:3.0,R:20}, qty:4,   unitPrice:1310000, region:'강원', date:'2026-08-28' },
  { species:'sonamu',   spec:{H:3.5,W:2.0,R:12}, qty:150, unitPrice:214000,  region:'충북', date:'2026-08-28' },
  { species:'juyok',    spec:{H:2.0,W:1.1},      qty:200, unitPrice:207000,  region:'강원', date:'2026-08-27' },
  { species:'baerong',  spec:{H:2.8,R:10},       qty:60,  unitPrice:162000,  region:'전남', date:'2026-08-26' },
  { species:'neuti',    spec:{H:7.5,R:22},       qty:5,   unitPrice:496000,  region:'경남', date:'2026-08-25' },
  { species:'sonamu',   spec:{H:4.0,W:2.2,R:15}, qty:60,  unitPrice:274000,  region:'강원', date:'2026-08-24' },
  { species:'gamnamu',  spec:{H:2.6,R:10},       qty:48,  unitPrice:129000,  region:'경남', date:'2026-08-22' },
  { species:'ipap',     spec:{H:3.8,B:10},       qty:300, unitPrice:171000,  region:'전북', date:'2026-08-21' },
  { species:'sonamu',   spec:{H:6.0,W:3.6,R:22}, qty:8,   unitPrice:512000,  region:'경기', date:'2026-08-19' },
  { species:'danpung',  spec:{H:3.0,R:12},       qty:40,  unitPrice:241000,  region:'충남', date:'2026-08-18' },
  { species:'bansong',  spec:{H:1.5,W:1.8},      qty:36,  unitPrice:392000,  region:'경기', date:'2026-08-16' },
  { species:'geumgang', spec:{H:5.5,W:2.6,R:16}, qty:6,   unitPrice:940000,  region:'강원', date:'2026-08-14' },
];

/* "3일 전" — 오늘 기준 경과일 */
function daysAgo(dateStr, today) {
  const a = new Date(dateStr + 'T00:00:00');
  const b = today ? new Date(today + 'T00:00:00') : new Date();
  const d = Math.round((b - a) / 86400000);
  if (d <= 0) return '오늘';
  if (d === 1) return '어제';
  if (d < 7) return d + '일 전';
  if (d < 30) return Math.floor(d / 7) + '주 전';
  return Math.floor(d / 30) + '개월 전';
}

/* 거래가 시세보다 높았는지 낮았는지.
   시세는 기준 규격(refSpec) 값이라, 규격이 다르면 값을 직접 비교할 수 없습니다.
   그럴 때는 비교 대신 규격 차이를 알려줍니다. */
function dealVsIndex(deal) {
  const idx = PRICE_INDEX[deal.species];
  if (!idx || !idx.refSpec) return null;

  const key = Object.keys(idx.refSpec)[0];
  const ref = idx.refSpec[key];
  const mine = Number(deal.spec[key]);
  if (!mine) return null;

  /* 기준 규격에서 12% 넘게 벗어나면 가격 비교를 하지 않습니다 */
  const gap = (mine - ref) / ref;
  if (Math.abs(gap) > 0.12) {
    const label = key + (key === 'H' ? ref.toFixed(1) : ref);
    return { key: 'spec', text: `기준 ${label}보다 ${gap > 0 ? '큰' : '작은'} 규격` };
  }

  const ratio = deal.unitPrice / idx.now;
  const pct = Math.round(Math.abs(ratio - 1) * 100);
  if (ratio >= 1.08) return { key: 'high', text: `시세 +${pct}%` };
  if (ratio <= 0.92) return { key: 'low',  text: `시세 −${pct}%` };
  return { key: 'mid', text: '시세 수준' };
}

/* 규격이 비슷한 거래 찾기 — 같은 수종, 대표 치수 ±tol */
function similarDeals(species, spec, tol) {
  const t = tol == null ? 0.25 : tol;
  const rule = SPEC_RULES[species] || SPEC_RULES.etc;
  const key = spec && spec.R ? 'R' : spec && spec.B ? 'B' : 'H';
  const mine = spec ? Number(spec[key]) : null;

  return RECENT_DEALS
    .filter(d => d.species === species)
    .map(d => {
      const theirs = Number(d.spec[key]);
      const gap = (mine && theirs) ? Math.abs(theirs - mine) / mine : 99;
      return { deal: d, gap };
    })
    .filter(x => x.gap <= t)
    .sort((a, b) => a.gap - b.gap || b.deal.date.localeCompare(a.deal.date))
    .map(x => x.deal);
}

/* 운반·굴취 업체 */
const MOVERS = [
  { name: '백두중기', region: '강원·경북', spec: '대형목 굴취 · 크레인 25t', deals: 214, rating: 4.8, init: '백',
    price: '굴취 8만원/주 ~', badge: '보험가입' },
  { name: '남도수목운송', region: '전남·전북', spec: '조경수 전문 운송 · 트레일러', deals: 388, rating: 4.9, init: '남',
    price: '운송 45만원/차 ~', badge: '실시간추적' },
  { name: '한결조경장비', region: '경기·충청', spec: '굴취 + 운반 + 식재 일괄', deals: 156, rating: 4.7, init: '한',
    price: '일괄 견적', badge: '일괄시공' },
];

/* 커뮤니티 게시글 */
const POSTS = [
  { id: 1, cat: '재배노하우', title: '소나무 근원경 15cm까지, 저는 이렇게 키웠습니다 (14년 기록)',
    excerpt: '파주에서 소나무 농사 짓는 사람입니다. 처음 묘목 심을 때부터 지금까지 간격, 전정 시기, 비료 준 기록을 다 남겨뒀는데 도움이 될까 싶어 정리해서 올립니다.',
    author: '법원리농원 김OO', init: '김', date: '2026-08-30', views: 1842, comments: 47, likes: 213, hot: true },
  { id: 2, cat: '시세정보', title: '올해 이팝나무 가로수 단가, 작년보다 확실히 올랐습니다',
    excerpt: '지자체 발주가 몰리면서 R12 기준으로 작년 대비 15% 정도 올랐네요. 계약하신 분들 단가 어떻게 되시나요?',
    author: '정읍조경수', init: '정', date: '2026-08-29', views: 963, comments: 31, likes: 88, hot: true },
  { id: 3, cat: '거래후기', title: '첫 거래 후기 — 반송 36주, 부르는 값이 아니라 제값에 팔았습니다',
    excerpt: '30년 농사에 처음으로 중간상 없이 팔아봤습니다. 개체 코드로 나무를 하나하나 보여주니 구매자가 현장에 오기 전에 이미 마음을 정하고 왔습니다. 굴취 업체 매칭까지 플랫폼에서 끝났습니다.',
    author: '법원리농원 김OO', init: '김', date: '2026-08-27', views: 741, comments: 22, likes: 134, hot: true },
  { id: 4, cat: '질문답변', title: '느티나무 대형목 이식할 때 분 크기 어느 정도로 잡아야 하나요?',
    excerpt: 'R20 정도 되는 느티나무를 옮기려는데 분을 얼마나 크게 떠야 활착이 잘 될까요? 경험 있으신 분 조언 부탁드립니다.',
    author: '초보조경', init: '초', date: '2026-08-27', views: 428, comments: 19, likes: 24, hot: false },
  { id: 5, cat: '재배노하우', title: '장마 끝나고 배롱나무 관리, 이것만은 꼭 하세요',
    excerpt: '무안에서 배롱나무 키우는데 장마 직후 관리가 다음 해 개화를 좌우합니다. 배수 정리랑 병해 방제 순서 정리했습니다.',
    author: '무안화훼', init: '무', date: '2026-08-25', views: 612, comments: 15, likes: 71, hot: false },
  { id: 6, cat: '정책·지원', title: '2026년 조경수 재배 농가 지원사업 정리 (지자체별)',
    excerpt: '올해 신청 가능한 지원사업을 지자체별로 모아봤습니다. 마감일 지난 건 취소선 처리했습니다.',
    author: 'Tree Atelier 운영팀', init: 'T', date: '2026-08-22', views: 1533, comments: 28, likes: 192, hot: true },
];

const POST_CATS = ['전체', '재배노하우', '시세정보', '거래후기', '질문답변', '정책·지원'];

/* ---------- 헬퍼 ---------- */
const speciesName = id => (SPECIES.find(s => s.id === id) || {}).name || id;
const speciesEmoji = id => (SPECIES.find(s => s.id === id) || {}).emoji || '';

const won = n => n.toLocaleString('ko-KR');
const wonShort = n => {
  if (n >= 100000000) return (n / 100000000).toFixed(n % 100000000 === 0 ? 0 : 1) + '억';
  if (n >= 10000) return Math.round(n / 10000).toLocaleString('ko-KR') + '만';
  return n.toLocaleString('ko-KR');
};

/* 시세 대비 위치 판정 — 투명 거래의 핵심 로직 */
function fairness(listing) {
  const idx = PRICE_INDEX[listing.species];
  if (!idx) return null;
  const ratio = listing.unitPrice / idx.now;
  if (ratio <= 0.92) return { key: 'low',  label: '시세보다 저렴', pct: Math.round((1 - ratio) * 100) + '% 낮음' };
  if (ratio >= 1.08) return { key: 'high', label: '시세보다 높음', pct: Math.round((ratio - 1) * 100) + '% 높음' };
  return { key: 'mid', label: '적정 시세', pct: '평균 수준' };
}

/* 규격 요약 문자열 */
function specLine(l) {
  const p = [];
  if (l.spec.R) p.push('R' + l.spec.R);
  if (l.spec.B) p.push('B' + l.spec.B);
  if (l.spec.H) p.push('H' + l.spec.H);
  if (l.spec.W) p.push('W' + l.spec.W);
  return p.join(' · ');
}

/* =====================================================================
   법원리농원 배치도 — 손그림 배치도(전체 개요도 + Zone A/B/C/D) 전사
   ---------------------------------------------------------------------
   · 원본: assets/img/farm/docs/map-overview.jpg, map-zone-A~D.jpg
   · 기호: o 나무(생존)  x 결주(원본 × 표시)  . 빈 자리(표시 없음)
   · 장부 코드 = 구역-line-seq. 구역마다 line/pos 축의 의미가 다르다.
       A : line = 세로열 1~16(좌→우), pos = 가로줄 1~8(아래→위)
       B : line = 가로줄 1~8(아래→위), pos = 세로열 1~13(동→서, 원본 우측이 1)
       C : line = 가로줄 1~9(아래→위), pos = 세로열 1~9(좌→우)
       D : line = 1~13(아래→위), pos = 1~9(좌→우)
   · seq는 원칙적으로 pos(자리 번호)와 같다. 예외(원본에 번호가 따로 적힌 줄)는
     seqMap 으로 pos→seq 를 지정한다: B-7, B-8, C-9.
   · 항공뷰 좌표(canvas 1000×760)는 개요도의 비율을 옮긴 '개념 배치'이며 축척은 없다.
   · 장부(farm-data.js)와 교차 검증: FARM_TREES 239주 == 배치도 'o' 239자리 (registryMapCheck)
   ===================================================================== */

const FARM_MAP = {
  canvas: { w: 1000, h: 760 },
  source: '손그림 배치도 5장 (전체 개요도 + Zone A·B·C·D), 2026-09 촬영',
  legend: { o: '나무', x: '결주(원본 × 표시)', '.': '빈 자리' },

  zones: {
    A: {
      id: 'A', name: 'A 구역', sub: '진입부 · 격자식재',
      lineAxis: '세로열 1~16 (좌→우)', posAxis: '가로줄 1~8 (아래→위)',
      /* 항공뷰: 구역 외곽(개요도 비율) */
      poly: [[705, 455], [822, 455], [915, 540], [938, 628], [705, 628]],
      /* 나무 좌표 = origin + (line-1)*u + (pos-1)*v */
      frame: { origin: [716, 618], u: [14.2, 0], v: [0, -22.4] },
      labelAt: [790, 448],
      /* line → pos 1..N 문자열 */
      rows: {
        1: 'oxoxoxo', 2: 'xxxooxoo', 3: 'o.oxxoxo', 4: 'xoooxxxx',
        5: 'oxxxxoo', 6: 'xooooox', 7: 'oxoxoxx', 8: 'xoxoxoo',
        9: 'oxoxxo', 10: 'xxxooo', 11: 'oxoxo', 12: 'xoxox',
        13: 'oxxxo', 14: 'xoox', 15: 'oxxx', 16: 'oo',
      },
    },
    H: {
      id: 'H', name: 'A-H 열', sub: 'A 구역 앞 외곽 한 줄', parent: 'A', codePrefix: 'A',
      lineAxis: '(한 줄)', posAxis: '1~9 (좌→우, 간격 불규칙)',
      poly: [[705, 640], [938, 640], [938, 664], [705, 664]],
      /* 한 줄이라 pos마다 x 오프셋을 직접 지정 (A 구역 열 번호 기준 위치) */
      frame: { origin: [716, 652], u: [0, 0], v: [14.2, 0] },
      posOffsets: { 1: 0, 2: 1, 3: 5.5, 4: 8, 5: 9, 6: 10, 7: 13, 8: 14, 9: 15 },
      labelAt: null,
      rows: { H: 'ooooooooo' },
    },
    B: {
      id: 'B', name: 'B 구역', sub: '서측 완사면 · 최다 식재',
      lineAxis: '가로줄 1~8 (아래→위)', posAxis: '세로열 1~13 (동→서)',
      poly: [[20, 540], [282, 345], [462, 452], [310, 625], [80, 610]],
      frame: { origin: [440, 470], u: [-21.4, -15.7], v: [-20, 16.7] },
      labelAt: [120, 655],
      rows: {
        1: 'oooooooo', 2: 'ooooooooo', 3: 'oooooooooo', 4: 'oooooooooo',
        5: 'oooooooooooo', 6: 'ooooooooooooo',
        7: 'oo.......oooo', 8: '..........ooo',
      },
      seqMap: {
        7: { 1: 1, 2: 2, 10: 3, 11: 4, 12: 5, 13: 6 },
        8: { 11: 1, 12: 2, 13: 3 },
      },
    },
    C: {
      id: 'C', name: 'C 구역', sub: '중앙부 · 반송 다수',
      lineAxis: '가로줄 1~9 (아래→위)', posAxis: '세로열 1~9 (좌→우)',
      axisNote: '개요도상 축 방향은 추정 — 현장 확인 필요',
      poly: [[356, 232], [652, 248], [488, 428], [306, 283]],
      frame: { origin: [470, 398], u: [-15.7, -12.5], v: [17.2, -14.4] },
      labelAt: [500, 262],
      rows: {
        1: 'ooooo', 2: 'ooooooo', 3: 'oxoxoxooo', 4: 'oxoooxox',
        5: 'xooxooo', 6: 'ooxooxo', 7: 'oxoxxx', 8: 'ooxoo', 9: '.ooo',
      },
      seqMap: { 9: { 2: 1, 3: 2, 4: 3 } },
    },
    D: {
      id: 'D', name: 'D 구역', sub: '북측 산자락 · 삼각지',
      lineAxis: '1~13 (아래→위)', posAxis: '1~9 (좌→우)',
      poly: [[462, 8], [506, 8], [612, 118], [660, 242], [362, 236]],
      frame: { origin: [392, 226], u: [5.8, -16], v: [25, 0] },
      labelAt: [566, 36],
      rows: {
        1: 'ooooxoooo', 2: 'oxoxoxoxo', 3: 'ooooxooxo', 4: 'ooxoxoxxo',
        5: 'ooooooooo', 6: 'ooxooooxo', 7: 'oxoooooo', 8: 'ooxooo',
        9: 'xooxoo', 10: 'xoooo', 11: 'oxooo', 12: 'xoxo', 13: 'oo',
      },
    },
  },

  /* 항공뷰 장식 — 길·경계 (개요도 기준 개념 표시) */
  paths: [
    { d: 'M 700 470 L 700 680', w: 10 },          /* A 구역 서측 진입로 */
    { d: 'M 300 460 Q 520 470 700 540', w: 8 },   /* B·C 사이 작업로 */
    { d: 'M 330 232 L 655 250', w: 6 },           /* C·D 경계 통로 */
  ],
  /* 개요도에서 구역 라벨이 붙은 방향(방위는 미기재 — 표시하지 않음) */
};

/* 구역 순서 (지도 선택 UI 용) — H는 A의 부속 열이라 목록엔 A 아래 묶어 표시 */
const FARM_ZONE_ORDER = ['A', 'B', 'C', 'D'];

/* ---------- 배치도 → 자리(slot) 목록 ---------- */
function farmZoneSlots(zoneId) {
  const Z = FARM_MAP.zones[zoneId];
  if (!Z) return [];
  const out = [];
  const prefix = Z.codePrefix || Z.id;
  for (const line of Object.keys(Z.rows)) {
    const str = Z.rows[line];
    for (let i = 0; i < str.length; i++) {
      const pos = i + 1;
      const ch = str[i];
      const seq = Z.seqMap && Z.seqMap[line] ? Z.seqMap[line][pos] : pos;
      const li = line === 'H' ? 0 : (+line - 1);
      const off = Z.posOffsets ? Z.posOffsets[pos] : (pos - 1);
      const x = Z.frame.origin[0] + li * Z.frame.u[0] + off * Z.frame.v[0];
      const y = Z.frame.origin[1] + li * Z.frame.u[1] + off * Z.frame.v[1];
      out.push({
        zone: zoneId, line, pos, seq: ch === 'o' ? seq : null,
        state: ch === 'o' ? 'tree' : ch === 'x' ? 'gone' : 'empty',
        code: ch === 'o' && seq != null ? `${prefix}-${line === 'H' ? 'H' : line}-${seq}` : null,
        x: +x.toFixed(1), y: +y.toFixed(1),
      });
    }
  }
  return out;
}

/* 전체 자리 (구역별 캐시) */
const FARM_SLOTS = (() => {
  const all = {};
  for (const id of Object.keys(FARM_MAP.zones)) all[id] = farmZoneSlots(id);
  return all;
})();

/* 코드 → 자리 */
function farmSlotOf(code) {
  for (const id of Object.keys(FARM_SLOTS)) {
    const s = FARM_SLOTS[id].find(s => s.code === code);
    if (s) return s;
  }
  return null;
}

/* 장부와 배치도 교차 검증: 배치도 'o' 코드 집합 == 장부 코드 집합 */
function registryMapCheck() {
  const mapCodes = new Set();
  for (const id of Object.keys(FARM_SLOTS)) FARM_SLOTS[id].forEach(s => s.code && mapCodes.add(s.code));
  const ledger = new Set((typeof FARM_TREES !== 'undefined' ? FARM_TREES : []).map(t => t.code));
  const onlyMap = [...mapCodes].filter(c => !ledger.has(c));
  const onlyLedger = [...ledger].filter(c => !mapCodes.has(c));
  return { map: mapCodes.size, ledger: ledger.size, onlyMap, onlyLedger, ok: !onlyMap.length && !onlyLedger.length };
}

/* 사람이 읽는 위치 설명: "A 구역 3열 · 아래에서 5번째" */
function farmPlaceText(code) {
  const s = farmSlotOf(code);
  if (!s) return '';
  const Z = FARM_MAP.zones[s.zone];
  if (s.zone === 'H') return `A 구역 앞 외곽 열 · 좌측에서 ${s.pos}번째`;
  if (s.zone === 'A') return `${Z.name} ${s.line}열 · 아래에서 ${s.pos}번째`;
  if (s.zone === 'B') return `${Z.name} ${s.line}번 줄 · 동측에서 ${s.pos}번째`;
  return `${Z.name} ${s.line}번 줄 · 좌측에서 ${s.pos}번째`;
}

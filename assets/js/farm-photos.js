/* =====================================================================
   법원리농원 사진 목록 — 업로드된 실사진의 코드 연결 상태
   ---------------------------------------------------------------------
   kind : tag(관리표) · tree(개체) · view(농원 전경) · pano(파노라마)
   code : 연결된 관리번호 (없으면 null = 미배정)
   confirmed : 코드 연결이 확인됐는지 (관리표가 같이 찍힌 경우만 true)
   ===================================================================== */
const FARM_PHOTOS = [
  { file: 'assets/img/farm/tag-A-H-1.jpg',       code: 'A-H-1', kind: 'tag',  confirmed: true,  note: '관리표: 관리번호 A-H-1 · 수종 적송 · 규격 R25' },
  { file: 'assets/img/farm/tree-A-H-1-01.jpg',   code: 'A-H-1', kind: 'tree', confirmed: false, note: '관리표와 함께 전송된 사진 — 동일 개체로 추정' },
  { file: 'assets/img/farm/tree-A-H-1-02.jpg',   code: 'A-H-1', kind: 'tree', confirmed: false, note: '관리표와 함께 전송된 사진 — 동일 개체로 추정' },
  { file: 'assets/img/farm/tree-unassigned-01.jpg', code: null, kind: 'tree', confirmed: false, note: '코드 미배정' },
  { file: 'assets/img/farm/tree-unassigned-02.jpg', code: null, kind: 'tree', confirmed: false, note: '코드 미배정' },
  { file: 'assets/img/farm/farm-view-01.jpg', code: null, kind: 'view', confirmed: false, note: '' },
  { file: 'assets/img/farm/farm-view-02.jpg', code: null, kind: 'view', confirmed: false, note: '' },
  { file: 'assets/img/farm/farm-view-03.jpg', code: null, kind: 'view', confirmed: false, note: '' },
  { file: 'assets/img/farm/farm-view-04.jpg', code: null, kind: 'view', confirmed: false, note: '' },
  { file: 'assets/img/farm/farm-view-05.jpg', code: null, kind: 'view', confirmed: false, note: '' },
  { file: 'assets/img/farm/farm-view-06.jpg', code: null, kind: 'view', confirmed: false, note: '' },
  { file: 'assets/img/farm/farm-pano-01.jpg', code: null, kind: 'pano', confirmed: false, note: '' },
];

/* 개체 사진이 아직 없는 나무 — 농원 실사진 풀에서 코드 해시로 고정 선택 (참고 사진) */
const SAMPLE_POOL = FARM_PHOTOS.filter(p => !p.code && (p.kind === 'tree' || p.kind === 'view')).map(p => p.file);

function photosOf(code) {
  return FARM_PHOTOS.filter(p => p.code === code);
}
function treePhotosOf(code) {
  return photosOf(code).filter(p => p.kind === 'tree');
}
function sampleOf(code) {
  let h = 0;
  for (const ch of String(code)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return SAMPLE_POOL[h % SAMPLE_POOL.length];
}
/* 대표 이미지: 개체 실사진 우선, 없으면 농원 참고 사진(sample: true) */
function heroOf(code) {
  const t = treePhotosOf(code);
  if (t.length) return { src: t[0].file, real: true, confirmed: t[0].confirmed, sample: false };
  return { src: sampleOf(code), real: true, confirmed: false, sample: true };
}
/* 대표 이미지 라벨 */
function heroLabel(hero) {
  if (hero.sample) return '농원 참고 사진';
  return '현장 사진';
}

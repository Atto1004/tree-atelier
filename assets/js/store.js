/* =========================================================
   저장소 계층
   지금은 브라우저 localStorage 를 씁니다. 풀스택 전환 시
   이 파일의 함수 본문만 fetch() 로 바꾸면 화면 코드는 그대로 둡니다.
   ========================================================= */

const KEY = {
  listings: 'soopro:listings',
  posts:    'soopro:posts',
  comments: 'soopro:comments',
  likes:    'soopro:likes',
  favs:     'soopro:favs',
  me:       'soopro:me',
  inquiries:'soopro:inquiries',
};

/* 수종별 썸네일 색상 (사진 없을 때 쓰는 플레이스홀더용) */
const SPECIES_HUE = {
  sonamu: 142, bansong: 118, geumgang: 155, juyok: 165,
  neuti: 96, ipap: 88, baerong: 330, danpung: 12, gamnamu: 30, etc: 120,
};

/* ---------- 저수준 입출력 ---------- */
function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return { ok: true };
  } catch (e) {
    const full = e && (e.name === 'QuotaExceededError' || e.code === 22);
    return { ok: false, full, error: e };
  }
}

/* ---------- 사용자 ---------- */
function initialOf(name) {
  const s = (name || '').trim();
  return s ? s[0] : '나';
}

const Me = {
  get() {
    return read(KEY.me, { name: '법원리농원 김OO', init: '김' });
  },
  set(name) {
    const me = { name: name.trim(), init: initialOf(name) };
    write(KEY.me, me);
    return me;
  },
};

/* ---------- 매물 ---------- */
function nextListingId(existing) {
  const d = new Date();
  const ym = String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0');
  const n = existing.length + 1;
  return `L${ym}-${String(9000 + n).padStart(4, '0')}`;
}

const Listings = {
  /* 사용자가 등록한 매물 (최신순) */
  mine() {
    return read(KEY.listings, []).slice().reverse();
  },
  /* 시드 + 사용자 등록분 전체 */
  all() {
    return Listings.mine().concat(LISTINGS);
  },
  get(id) {
    return Listings.all().find(l => l.id === id) || null;
  },
  add(input) {
    const stored = read(KEY.listings, []);
    const me = Me.get();
    const today = new Date().toISOString().slice(0, 10);

    const listing = {
      id: nextListingId(stored),
      species: input.species,
      title: input.title,
      grower: me.name,
      growerInit: me.init,
      verified: false,
      years: input.years || 0,
      deals: 0,
      rating: 0,
      region: input.region,
      addr: input.region,
      qty: input.qty,
      unitPrice: input.unitPrice,
      spec: input.spec,
      notation: input.notation || '',
      ball: input.ball || null,
      dug: input.dug,
      season: input.season,
      hue: SPECIES_HUE[input.species] || 120,
      status: '판매중',
      createdAt: today,
      views: 0,
      favs: 0,
      tags: input.tags || [],
      desc: input.desc || '',
      photos: input.photoData ? input.photoData.length : 0,
      photoData: input.photoData || [],
      negotiable: input.negotiable,
      blockLowball: input.blockLowball,
      mine: true,
    };

    stored.push(listing);
    const res = write(KEY.listings, stored);
    if (!res.ok) {
      return { ok: false, full: res.full, listing: null };
    }
    return { ok: true, listing };
  },
  remove(id) {
    const stored = read(KEY.listings, []).filter(l => l.id !== id);
    write(KEY.listings, stored);
  },
};

/* ---------- 관심 매물 ---------- */
const Favs = {
  all() { return read(KEY.favs, []); },
  has(id) { return Favs.all().indexOf(id) !== -1; },
  toggle(id) {
    const list = Favs.all();
    const i = list.indexOf(id);
    if (i === -1) list.push(id); else list.splice(i, 1);
    write(KEY.favs, list);
    return i === -1;
  },
};

/* ---------- 구매 문의 ---------- */
function nextInquiryId(existing) {
  const d = new Date();
  const ym = String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0');
  const n = existing.filter(q => q.id.indexOf('Q' + ym) === 0).length + 1;
  return 'Q' + ym + '-' + String(n).padStart(3, '0');
}
const Inquiries = {
  all() { return read(KEY.inquiries, []); },
  add(data) {
    const list = Inquiries.all();
    const q = Object.assign({}, data, { id: nextInquiryId(list), createdAt: new Date().toISOString(), status: '접수' });
    list.unshift(q);
    const res = write(KEY.inquiries, list);
    return res.ok ? { ok: true, inquiry: q } : res;
  },
  remove(id) {
    write(KEY.inquiries, Inquiries.all().filter(q => q.id !== id));
  },
};

/* ---------- 커뮤니티 ---------- */
const Posts = {
  mine() {
    return read(KEY.posts, []).slice().reverse();
  },
  all() {
    return Posts.mine().concat(POSTS);
  },
  get(id) {
    return Posts.all().find(p => String(p.id) === String(id)) || null;
  },
  add(input) {
    const stored = read(KEY.posts, []);
    const me = Me.get();
    const body = input.body.trim();

    const post = {
      id: 'u' + Date.now().toString(36),
      cat: input.cat,
      title: input.title.trim(),
      body,
      excerpt: body.replace(/\s+/g, ' ').slice(0, 90),
      author: me.name,
      init: me.init,
      date: new Date().toISOString().slice(0, 10),
      views: 0,
      comments: 0,
      likes: 0,
      hot: false,
      mine: true,
    };

    stored.push(post);
    const res = write(KEY.posts, stored);
    if (!res.ok) return { ok: false, full: res.full, post: null };
    return { ok: true, post };
  },
  remove(id) {
    write(KEY.posts, read(KEY.posts, []).filter(p => String(p.id) !== String(id)));
    const all = read(KEY.comments, {});
    delete all[id];
    write(KEY.comments, all);
  },
  /* 조회수 — 사용자 작성 글만 증가시킵니다 */
  countView(id) {
    const stored = read(KEY.posts, []);
    const p = stored.find(x => String(x.id) === String(id));
    if (!p) return;
    p.views = (p.views || 0) + 1;
    write(KEY.posts, stored);
  },
};

/* ---------- 댓글 ---------- */
const Comments = {
  of(postId) {
    return read(KEY.comments, {})[postId] || [];
  },
  add(postId, body) {
    const all = read(KEY.comments, {});
    const me = Me.get();
    const list = all[postId] || [];
    list.push({
      id: 'c' + Date.now().toString(36),
      author: me.name,
      init: me.init,
      body: body.trim(),
      date: new Date().toISOString().slice(0, 10),
    });
    all[postId] = list;
    const res = write(KEY.comments, all);
    return res.ok ? list : null;
  },
  remove(postId, commentId) {
    const all = read(KEY.comments, {});
    all[postId] = (all[postId] || []).filter(c => c.id !== commentId);
    write(KEY.comments, all);
    return all[postId];
  },
  /* 시드 글의 표시용 댓글 수 + 실제 작성된 댓글 수 */
  countFor(post) {
    return (post.comments || 0) + Comments.of(post.id).length;
  },
};

/* ---------- 좋아요 ---------- */
const Likes = {
  all() { return read(KEY.likes, []); },
  has(id) { return Likes.all().indexOf(String(id)) !== -1; },
  toggle(id) {
    const list = Likes.all();
    const key = String(id);
    const i = list.indexOf(key);
    if (i === -1) list.push(key); else list.splice(i, 1);
    write(KEY.likes, list);
    return i === -1;
  },
  countFor(post) {
    return (post.likes || 0) + (Likes.has(post.id) ? 1 : 0);
  },
};

/* ---------- 이미지 축소 ---------- */
/* localStorage 용량이 5MB 안팎이라 원본을 그대로 넣으면 금방 찹니다. */
function resizeImage(file, max = 900, quality = 0.72) {
  return new Promise((resolve, reject) => {
    if (!/^image\//.test(file.type)) {
      reject(new Error('이미지 파일만 올릴 수 있습니다.'));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      let w = img.naturalWidth, h = img.naturalHeight;
      if (w > max || h > max) {
        const s = max / Math.max(w, h);
        w = Math.round(w * s);
        h = Math.round(h * s);
      }
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      try {
        resolve(c.toDataURL('image/jpeg', quality));
      } catch (e) {
        reject(new Error('이미지를 변환하지 못했습니다.'));
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('이미지를 읽을 수 없습니다.'));
    };
    img.src = url;
  });
}

const Store = { Me, Listings, Favs, Inquiries, Posts, Comments, Likes, resizeImage, KEY };

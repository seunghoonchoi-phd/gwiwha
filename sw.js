/* 서비스워커 — 오프라인 지원 + 자동 업데이트
   - 정적 파일: stale-while-revalidate (캐시 즉시 표시 + 백그라운드에서 최신본 갱신)
     → 앱을 새로 배포하면 다음번 실행 때 자동으로 최신 화면이 적용됩니다.
   - questions.json: 네트워크 우선(항상 최신 문제), 오프라인이면 캐시. */
const CACHE = 'gwiwha-v2';
const CORE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './questions.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // 문제 파일: 네트워크 우선(최신), 실패하면 캐시
  if (url.pathname.endsWith('questions.json')) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('./questions.json', copy));
          return res;
        })
        .catch(() => caches.match('./questions.json'))
    );
    return;
  }

  // 그 외 정적 파일: stale-while-revalidate
  e.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(req).then((cached) => {
        const network = fetch(req)
          .then((res) => { cache.put(req, res.clone()); return res; })
          .catch(() => cached || (req.mode === 'navigate' ? cache.match('./index.html') : undefined));
        return cached || network;
      })
    )
  );
});

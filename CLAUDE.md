# Claude Instructions for This Repository

@AGENTS.md

특히 다음 세 가지에서 사고가 난다. 매번 확인할 것.

1. `questions.json` 은 부분만 고친다. 전체를 다시 직렬화해야 한다면 들여쓰기 1칸 + 유니코드 이스케이프 없음(`ensure_ascii=False` / `JSON.stringify(data, null, 1)`)을 지킨다.
2. 한국어를 고쳤으면 `_zh` · `_vi` · `_th` 를 같은 턴에 함께 고친다.
3. 앱 파일을 고쳤으면 `sw.js` 의 캐시 번호를 올리고, `origin` 과 `gw2` **두 리모트 모두** 푸시한다.

커밋 전 `node tools/check-questions.mjs` 를 돌린다.

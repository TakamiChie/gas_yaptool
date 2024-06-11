const {findPlaylistsForVideo, keywordsStr2keywordList} = require("../src/main");
const {searchResult, playLists} = require("./dummydata");
const { keywordsAll } = require("./dummydata.mjs");

describe("正常系", () => {
  it("動画に：でプレイリスト指定、該当のプレイリストあり", () => {
    expect(findPlaylistsForVideo(searchResult[0], playLists).length).toBeGreaterThan(0);
  });

  it("動画に：でプレイリスト指定、該当のプレイリストなし", () => {
    expect(findPlaylistsForVideo(searchResult[1], playLists).length).toBe(0);
  });

  it("動画にプレイリスト指定なし", () => {
    expect(findPlaylistsForVideo(searchResult[2], playLists).length).toBe(0);
  });

  it("動画にハッシュタグでプレイリスト指定、該当のプレイリストあり", () => {
    expect(findPlaylistsForVideo(searchResult[3], playLists).length).toBeGreaterThan(0);
  });

  it("動画にハッシュタグでプレイリスト指定、該当のプレイリストなし", () => {
    expect(findPlaylistsForVideo(searchResult[4], playLists).length).toBe(0);
  });

  it("動画にハッシュタグでプレイリスト指定、該当のプレイリストが複数存在", () => {
    expect(findPlaylistsForVideo(searchResult[5], playLists).length).toBe(2);
  });

  it("動画に：とハッシュタグでプレイリスト指定、該当のプレイリストが一つずつ存在", () => {
    expect(findPlaylistsForVideo(searchResult[6], playLists).length).toBe(2);
  });

  it("動画にキーワードでプレイリスト指定、該当のプレイリストが一つ存在", () => {
    expect(findPlaylistsForVideo(searchResult[8], playLists, keywordsStr2keywordList(keywordsAll)).length).toBe(1);
  });

  it("動画にキーワードでプレイリスト指定、該当のプレイリストが二つ存在", () => {
    expect(findPlaylistsForVideo(searchResult[9], playLists, keywordsStr2keywordList(keywordsAll)).length).toBe(2);
  });

  it("動画にキーワードでプレイリスト指定、該当のプレイリストが片方なし", () => {
    expect(findPlaylistsForVideo(searchResult[10], playLists, keywordsStr2keywordList(keywordsAll)).length).toBe(1);
  });
});


describe("準正常系", () => {
  it("動画にハッシュタグでプレイリスト指定、該当のプレイリストが片方のみ存在", () => {
    expect(findPlaylistsForVideo(searchResult[7], playLists).length).toBe(1);
  });

  it("動画にキーワードとハッシュタグでプレイリスト指定、双方指しているプレイリストが同じ", () => {
    expect(findPlaylistsForVideo(searchResult[11], playLists, keywordsStr2keywordList(keywordsAll)).length).toBe(1);
  });

  it("動画にキーワードと：でプレイリスト指定、双方指しているプレイリストが一部同じ", () => {
    expect(findPlaylistsForVideo(searchResult[12], playLists, keywordsStr2keywordList(keywordsAll)).length).toBe(2);
  });

  it("動画にハッシュタグでプレイリスト指定、該当のプレイリストが一つもない", () => {
    expect(findPlaylistsForVideo(searchResult[13], playLists, keywordsStr2keywordList(keywordsAll)).length).toBe(0);
  });
});

describe("異常系", () => {
  it("動画なし", () => {
    expect(findPlaylistsForVideo(undefined, playLists)).toBeUndefined();
  });

  it("プレイリストなし", () => {
    expect(findPlaylistsForVideo(searchResult[0], []).length).toBe(0);
  });
});

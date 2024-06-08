const {findPlaylistsForVideo} = require("../src/main");
const {searchResult, playLists} = require("./dummydata");

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
});


describe("準正常系", () => {
  it("動画にハッシュタグでプレイリスト指定、該当のプレイリストが片方のみ存在", () => {
    expect(findPlaylistsForVideo(searchResult[7], playLists).length).toBe(1);
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

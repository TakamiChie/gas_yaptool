const {keywordsStr2keywordList} = require("../src/main");

describe("正常系", () => {
  it("指定したキーワードが一つのみ", () => {
    expect(keywordsStr2keywordList("テスト:キーワード")).toMatchObject({"テスト": "キーワード"});
  });

  it("指定したキーワードは二つ", () => {
    expect(keywordsStr2keywordList("テスト:キーワード;テスト2:キーワード2")).toMatchObject({
      "テスト": "キーワード",
      "テスト2": "キーワード2"
    });
  });
});


describe("準正常系", () => {
});

describe("異常系", () => {
  it("キーワード0", () => {
    expect(keywordsStr2keywordList("")).toMatchObject({});
  });

  it("キーワード指定があるが成立していない", () => {
    expect(keywordsStr2keywordList("テスト：キーワード")).toMatchObject({});
  });

  it("同名のキーワードが二つある", () => {
    expect(keywordsStr2keywordList("テスト:キーワード;テスト:キーワード2")).toMatchObject({"テスト": "キーワード2"});
  });
});

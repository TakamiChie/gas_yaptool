/*
 * ダミーデータ配列
 * {Youtube_v3.Youtube.V3.Schema.SearchResult} 動画データ
 */
const searchResult = [];

/*
 * ダミーデータ配列
 * {Youtube_v3.Youtube.V3.Schema.Playlist} プレイリストデータ
 */
const playLists = [];

const keywordsStrs = [];
function addSearchResultData(title, description) {
  const id = searchResult.length + 1;
  searchResult.push({
    kind: "youtube#searchResult",
    etag: "Etag",
    id: {
      kind: "youtube#videoId",
      videoId: `VIDEO_ID_${id}`
    },
    snippet: {
      publishedAt: `PUBLISHED_AT_${id}`,
      channelId: `CHANNEL_ID_${id}`,
      title: title,
      description: description,
      thumbnails: {
        default: {
          url: `THUMBNAIL_URL_${id}-1`,
          width: 120,
          height: 90
        },
        medium: {
          url: `THUMBNAIL_URL_${id}-2`,
          width: 320,
          height: 180
        },
        high: {
          url: `THUMBNAIL_URL_${id}-3`,
          width: 640,
          height: 480
        }
      }
    }
  });
}

function addPlaylistData(title, description="説明文") {
  const id = playLists.length + 1;
  playLists.push({
    kind: "youtube#playlist",
    etag: "Etag",
    id: {
      kind: "youtube#playlistId",
      playlistId: `PLAYLIST_ID_${id}`
    },
    snippet: {
      publishedAt: `PUBLISHED_AT_${id}`,
      channelId: `CHANNEL_ID_${id}`,
      title: title,
      description: description,
      thumbnails: {
        default: {
          url: `THUMBNAIL_URL_${id}-1`,
          width: 120,
          height: 90
        },
        medium: {
          url: `THUMBNAIL_URL_${id}-2`,
          width: 320,
          height: 180
        },
        high: {
          url: `THUMBNAIL_URL_${id}-3`,
          width: 640,
          height: 480
        }
      }
    }
  });
}

addSearchResultData("プレイリストあり：プレイリスト指定あり動画", "説明文");
addSearchResultData("プレイリストなし：プレイリスト指定あり動画", "説明文");
addSearchResultData("プレイリスト指定なし動画", "説明文");
addSearchResultData("ハッシュタグ指定あり動画", "説明文#プレイリストあり");
addSearchResultData("ハッシュタグ指定あり動画", "説明文#プレイリストなし");
addSearchResultData("ハッシュタグ複数指定あり動画", "説明文#プレイリストあり #プレイリスト2");
addSearchResultData("プレイリストあり：ハッシュタグ指定あり動画", "説明文#プレイリスト2");
addSearchResultData("ハッシュタグ複数指定あり動画", "説明文#プレイリストあり #プレイリスト3");
addSearchResultData("キーワード指定ありテスト動画", "タグなし");
addSearchResultData("キーワード指定ありテスト動画試験映像", "タグなし");
addSearchResultData("キーワード指定ありユニーク動画試験映像", "タグなし");
addSearchResultData("キーワード指定ありテスト動画", "タグあり #プレイリストあり");
addSearchResultData("プレイリスト2：キーワード指定ありテスト動画試験映像", "タグなし");
addSearchResultData("キーワード指定ありユニーク動画", "タグなし");
addPlaylistData("プレイリストあり");
addPlaylistData("プレイリスト2");
keywordsStrs.push("テスト動画:プレイリストあり");
keywordsStrs.push("試験映像:プレイリスト2");
keywordsStrs.push("ユニーク動画:プレイリスト3");
const keywordsAll = keywordsStrs.join(";");
module.exports = {searchResult, playLists, keywordsAll};
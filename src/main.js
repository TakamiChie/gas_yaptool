function main(){
  const playlist = getPlaylists();
  const videos = getRecentVideos();
  const addedVideos = [];
  let keywords = undefined;
  if(PropertiesService.getScriptProperties().getProperty("KEYWORDS")){
    keywords = keywordsStr2keywordList(PropertiesService.getScriptProperties().getProperty("KEYWORDS"));
  }
  Array.from(videos).forEach((v) => {
    console.log(`>> ${v.snippet.title}`);
    const playlists = findPlaylistsForVideo(v, playlist, keywords);
    playlists.forEach((playlist) => {
      console.log(`> playlist ${playlist.snippet.title}`);
      if(includeItems(playlist, v)){
        console.log("already added");
      }else{
        console.log("added");
        addPlaylist(playlist, v);
        addedVideos.push({
          "video": v.snippet.title,
          "playlist": playlist.snippet.title
        });
      }
    });
  });
  if(addedVideos.length != 0 && PropertiesService.getScriptProperties().getProperty("MAILTO")){
    const html = HtmlService.createTemplateFromFile("mail");
    let text = "";
    addedVideos.forEach((v) => {
      text += `${v.video} -> ${v.playlist}`;
    });
    html.text = text;
    MailApp.sendEmail({
      to: PropertiesService.getScriptProperties().getProperty("MAILTO"),
      subject: "Youtube Auto Playlist Tool Notification.",
      htmlBody: html.evaluate().getContent()
    })
  }
}

/**
 * 直近20件の動画を取得する。
 * @return {Youtube_v3.Youtube.V3.Schema.SearchResult[]} 直近の動画情報を含む配列。
 */
function getRecentVideos() {
  return YouTube.Search.list(["snippet"], {
    forMine: true,
    maxResults: 20,
    type:[ "video" ]
  }).items;
}

/**
 * プレイリストを取得する。
 * @return {Youtube_v3.Youtube.V3.Schema.Playlist[]} すべてのプレイリストの情報を含む配列。
 */
function getPlaylists(){
  let result = [];
  let rests = NaN;
  let token = "";
  while(isNaN(rests) || rests > 0){
    const pl = YouTube.Playlists.list(["snippet"], {
      mine: true,
      maxResults: 50,
      pageToken: token
    });
    if(isNaN(rests)){
      rests = pl.pageInfo.totalResults;
    }
    rests -= pl.pageInfo.resultsPerPage
    token = pl.nextPageToken;
    result = [...result, ...pl.items];
  }
  return result;
}

/**
 * 動画の情報より。該当するプレイリストを取得する。
 * @param {Youtube_v3.Youtube.V3.Schema.SearchResult} video 動画の情報。
 * @param {Youtube_v3.Youtube.V3.Schema.Playlist[]} playlists すべてのプレイリストの情報を含む配列。
 * @param {Object<string,string>} [keywords] キーワードを示す連想配列
 * @return {Youtube_v3.Youtube.V3.Schema.Playlist[]} 該当するプレイリストの配列。
 */
function findPlaylistsForVideo(video, playlists, keywords){
  if(!video) return;
  let result = [];
  const hashtag_matcher = /#[^\s]+/g;
  // リストタイトル検出
  const findplaylist = (title) => Array.from(playlists).find((list) => list.snippet.title == title);
  if(video.snippet.title.includes("：")){
    const title = video.snippet.title.split("：")[0];
    const item = findplaylist(title);
    if(item) result.push(item);
  }
  // ハッシュタグ検出
  let m = video.snippet.description.match(hashtag_matcher);
  if(m){
    m.forEach((tag) => {
      const item = findplaylist(tag.slice(1));
      if(item) result.push(item);
    });
  }
  // キーワード検出
  if(keywords){
    Object.keys(keywords).forEach((k) => {
      if(video.snippet.title.includes(k)){
        const item = findplaylist(keywords[k]);
        if(item) result.push(item);
      }
    });
  }
  // 重複エントリーの削除
  return [...new Set(result)];
}


/**
 * Google Apps Scriptパラメータのキーワードリストを連想配列に変換する
 * @param {string} keywords キーワードリスト
 * @returns キーワード連想配列
 */
function keywordsStr2keywordList(keywords) {
  const result = {};
  keywords.split(";").forEach((kwd) => {
    const nv = kwd.split(":");
    result[nv[0]] = nv[1];
  })
  return result;
}

/**
 * 指定した動画がプレイリスト内に含まれているかどうかを確認する。
 * @param {Youtube_v3.Youtube.V3.Schema.Playlist} playlist プレイリスト 
 * @param {Youtube_v3.Youtube.V3.Schema.SearchResult} video 動画
 * @return {boolean} 動画がプレイリストに含まれていればtrue。
 */
function includeItems(playlist, video){
  return YouTube.PlaylistItems.list(["snippet"], {
    playlistId: playlist.id,
    videoId: video.id.videoId
  }).items.length != 0;
}

/**
 * プレイリストに動画を追加する。
 * @param {Youtube_v3.Youtube.V3.Schema.Playlist} playlist プレイリスト 
 * @param {Youtube_v3.Youtube.V3.Schema.SearchResult} video 動画
 */
function addPlaylist(playlist, video){
  YouTube.PlaylistItems.insert({
        snippet: {
          playlistId: playlist.id,
          resourceId: {
            videoId: video.id.videoId,
            kind: 'youtube#video'
          }
        }
      }, ["snippet"]);
}

if(typeof module !== "undefined"){
  module.exports = {
    findPlaylistsForVideo, keywordsStr2keywordList
  }
}
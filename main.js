function main(){
  const playlist = getPlaylists();
  const videos = getRecentVideos();
  Array.from(videos).forEach((v) => {
    const p = findPlaylistForVideo(v, playlist);
    if(p){
      console.log(`${v.snippet.title} find by ${p.snippet.title}`);
      if(includeItems(p, v)){
        console.log("already added");
      }else{
        console.log("added");
        addPlaylist(p, v);
      }
    }else{
      console.log(`${v.snippet.title} no playlist`);
    }
  });
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
 * @return {Youtube_v3.Youtube.V3.Schema.Playlist|null} 該当するプレイリスト。プレイリストが見つからない場合はnull。
 */
function findPlaylistForVideo(video, playlists){
  let result = null;
  if(video.snippet.title.includes("：")){
    const title = video.snippet.title.split("：")[0];
    const item = Array.from(playlists).find((list) => list.snippet.title == title);
    if(item) result = item;
  }
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
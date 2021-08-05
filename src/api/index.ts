const baseUrl = 'http://www.liuxuechun.cn:3000'
// const baseUrl = '/couldMusic'
const apiList = {
  searchSongs: baseUrl + '/cloudsearch',
  songsUrl: baseUrl + '/song/url',
  newSongs: baseUrl + '/top/song?type=0',
  hotSongs: baseUrl + '/playlist/detail?id=3778678',
  lyric: baseUrl + '/lyric'
}
export default apiList

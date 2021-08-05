import styles from './index.less';
import React, { useEffect, useRef, useState } from 'react';
import { useRequest } from 'ahooks';
import apiList from '@/api';
import { Icon, InputItem, List, Switch, SegmentedControl } from 'antd-mobile';

import Drawer from '../compoments/Drawer';

export default function IndexPage() {
  const [nameListDefault, setNameListDefault] = useState([]);
  const [open, setOpen] = useState(false)
  const [openPlayList, setOpenPlayList] = useState(false)
  const [jianRong, setJianRong] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [songId, setSongId] = useState('')
  const [songUrl, setSongUrl] = useState('')
  // const [showMoreId, setShowMoreId] = useState('')
  const [play, setPlay] = useState(false)
  const [playList, setPlayList] = useState([])
  const [segIndex, setSegIndex] = useState(0)
  const [segClick, setSegClick] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [scrollStartIndex, setScrollStartIndex] = useState(0)
  const [scrollEndIndex, setScrollEndIndex] = useState(0)
  const [itemHeight, setItemHeight] = useState(44)
  const [clientShowCount, setClientShowCount] = useState(0)
  const [virtualListHeight, setVirtualListHeight] = useState('0px')
  const [translate, setTranslate] = useState('translate3d(0px, 0px, 0px)')
  const [scrollList, setScrollList] = useState([])
  const [lyricContent, setLyricContent] = useState([])
  const [lyricShow, setLyricShow] = useState([])
  const audio:any = useRef()
  const searchInp:any = useRef()
  const searchList:any = useRef()
  const scrollListRef:any = useRef()
  const virtualList:any = useRef()
  const changeDrawer = () => {
    setOpen(!open)
    searchInp.current.focus()
  }
  const changeDrawerList = () => {
    setOpenPlayList(!openPlayList)
  }
  const { run: getHotSongs} = useRequest(apiList.hotSongs, {
    onSuccess: ({result}) => {
      console.log(result);
    },
    manual: true
  })
  const { run: getNewSongs} = useRequest(apiList.newSongs, {
    onSuccess: ({result}) => {
      console.log(result);
    },
    manual: true
  })
  const { run: searchSong, loading: searchLoading } = useRequest(apiList.searchSongs + '?keywords=' + searchValue + '&limit='+limit+'&offset=0', {
    onSuccess: ({result}) => {
      searchList.current.scrollTo(0, 0)
      setNameListDefault(result.songs)
    },
    manual: true
  })
  const { run: searchNextSong, loading: searchNextLoading } = useRequest(apiList.searchSongs + '?keywords=' + searchValue + '&limit='+limit+'&offset=' + Number((page-1) * limit), {
    onSuccess: ({result}) => {
      // @ts-ignore
      setNameListDefault([...nameListDefault, ...result.songs])
    },
    manual: true
  })
  const {run: getSong} = useRequest(apiList.songsUrl + '?id=' + songId, {
    manual: true,
    onSuccess: ({data}) => {
      if(data && data.length) {
        setSongUrl(data[0].url)
        setPlay(true)
        audio.current.play()
      }
    }
  })
  const {run: lyric} = useRequest(apiList.lyric + '?id=' + songId, {
    manual: true,
    onSuccess: ({ lrc }) => {
      computedLyric(lrc.lyric)
    }
  })
  const playSong = (item:any) => {
    const list:any = playList
    if (list.length) {
      const ifInList = list.filter((item0:any) => {
        return item0.id === item.id
      }).length
      if (!ifInList) {
        const index = list.indexOf(list.filter((item1: any) => {
          return item1.id === songId
        })[0])
        list.splice(index + 1, 0, item)
      }
    } else {
      list.push(item)
    }
    setPlayList(list)
    setVirtualListHeight(`${list ? list.length * 44 : 0}px`)
    segIndex == 0 && window.localStorage.setItem('lPlayList', JSON.stringify(list))
    setScrollList(list.slice(scrollStartIndex, scrollEndIndex))
    setSongId(item.id)
    setOpen(false)
  }
  const playListPlaySong = (item:any) => {
    setSongId(item.id)
    setOpen(false)
  }
  const cutSong = (e: any, id: any) => {
    const list = playList.filter(item => {
      // @ts-ignore
      return item.id !== id
    })
    setPlayList(list)
    segIndex == 0 && window.localStorage.setItem('lPlayList', JSON.stringify(list))
    setScrollList(list.slice(scrollStartIndex, scrollEndIndex))
    e.stopPropagation()
  }
  // const moreDo = (e:any, item:any) => {
  //   console.log(666)
  //   setShowMoreId(item.id)
  //   e.stopPropagation()
  // }
  const searchBtn = <Icon color='#ea4f4f' type={searchLoading ? 'loading' : 'search'}/>
  const items = nameListDefault.map((item:any)=> {
    return <List.Item key={item.id} thumb={<img src={require('../assest/img/music.png')} alt='' />} onClick={() => {playSong(item)}}>
      {item.name}-{item.ar.map((ars:any) => {
      return ars.name
    }).join(',')}
    </List.Item>
    // <Popover key={item.id}  visible={item.id === showMoreId} align={{
    //   overflow: { adjustY: 0, adjustX: 0 },
    //   offset: [-13, 0]
    // }} overlay={
    //   [(<Popover.Item className={styles.poItem} icon={<img src={require('../assest/img/play.png')} alt='' />}>
    //     下一首播放
    //   </Popover.Item>),
    //     (<Popover.Item className={styles.poItem} icon={<img src={require('../assest/img/talk.png')} alt='' />}>
    //     评论
    //   </Popover.Item>)]
    // }>
    // </Popover>
  })
  const playItems = scrollList.map((item:any)=> {
    const ar = item.ar || item.artists
    return <List.Item key={item.id} extra={<img onClick={(e) => {cutSong(e, item.id)}} src={require('../assest/img/close.png')}/>} thumb={<img src={songId === item.id ? require('../assest/img/playMusic.png'): require('../assest/img/music.png')} alt='' />} onClick={() => {playListPlaySong(item)}}>
      {item.name}-{ar.map((ars:any) => {
      return ars.name
    }).join(',')}
    </List.Item>
  })
  const playOrStop = () => {
    if (audio.current.paused) {
      audio.current.play()
      setPlay(true)
    }else {
      audio.current.pause()
      setPlay(false)
    }
  }
  const playListHeader = (
    <div>
      播放列表
    </div>
  )
  useEffect(() => {
    if (songId) {
      getSong()
      lyric()
    }
  },[songId])
  const search = (e: any) => {
    if (e.keyCode == 13) {
      searchSong()
    }
  }
  useEffect(() => {
    setVirtualListHeight(`${playList ? playList.length * 44 : 0}px`)
  },[playList])
  useEffect(()=> {
    const itemHeight = 44
    let list = JSON.parse(window.localStorage.getItem('lPlayList')) || []
    const {clientHeight} = scrollListRef.current
    setClientShowCount(Math.ceil(clientHeight / itemHeight))
    setScrollEndIndex(Math.ceil(clientHeight / itemHeight))
    setPlayList(list || [])
    setScrollList(list.slice(0,20))
    setVirtualListHeight(`${list.length * 44}px`)
    window.addEventListener('keypress', search, false)
    return () => {
      window.removeEventListener('keypress', search)
    }
  }, [])
  // const computedSongUrl = (songUrl:string) => {
  //   // http://m7.music.126.net/20210612205449/819f6613b1ad3684dec3dbaecddcadb9/ymusic/45b3/31e0/077c/287bdd496f6282b4f33dc26b585ccd9f.mp3
  //   const url = songUrl.substr(7)
  //   const playUrl = url.split('/')[0]
  //   const index = url.indexOf('/')
  //   const playContent = url.substr(index)
  //   console.log(playContent);
  //   return 'http://127.0.0.1:9528/playMusic' + playContent + '?playUrl=' + playUrl
  // }
  const computedSongUrl = () => {
    return 'https://www.liuxuechun.cn/music/playSong' + '/song/media/outer/url?id='+ songId +'.mp3'
  }
  const fangdou = (fn: any, times: number) => {
    let timer:any = null
    return function() {
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn()
      },times)
    }
  }
  const getNextPage = async() => {
    let {scrollTop,  clientHeight, scrollHeight } = searchList.current
    // console.log(scrollTop, clientHeight, scrollHeight);
    if (scrollHeight - scrollTop - clientHeight <= 20) {
      const pages = page + 1
      await setPage(pages)
      searchNextSong()
    }
  }
  const loopNextSong = () => {
    let playIndex = 0
    playList.forEach((item: any, index) => {
      if (item.id === songId) {
        playIndex = index
        return
      }
    })
    if (playIndex < playList.length - 1) {
      // @ts-ignore
      const nextPlay= playList[playIndex + 1]
      playListPlaySong(nextPlay)
    } else {
      setPlay(false)
    }
  }
  const segChange = async(val: any) => {
    let list = []
    if (val == '播放历史') {
      list = JSON.parse(window.localStorage.getItem('lPlayList'))
      setPlayList(list)
      setSegIndex(0)
      scrollListRef.current.scrollTo(0, 0)
      setScrollList(list && list.slice(0, clientShowCount) || [])
    }else if (val == '新歌速递') {
      setSegIndex(1)
      setPlayList([])
      const newList = JSON.parse(window.sessionStorage.getItem('newSongsList'))
      if (newList && newList.length) {
        list = newList
      } else {
        setSegClick(true)
        const res = await getNewSongs()
        list = res.data
        window.sessionStorage.setItem('newSongsList', JSON.stringify(list))
        setSegClick(false)
      }
      setPlayList(list)
      scrollListRef.current.scrollTo(0, 0)
      setScrollList(list && list.slice(0, clientShowCount) || [])
    } else if (val == '热播榜单') {
      setSegIndex(2)
      setPlayList([])
      const newList = JSON.parse(window.sessionStorage.getItem('hotSongsList'))
      if (newList && newList.length) {
        list = newList
      } else {
        setSegClick(true)
        const res = await getHotSongs()
        list = res.playlist.tracks
        window.sessionStorage.setItem('hotSongsList', JSON.stringify(list))
        setSegClick(false)
      }
      setPlayList(list)
      scrollListRef.current.scrollTo(0, 0)
      setScrollList(list && list.slice(0, clientShowCount) || [])
    }
  }
  const handleScroll = () => {
    // const itemHeight = 44
    const {scrollTop} = scrollListRef.current
    // const clientShowCount = Math.ceil(clientHeight / itemHeight)
    const currentStartIndex = Math.floor(scrollTop / itemHeight)
    const currentEndIndex = Math.min(currentStartIndex + clientShowCount, playList.length)
    setScrollStartIndex(currentStartIndex)
    setScrollEndIndex(currentEndIndex)
    const offset = scrollTop - (scrollTop % itemHeight)
    const arr = playList.slice(currentStartIndex, currentEndIndex)
    setTranslate(`translate3d(0px, ${offset}px, 0px)`)
    setScrollList(arr)
  }
  const computedLyric = (lyric: any) => {
    const arr = lyric.split('\n')
    const lyricArr = arr.filter((item: any) => {
      if (item) {
        return item
      }
    })
    const arrRes = lyricArr.map((item:any) => {
      const time = item.substring(item.indexOf('[') + 1, item.indexOf(']'))
      return {
        time: (time.split(':')[0] * 60 + parseFloat(time.split(':')[1])).toFixed(3),
        content: item.substring(item.indexOf(']') + 1, item.length)
      }
    })
    setLyricContent(arrRes)
  }
  const playLyric = () => {
    const { currentTime } = audio.current
    let show = ''
    for (let i = 0 ; i<lyricContent.length; i++) {
      if (lyricContent[i].time >= currentTime) {
        break
      }
      show = lyricContent[i].content
      setLyricShow(show)
    }
    // lyricContent.forEach((item: any) => {
    //   if (item.time >= currentTime) {
    //     return false
    //   }
    //   show = item.content
    // })
    // setLyricShow(show)
  }
  return (
    <div style={{height: '100%'}}>
      <div className={styles.nav}>
        <div className={styles.listButton} onClick={changeDrawerList}>
          <img src={require('../assest/img/list.png')} alt='' />
        </div>
        <div className={styles.navSearch} onClick={changeDrawer}>点击搜索</div>
        <div className={styles.button} onClick={changeDrawer}>
          <Icon type={'search'} color={"#fff"}/>
        </div>
      </div>
      <div style={{marginTop: '15px', color: '#ea4f4f'}}>
        <Switch checked={jianRong} color={'#ea4f4f'} onChange={() => {setJianRong(!jianRong)}}/> 兼容模式
      </div>
      <div className={styles.lyric}>
        {lyricShow}
      </div>
      <Drawer open={open} position='right' openChange={changeDrawer} style={{width: '80%', height: document.documentElement.clientHeight, display: 'flex', flexDirection: 'column'}}>
        <InputItem className={styles.search} clear value={searchValue} placeholder='搜索' extra={searchBtn} onExtraClick={searchSong} onChange={val => {setSearchValue(val)}} ref={searchInp}/>
        <div ref={searchList} style={{overflow: 'auto', flex: '1'}} onScroll={fangdou(getNextPage, 500)}>
          <List>
            {items || ''}
          </List>
        </div>
      </Drawer>
      <Drawer open={openPlayList} position='left' openChange={changeDrawerList} style={{width: '80%', display: 'flex', flexDirection: 'column'}}>
        <div className={styles.scroll} ref={scrollListRef} style={{overflow: 'auto', flex: '1', position: 'relative'}} onScroll={handleScroll}>
          <div ref={virtualList} style={{position: 'absolute', zIndex: -1, height: virtualListHeight, width: '100%', top: 0, right: 0, left: 0}}></div>
          <List style={{position:'absolute', width: '100%', top: 0, right: 0, left: 0, transform: translate}}>
            {playItems || ''}
          </List>
        </div>
        <SegmentedControl className={styles.ownSegmentedControl} disabled={segClick} selectedIndex={segIndex} values={['播放历史', '新歌速递', '热播榜单']} tintColor='#ea4f4f' onValueChange={segChange}/>
      </Drawer>
      <audio id="audio-element"
             src={jianRong ? computedSongUrl() : songUrl}
             autoPlay
             ref={audio}
             onEnded={() => {loopNextSong()}}
             onTimeUpdate={playLyric}
      >
      </audio>
      <div className={styles.musicBox}>
        <div className={styles.front}>
          <div className={play ? styles.playBtn : styles.stopBtn} onClick={playOrStop}></div>
          <div className={songUrl && play ? styles.openMinC : styles.minC}></div>
          <div className={songUrl && play ? styles.openBigC : styles.bigC}></div>
        </div>
        <div className={styles.bottom}></div>
        <div className={styles.back}></div>
        <div className={styles.top}></div>
        <div className={styles.left}></div>
        <div className={styles.right}></div>
      </div>
    </div>
  );
}

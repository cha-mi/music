import styles from './index.less';
import React, { useState, useEffect, useRef } from 'react';
import { useRequest } from 'ahooks';
import apiList from '@/api';
import { Button, InputItem, Icon, List } from 'antd-mobile';

import Drawer from '../compoments/Drawer';

export default function IndexPage() {
  const [nameListDefault, setNameListDefault] = useState([]);
  const [open, setOpen] = useState(false)
  const [openPlayList, setOpenPlayList] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [songId, setSongId] = useState('')
  const [songUrl, setSongUrl] = useState('')
  const [play, setPlay] = useState(false)
  const [playList, setPlayList] = useState([])
  const audio:any = useRef()
  const changeDrawer = () => {
    setOpen(!open)
  }
  const changeDrawerList = () => {
    setOpenPlayList(!openPlayList)
  }
  const { run: searchSong, loading: searchLoading } = useRequest(apiList.searchSongs + '?keywords=' + searchValue + '&limit=20&offset=1', {
    onSuccess: ({result}) => {
      setNameListDefault(result.songs)
    },
    manual: true
  })
  const {run: getSong} = useRequest(apiList.songsUrl + '?id=' + songId, {
    manual: true,
    onSuccess: ({data}) => {
      setSongUrl(data[0].url)
      setPlay(true)
      console.log(songUrl);
    }
  })
  const searchBtn = <Icon color='#ea4f4f' type={searchLoading ? 'loading' : 'search'}/>
  const items = nameListDefault.map((item:any)=> {
    return <List.Item key={item.id} thumb={<img src={require('../assest/img/music.png')} alt='' />} onClick={() => {
      setSongId(item.id)
      setOpen(false)
    }}>
      {item.name}-{item.ar.map((ars:any) => {
        return ars.name
    }).join(',')}
    </List.Item>
  })
  const playOrStop = () => {
    console.log(audio);
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
    getSong()
  },[songId])
  return (
    <div>
      <Button inline className={styles.button} size='small' type='primary' onClick={changeDrawer} icon={'search'}/>
      <Button inline className={styles.listButton} size='small' type='primary' onClick={changeDrawerList}>
        <img src={require('../assest/img/list.png')} alt='' />
      </Button>
      <Drawer open={open} position='right' openChange={changeDrawer} style={{width: '80%', minHeight: document.documentElement.clientHeight}}>
        <InputItem className={styles.search} clear value={searchValue} placeholder='搜索' extra={searchBtn} onExtraClick={searchSong} onChange={val => {setSearchValue(val)}}/>
        <List>
          {items || ''}
        </List>
      </Drawer>
      <Drawer open={openPlayList} position='left' openChange={changeDrawerList} style={{width: '80%', minHeight: document.documentElement.clientHeight}}>
        <List renderHeader={playListHeader}>
          {items || ''}
        </List>
      </Drawer>
      <audio id="audio-element"
             src={songUrl}
             autoPlay
             ref={audio}
             onEnded={() => {setPlay(false)}}
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

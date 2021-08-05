import React, { useState, useEffect, useRef } from 'react';
import './ScrollList.less'

export default function ScrollList (props: any) {
  let scrollListRef:any = useRef()

  const handleScroll = () => {
    const {scrollTop} = scrollListRef.current
    console.log(scrollTop);
  }
  return <div ref={scrollListRef} className={'scroll-list'} style={props.style || {}} onScroll={handleScroll}>
    {props.children}
  </div>
}

import './Drawer.less'
import React, { useState, useEffect, useRef } from 'react';

export default function Drawer(props: any) {
  const [open, setOpen] = useState(props.open)
  const posLeft = {
    left: open ? 0 : '-100%'
  }
  const posRight = {
    right: open ? 0 : '-100%'
  }
  const pos = props.position === 'left' ? posLeft : posRight
  const style = {
    ...props.style,
    ...pos,
  }
  const drawerRef = useRef(null)
  const setHeight = () => {
    // @ts-ignore
    drawerRef.current.style.height = '100%'
  }
  useEffect(() => {
    setOpen(props.open)
  }, [props.open])
  useEffect(() => {
    window.addEventListener('resize', setHeight, false)
    return () => {
      window.removeEventListener('resize', setHeight)
    }
  })
  return (
    <>
      <div className="my-drawer-remark" onClick={props.openChange} style={{display: open ? 'block' : 'none'}}/>
      <div className="my-drawer" ref={drawerRef} style={style}>
        {props.children}
      </div>
    </>
  );
}

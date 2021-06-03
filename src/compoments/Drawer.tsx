import './Drawer.less'
import React, { useState, useEffect } from 'react';

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
    width: open? props.style.width : 0 ,
  }
  useEffect(() => {
    setOpen(props.open)
  }, [props.open])
  return (
    <>
      <div className="my-drawer-remark" onClick={props.openChange} style={{display: open ? 'block' : 'none'}}/>
      <div className="my-drawer" style={style}>
        {props.children}
      </div>
    </>
  );
}

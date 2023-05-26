import React from 'react'

const PopUpPadding = ({executeClose}) => {
  return (
    <>
                {/* TOP Invisible section for closing popup */}
                <div className="invis_outer_top" onClick={() => {executeClose(); }}/>
            
                {/* LEFT Invisible section for closing popup */}
                <div className="invis_outer_left" onClick={() => {executeClose(); }}/>
    
                {/* RIGHT Invisible section for closing popup */}
                <div className="invis_outer_right" onClick={() => {executeClose(); }}/>
    
                {/* BOTTOM Invisible section for closing popup */}
                <div className="invis_outer_btm" onClick={() => {executeClose(); }}/>
    </>
  )
}

export default PopUpPadding
import React from 'react'

const LengthCount = ({state, threshold}) => {
        return (
          (state < threshold) ?
          <div className="club_length_counter">
            {state} / {threshold}
          </div> :
          <div className="club_length_counter" style={{'color' : 'red'}}>
           ⚠️ {state} / {threshold}
          </div>
        )
}

export default LengthCount
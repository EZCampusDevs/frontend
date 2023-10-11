import React from 'react'

//Note about: `children` prop
//*In React, children is a special prop that refers to any elements that are placed between the opening and closing tags of a JSX element. 
//*Wwithin the context of React components, children has a specific and consistent meaning.

const PopUpWrapper = ({children, onClose}) => {
    
    const handleBackgroundClick = e => {
        if (e.target === e.currentTarget) {
            onClose();
        };
    }
    
    return (
        <div 
        onClick={handleBackgroundClick}
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(5px)',
          zIndex: 9999
        }}>


        {/* INSIDE THE POP UP: */}
        <div 
        style={{
          position: 'relative',
          color: 'whitesmoke',
          backgroundColor: 'rgb(15 23 42)',
          padding: '20px',
          borderRadius: '4px',
          width: '80%',
          maxWidth: '600px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}>

            {children}

        </div>
    </div>
    )
}

export default PopUpWrapper
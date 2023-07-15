import React, { useRef, useEffect, useState } from 'react';

//? The `callback` here will be called upon Scroll to the bottom, this will load in another page

const ScrollableDiv = ({results, callback}) => {
  const divRef = useRef(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = divRef.current;
      if (scrollTop + clientHeight >= scrollHeight) {
        setIsScrolledToBottom(true);
      } else {
        setIsScrolledToBottom(false);
      }
    };

    divRef.current.addEventListener('scroll', handleScroll);

    return () => {
      divRef.current.removeEventListener('scroll', handleScroll);
    };
  }, []);


  //! SCROLLED TO THE BOTTOM TRIGGER: 
  
  useEffect(() => {
    if (isScrolledToBottom) {
      // Call your function or perform desired actions here
      console.log('Scrolled to the bottom');
      callback();
    }
  }, [isScrolledToBottom]);

  return (
    <div
      id="search-box"
      className="overflow-y-scroll scrollbar-thumb-blue-500 scrollbar-track-blue-200 height_cap"
      ref={divRef}
    >
      {results} {/* <-- SEARCH RESULTS */}
    </div>
  );
}

export default ScrollableDiv;

import React, { useRef, useEffect, useState } from 'react';

//? The `callback` here will be called upon Scroll to the bottom, this will load in another page

const ScrollableDiv = ({results, resultsPerPage, callback}) => {
  const divRef = useRef(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const bottomThreshold = 10;

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = divRef.current;
      const offSet = scrollHeight - scrollTop - clientHeight;
      if (offSet <= bottomThreshold) {
        setIsScrolledToBottom(true);
      } else {
        setIsScrolledToBottom(false);
      }
    };

    if(divRef.current) {
      divRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if(divRef.current) {
        divRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [divRef, bottomThreshold]);



  //! SCROLLED TO THE BOTTOM TRIGGER: 
  
  useEffect(() => {
    if (isScrolledToBottom && results.length > resultsPerPage-1) {
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

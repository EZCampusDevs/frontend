import React from 'react'

const PageHeaderDropDown = ({closeHook, sections}) => {
  
  //Adjusting the Invisible close Div below the Dropdown; Based on size of sections

  let topOffset = "top-56";
  let vh = "50%";

  if(sections.length < 4) { //3 Elements or less
    topOffset = "top-32"
    vh = "70%";
  }

  return (
    <>
      <div class="absolute inset-x-0 top-11 h-10vh bg-zinc-700">
        
        {/* SECTIONS */}
        <div class="grid grid-cols-3 gap-4">
          {sections}
        </div>
  
        {/* X BUTTON */}
        <div onClick={closeHook} class="absolute top-2 right-2 cursor-pointer mr-10 text-indigo-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-10 h-10"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>

      </div>
  
      <div
        onClick={closeHook}
        class={"absolute inset-x-0 bg-gradient-to-b from-black to-transparent flex z-50 " + topOffset}
        style={{ opacity: "0.25", height: vh}}
      >
        {/* Content for the div with 75% viewport height goes here */}
      </div>
    </>
  );
  
}

export default PageHeaderDropDown
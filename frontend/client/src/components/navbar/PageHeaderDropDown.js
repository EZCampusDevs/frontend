import React from 'react'

const PageHeaderDropDown = ({closeHook}) => {
  
  
  
  
  
  
    return (
<div class="absolute inset-x-0 top-11 h-10vh bg-blue-200 flex">
  <div class="flex-1 border-r border-gray-300">
    <h2 class="text-lg font-semibold">Column 1</h2>
    <p class="text-sm">Description of column 1</p>
  </div>
  <div class="flex-1 border-r border-gray-300">
    <h2 class="text-lg font-semibold">Column 2</h2>
    <p class="text-sm">Description of column 2</p>
  </div>
  <div class="flex-1">
    <h2 class="text-lg font-semibold">Column 3</h2>
    <p class="text-sm">Description of column 3</p>
  </div>
  <div class="flex-0 p-2 cursor-pointer" onClick={closeHook}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
      <path d="M6 18L18 6M6 6l12 12"></path>
    </svg>
  </div>
</div>

  )
}

export default PageHeaderDropDown
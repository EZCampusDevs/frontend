import React from 'react'

const PageHeaderDropDownSection = ({title, desc, hrefProp}) => {
  return (
    <div class="col-span-1 border-r border-gray-300 p-4 text-indigo-200" onClick={() => {window.location.href = hrefProp}}   style={{ cursor: 'pointer' }}>
        <h2 class="text-lg font-semibold ">{title}</h2>
        <p class="text-sm">{desc}</p>
  </div>
  )
}

export default PageHeaderDropDownSection
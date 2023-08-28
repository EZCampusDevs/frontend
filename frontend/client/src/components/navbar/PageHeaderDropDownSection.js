import React from 'react'

const PageHeaderDropDownSection = ({title, desc, hrefProp}) => {
  return (
    <a href={hrefProp} class="col-span-1 border-r border-gray-300 p-4 text-indigo-200">
      <h2 class="text-lg font-semibold ">
        {title}
      </h2>
      <p class="text-sm">{desc}</p>
    </a>
  )
}

export default PageHeaderDropDownSection
import React from 'react'
import PageHeader from '../components/navbar/PageHeader.js';
import Footer from '../components/footer/Footer.js';

//This page is designed to be used as Terms of Service, Privacy Policy,
//Or any other pages requiring Long-Paragraphs of text.

const TextBlockPage = ({titleStr, paragraphJSX}) => {
  return (
    <>
        <PageHeader/>
        <div className="text_block_main_container r_font">
        <span className="textblock_title">{titleStr}</span><br/>
        <hr/>
        <br/>
            {paragraphJSX}
        </div>
        <Footer/>
    </>
  )
}

export default TextBlockPage
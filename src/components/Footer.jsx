import React from 'react'

const Footer = () => {
  return (
    <div className='flex justify-center items-center p-8'>
        <h2>Created by Manish De</h2>
        <a href="https://github.com/manishde1234">
        <img src="icons8-github-white.svg" alt="github-Profile" height={25} width={25}/>
        </a>
       
        <a href="https://www.linkedin.com/in/manishde2405">
        <img src="icons8-linkedin-white.svg" alt="linkedin-profile" height={25} width={25}/>
        </a>
    </div>
  )
}

export default Footer
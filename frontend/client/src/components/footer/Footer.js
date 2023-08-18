import React from 'react'

const Footer = () => {
  return (
    <footer className="text-center" style={{ marginTop: '100px' }}>
    <div className="container text-muted py-4 py-lg-5">
        <ul className="list-inline">
            <li className="list-inline-item me-4"><a className="link-secondary" href="#">Pricing</a></li>
            <li className="list-inline-item me-4"><a className="link-secondary" href="#">Terms of Service</a></li>
            <li className="list-inline-item"><a className="link-secondary" href="#">Privacy Policy</a></li>
        </ul>
        <ul className="list-inline">
            {/* Your SVG elements can stay as they are */}
            {/* ... */}
        </ul>
        <p className="mb-0 dark:text-white">Copyright © 2023 EZCampus</p>
    </div>
    </footer>
  )
}

export default Footer
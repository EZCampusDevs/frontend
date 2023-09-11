import React from 'react'

const Footer = () => {
  return (
    <footer className="text-center" style={{ marginTop: '100px' }}>
    <div className="container text-muted py-4 py-lg-5">
        <ul className="list-inline">
            {/* <li className="list-inline-item me-4"><a className="link-secondary" href="#">Pricing</a></li> */}
            <li className="list-inline-item me-4"><a className="link-secondary" href="/terms-of-service">Terms of Service</a></li>
            <li className="list-inline-item"><a className="link-secondary" href="/privacy-policy">Privacy Policy</a></li>
        </ul>
        <p className="night_text">Copyright © 2023 EZCampus</p>
    </div>
    </footer>
  )
}

export default Footer
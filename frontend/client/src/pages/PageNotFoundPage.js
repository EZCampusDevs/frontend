import React from 'react'

import PageHeader from '../components/navbar/PageHeader';
import Footer from '../components/footer/Footer';

import '../bootstrap_assets/bootstrap/css/bootstrap.min.css';
import '../bootstrap_assets/css/Banner-Heading-Image-images.css';
import '../bootstrap_assets/css/Footer-Dark-icons.css';

import Error404Pic from '../bootstrap_assets/img/3793096.jpg';

const PageNotFoundPage = () => {
  return (
    <div  lang="en">
    <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no"/>
        <title>Error 404</title>
    </head>

    <PageHeader/>
    <body className="dark:dark_mode_bg">
        <section className="py-4 py-xl-5">
            <div className="container">
                <div className="bg-dark border rounded border-0 border-dark overflow-hidden">
                    <div className="row g-0">
                        <div className="col-md-6">
                            <div className="text-white p-4 p-md-5">
                                <h2 className="fw-bold text-white mb-3">Page Not Found :/</h2>
                                <p className="mb-4">Double check the URL, if it's supposed to work please contact administrators of EZCampus</p>
                                <div className="my-3">
                                    <a className="btn btn-primary btn-lg me-2" role="button" href="#">Home</a>
                                    <a className="btn btn-light btn-lg" role="button" href="#">Report Issue</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 order-first order-md-last" style={{ minHeight: '250px' }}>
                            <img className="w-100 h-100 fit-cover" src={Error404Pic}></img>
                            Free Picture from "FreePix"
                        </div>
                    </div>
                </div>
            </div>

                <Footer/>
        </section>
    </body>
</div>
  )
}

export default PageNotFoundPage
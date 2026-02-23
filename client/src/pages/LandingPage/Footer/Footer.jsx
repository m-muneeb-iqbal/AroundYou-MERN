import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="container mt-0">
        <div className="row footer-section-1">
          <div className="col-md-4 col-12 d-flex justify-content-md-center">
            <p className="h1">About</p>
          </div>

          <div className="col-md-7 col-12 d-flex flex-column justify-content-end">
            <p>
              AROUNDYOU was created by Comsats Under-Graduate student who wanted to
              create a AROUNDYOU community, a place to stay connected with their
              university friends and segment university life onto one all-inclusive
              platform.
            </p>

            <p>
              A private and encrypted social media application to share content,
              posts, stories, search for new friends, encrypted chat and make it
              easier to schedule events with our RSVP feature.
            </p>

            <p>
              AROUNDYOU was created for U, the university students, and alumni to stay
              connected.
            </p>

            <p>
              AROUNDYOU provides 100% User control over content, by allowing you to
              select who sees your content and allowing you to decide for how
              long the content will live before being deleted permanently off
              our servers.
            </p>

            <p>
              We look forward to growing AROUNDYOU and adding new features and
              products over the next few months and would love to hear your
              feedback, so please reach out to us.
            </p>

            <p>Welcome to our AROUNDYOU community,</p>

            <p className="fw-bold">TEAM AROUNDYOU</p>
          </div>
        </div>
      </div>

      <div className="container-fluid px-5 footer-section-2">
        <div className="row">
          <div className="col-lg-10 col-sm-8 col-12 d-flex flex-column">
            <div className="col-lg-10 col-sm-8 col-12 d-flex justify-content-sm-start justify-content-center mt-3">
              <img
                src="../Images/notIcons/edyou-footer.svg"
                alt="aroundyou logo"
                className="img-fluid"
                height="100px"
              />
            </div>

            <div className="col-lg-10 col-sm-8 col-12 d-flex justify-content-sm-start justify-content-center mt-3">
              <div>College Life. Stay Connected</div>
            </div>

            <div className="col-lg-10 col-sm-8 col-12 d-flex justify-content-sm-start justify-content-center mt-sm-3 mb-sm-5 mt-3 mb-1">
              <img
                src="../Images/notIcons/apple-button-footer.svg"
                alt="app store download button"
                className="img-fluid footer-apple-button"
                height="35px"
              />
            </div>
          </div>

          <div className="col-lg-2 col-sm-4 col-12 d-flex justify-content-sm-start justify-content-center">
            <ul className="nav flex-column align-items-sm-start align-items-center mt-sm-3 mt-1">
              <li className="nav-item">
                <a className="nav-link footer-items" href="#">
                  Features
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link footer-items" href="#">
                  About Us
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link footer-items" href="#">
                  Schools
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link footer-items" href="#">
                  Wishlist
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link footer-items" href="#">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-9 col-12 d-flex justify-content-lg-start justify-content-center">
            <p className="no-hover-privacy-policy">
              All rights reserved. AROUNDYOU © 2025
            </p>
          </div>

          <div className="col-lg-3 col-12 d-flex justify-content-center">
            <a href="#" className="footer-items">
              Privacy Policy
            </a>

            <a href="#" className="footer-items">
              <img
                src="../Images/icons/Globe.png"
                className="footer-items"
                alt="globe"
              />
              English
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

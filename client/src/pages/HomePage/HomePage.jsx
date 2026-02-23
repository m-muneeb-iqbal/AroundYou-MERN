import { useEffect, useState } from "react";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";
import { useLocation, useNavigate } from "react-router-dom";

const HomePage = () => {
    return(
        <header>

            <div className="container-fluid">

                <div className="row pt-5 align-items-center">

                    <div className="col-1 text-center">
                        <img
                            src="/Images/HomePage/Header/Home.png"
                            alt="Edyou logo"
                            className="img-fluid"
                        />
                    </div>
                    <div className="col-1 text-center">
                        <img
                            src="/Images/HomePage/Header/three-user.png"
                            alt="Edyou logo"
                            className="img-fluid"
                        />
                    </div>
                    <div className="col-1 text-center">
                        <img
                            src="/Images/HomePage/Header/work.png"
                            alt="Edyou logo"
                            className="img-fluid"
                        />
                    </div>
                    <div className="col-1 text-center">
                        <img
                            src="/Images/HomePage/Header/notification.png"
                            alt="Edyou logo"
                            className="img-fluid"
                        />
                    </div>
                    <div className="col-1 text-center">
                        <img
                            src="/Images/HomePage/Header/chat.png"
                            alt="Edyou logo"
                            className="img-fluid"
                        />
                    </div>
                    <div className="col-1 text-center">
                        <img
                            src="/Images/HomePage/Header/profile.png"
                            alt="Edyou logo"
                            className="img-fluid"
                        />
                    </div>

                </div>

            </div>

        </header>
    );
};

export default HomePage;
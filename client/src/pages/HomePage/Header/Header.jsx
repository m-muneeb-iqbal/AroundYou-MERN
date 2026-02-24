import { House, Users, BriefcaseBusiness, Bell, MessageCircleMore, UserRound, Search } from "lucide-react";

const Header = () => {
    return (
        <div className="row pt-5 align-items-center">

            <div className="col-3">

                <div className="d-flex align-items-center gap-2">
                    <img src="/Images/aroundyou.png" className="img-fluid" alt="aroundyou" style={{ height: "40px", width: "auto" }}/>
                    <div className="position-relative flex-grow-1">

                        <input type="text" className="form-control form-control-sm pe-4" placeholder="Search" style={{ height: "40px", lineHeight: "40px", fontSize: "14px" }}/>
                        <Search color="#04263D" size={20} className="position-absolute top-50 end-0 translate-middle-y me-2" />

                    </div>
                </div>

            </div>

            <div className="col-9 d-flex justify-content-around">
                <House color = "#04263D" role="button" title="Home" size={30}/>
                <Users color = "#04263D" role="button" title="Users" size={30}/>
                <BriefcaseBusiness color = "#04263D" role="button" title="Jobs" size={30}/>
                <Bell color = "#04263D" role="button" title="Notifications" size={30}/>
                <MessageCircleMore color = "#04263D" role="button" title="Messages" size={30}/>
                <UserRound color = "#04263D" role="button" title="Profile" size={30}/>
            </div>

        </div>
    );
};

export default Header;
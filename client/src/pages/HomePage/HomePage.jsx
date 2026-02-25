import Layout from "./Layout/Layout";

import Header from "./Header/Header";
import LeftPanel from "./Main/LeftPanel";
import Middle from "./Main/Middle";
import RightPanel from "./Main/RightPanel.jsx";

const HomePage = () => {
    return(

        <div className="container">

            <Header />

            <Layout 
                left={<LeftPanel />}
                middle={<Middle />}
                right={<RightPanel />}
            />

        </div>

    );
};

export default HomePage;
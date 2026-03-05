import { Container } from "react-bootstrap";

import ThreeColumnLayout from "../../components/layout/ThreeColumnLayout";

import LeftPanel from "./Main/LeftPanel";
import Middle from "./Main/Middle";
import RightPanel from "./Main/RightPanel";

const HomePage = () => {
    
    return(

        <Container>

            <ThreeColumnLayout
                showMessages
                left={<LeftPanel />}
                middle={<Middle />}
                right={<RightPanel />}
            />

        </Container>

    );
};

export default HomePage;
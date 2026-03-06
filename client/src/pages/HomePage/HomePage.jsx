import { Container } from "react-bootstrap";

import ThreeColumnLayout from "../../components/layout/ThreeColumnLayout";

import LeftPanel from "./LeftPanel";
import Middle from "./Middle";
import RightPanel from "./RightPanel";

const HomePage = () => {
    
    return(

        <Container>

            <ThreeColumnLayout
                showMessages
                showSearch
                onSearch={(query) => console.log(query)}
                left={<LeftPanel />}
                middle={<Middle />}
                right={<RightPanel />}
            />

        </Container>

    );
};

export default HomePage;
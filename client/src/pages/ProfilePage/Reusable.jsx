import { Container } from "react-bootstrap";

import Layout from "./Layout/Layout"

import Header from "./Header/Header";
import LeftPanel from "./Main/LeftPanel";
import Middle from "./Main/Middle";

import { useAuthStore} from "../../store/useAuthStore";

const Reusable = () => {

    const { authUser } = useAuthStore();

    return(

        <Container fluid="md">

            <Header />

            <Layout
                left={<LeftPanel authUser={authUser}/>}
                middle={<Middle />}
            />

        </Container>

    );
};

export default Reusable;
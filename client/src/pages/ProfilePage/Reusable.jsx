import { Container } from "react-bootstrap";

import Layout from "./Layout/Layout"

import Header from "./Header/Header";
import Top from "./Main/Top";
import Bottom from "./Main/Bottom";

import { useAuthStore} from "../../store/useAuthStore";

const Reusable = () => {

    const { authUser } = useAuthStore();

    return(

        <Container fluid="md">

            <Header />

            <Layout
                top={<Top authUser={authUser}/>}
                bottom={<Bottom />}
            />

        </Container>

    );
};

export default Reusable;
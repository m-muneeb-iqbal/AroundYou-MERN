import { Container } from "react-bootstrap";

import TwoRowsLayout from "../../components/layout/TwoRowsLayout"

import Top from "./Top/Top";
import Bottom from "./Bottom/Bottom";

import { useAuthStore} from "../../store/useAuthStore";

const ProfilePage = () => {

    const { authUser } = useAuthStore();

    return(

        <Container fluid="md">

            <TwoRowsLayout
                top={<Top authUser={authUser}/>}
                bottom={<Bottom />}
            />

        </Container>

    );
};

export default ProfilePage;
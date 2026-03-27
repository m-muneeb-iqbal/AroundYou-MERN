import { Container } from "react-bootstrap";

import TwoRowsLayout from "../../components/layout/TwoRowsLayout"

import Top from "./Top";
import Bottom from "./Bottom";

import { useAuthStore} from "../../store/useAuthStore";

const ProfilePage = () => {

    const { authUser } = useAuthStore();

    return(

        <Container>

            <TwoRowsLayout
                showMessages
                top={<Top authUser={authUser}/>}
                bottom={<Bottom />}
            />

        </Container>

    );
};

export default ProfilePage;
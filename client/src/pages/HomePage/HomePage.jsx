import { useEffect } from "react";
import { Container } from "react-bootstrap";

import ThreeColumnLayout from "../../components/layout/ThreeColumnLayout";
import { useFriendStore } from "../../store/useFriendStore";

import LeftPanel from "./LeftPanel";
import Feed from "./Feed";
import RightPanel from "./RightPanel";

const HomePage = () => {

    const { fetchNonFriends, isLoadingNonFriends } = useFriendStore();

    useEffect(() => {
        fetchNonFriends();
    }, []);

    return (
        <Container>
            <ThreeColumnLayout
                showMessages
                showSearch
                onSearch={(query) => console.log(query)}
                left={<LeftPanel isLoading={isLoadingNonFriends} />}
                middle={<Feed />}
                right={<RightPanel isLoading={isLoadingNonFriends} />}
            />
        </Container>
    );
};

export default HomePage;
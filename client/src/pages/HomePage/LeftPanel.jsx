import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

import { Settings, Bookmark, UserRoundPlus, SquarePlay } from "lucide-react";
import { Card, ListGroup } from "react-bootstrap";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import ProfileCard from "./ProfileCard/ProfileCard";

const ICON_COLOR = "#797979";
const ICON_SIZE = 20;

const NAV_ITEMS = [
    { icon: SquarePlay, label: "Learning",           path: null         },
    { icon: Bookmark,   label: "Bookmark",           path: null         },
    { icon: UserRoundPlus, label: "Find colleagues", path: null         },
    { icon: Settings,   label: "Settings",           path: "/settings"  },
];

const LeftPanel = ({ isLoading }) => {

    const { authUser } = useAuthStore();
    const navigate = useNavigate();

    if (!authUser) {
        navigate("/");
        return null;
    }

    return (

        <>
            <ProfileCard user={authUser} isLoading={isLoading} />

            <Card className="d-none d-md-block w-100">

                <ListGroup variant="flush">

                    {isLoading ? (

                        Array.from({ length: NAV_ITEMS.length }).map((_, i) => (
                            <ListGroup.Item key={i} className="px-3">
                                <Skeleton height={ICON_SIZE} />
                            </ListGroup.Item>
                        ))

                    ) : (

                        NAV_ITEMS.map(({ icon: Icon, label, path }) => (

                            <ListGroup.Item key={label} action className="px-3 text-start"
                                style={{ cursor: "pointer" }}
                                onClick={path ? () => navigate(path) : undefined}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <Icon color={ICON_COLOR} size={ICON_SIZE} />
                                    <span className="text-muted">{label}</span>
                                </div>

                            </ListGroup.Item>

                        ))

                    )}

                </ListGroup>

            </Card>

        </>

    );

};

export default LeftPanel;
import { PLACEHOLDER_AVATAR } from "../../lib/constants";

const PlaceholderAvatar = ({ name, profilePic, size = 36, border = "2px solid #DEE2E6" }) => (
    <img
        src={profilePic || PLACEHOLDER_AVATAR}
        alt={name}
        style={{
            width: size,
            height: size,
            borderRadius: "50%",
            objectFit: "cover",
            border: border,
        }}
        className="flex-shrink-0"
    />
);

export default PlaceholderAvatar;
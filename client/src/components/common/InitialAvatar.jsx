const InitialsAvatar = ({ name, profilePic, size = 36 }) => {

    const initials = name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?";

    if (profilePic) {
        return (
            <img
                src={profilePic}
                alt={name}
                className="rounded-circle flex-shrink-0"
                style={{
                    width: size,
                    height: size,
                    objectFit: "cover",
                    border: "2px solid #DEE2E6",
                }}
            />
        );
    }

    return (
        <div
            className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
            style={{
                width: size,
                height: size,
                backgroundColor: "#04263D",
                color: "#FFFFFF",
                fontSize: size * 0.35,
                fontWeight: "bold",
            }}
        >
            {initials}
        </div>
    );
};

export default InitialsAvatar;
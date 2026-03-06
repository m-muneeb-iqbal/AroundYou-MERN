const InitialsAvatar = ({ name, size = 36 }) => {

    const initials = name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?";

    return (

        <div
            className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
            style={{
                width: size,
                height: size,
                backgroundColor: "#04263D",
                color: "#ffffff",
                fontSize: size * 0.35,
                fontWeight: "bold",
            }}
        >
            
            {initials}
        </div>

    );
};

export default InitialsAvatar;
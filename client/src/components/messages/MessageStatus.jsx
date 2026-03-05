const MessageStatus = ({ status }) => {

    const bars = [
        { height: 6 },
        { height: 10 },
        { height: 14 },
    ];

    const getBarColor = (barIndex) => {
        const unlit = "#CCCCCC";
        const lit = "#04263D";
        const seen = "#020f18";

        if (status === "sending") return unlit;
        if (status === "sent") return barIndex === 0 ? lit : unlit;
        if (status === "delivered") return barIndex <= 1 ? lit : unlit;
        if (status === "seen") return seen;
        return unlit;
    };

    const isSending = status === "sending";

    return (

        <>
        
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.8; }
                }
            `}</style>

            <span
                className="d-inline-flex align-items-end ms-1"
                style={{
                    gap: "2px",
                    opacity: isSending ? 0.5 : 1,
                    animation: isSending ? "pulse 1.2s ease-in-out infinite" : "none",
                }}
            >
                {bars.map((bar, i) => (

                    <span
                        key={i}
                        style={{
                            width: "3px",
                            height: `${bar.height}px`,
                            borderRadius: "2px",
                            backgroundColor: isSending ? "#CCCCCC" : getBarColor(i),
                            border: isSending ? "1px solid #CCCCCC" : "none",
                            transition: "background-color 0.3s ease",
                            display: "block",
                        }}
                    />
                ))}

            </span>

        </>

    );

};

export default MessageStatus;
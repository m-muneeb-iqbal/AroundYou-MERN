const SectionHeader = ({ label }) => (

    <div
        className="fw-bold mb-2 pb-1"
        style={{
            fontSize: "0.78rem",
            color: "#898C8F",
            borderBottom: "1px solid #f0f0f0",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
        }}
    >
        {label}

    </div>
    
);

export default SectionHeader;
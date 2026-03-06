const ActionButton = ({ children, color, hoverColor, onClick, title, size = 28 }) => (

    <div
        role="button"
        title={title}
        className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
        style={{
            width: size,
            height: size,
            backgroundColor: color,
            transition: "background-color 0.2s",
        }}
        onClick={onClick}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverColor}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = color}
    >

        {children}
        
    </div>

);

export default ActionButton;
const ActionButton = ({ children, color, hoverColor, onClick, title, size = 28, ariaLabel }) => (

    <div
        role="button"
        tabIndex={0}
        aria-label={ariaLabel || title}
        title={title}
        className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
        style={{
            width: size,
            height: size,
            minWidth: 36,
            minHeight: 36,
            backgroundColor: color,
            transition: "background-color 0.2s",
            cursor: "pointer",
        }}
        onClick={onClick}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.(e)}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverColor}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = color}
    >

        {children}
        
    </div>

);

export default ActionButton;
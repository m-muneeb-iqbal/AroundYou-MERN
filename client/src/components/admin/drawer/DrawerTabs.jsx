const DrawerTabs = ({ activeTab, onChange }) => (

    <div className="d-flex" style={{ borderBottom: "1px solid #f0f0f0", flexShrink: 0 }}>

        {["edit", "danger"].map((tab) => (

            <button
                key={tab}
                onClick={() => onChange(tab)}
                style={{
                    flex: 1,
                    border: "none",
                    borderBottom: activeTab === tab ? "2px solid #04263D" : "2px solid transparent",
                    background: "none",
                    padding: "10px",
                    fontSize: "0.85rem",
                    fontWeight: activeTab === tab ? "bold" : "normal",
                    color: activeTab === tab ? "#04263D" : "#898C8F",
                    cursor: "pointer",
                }}
            >

                {tab === "edit" ? "Edit Info" : "Danger Zone"}

            </button>

        ))}

    </div>

);

export default DrawerTabs;
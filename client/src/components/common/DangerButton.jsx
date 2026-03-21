/* eslint-disable no-unused-vars */
import { Button } from "react-bootstrap";

const DangerButton = ({ icon: Icon, label, onClick, confirming, onConfirm, onCancel }) => (

    <div className="d-flex align-items-center justify-content-between py-2" style={{ borderBottom: "1px solid #F5F5F5" }} >

        <div className="d-flex align-items-center gap-2" style={{ fontSize: "0.85rem", color: "#04263D" }}>
            
            <Icon size={15} color="#DC3545" />
            {label}

        </div>

        {confirming ? (

            <div className="d-flex gap-1">

                <Button size="sm" variant="danger" style={{ fontSize: "0.7rem", padding: "2px 8px" }} onClick={onConfirm}>
                    Confirm
                </Button>

                <Button size="sm" variant="outline-secondary" style={{ fontSize: "0.7rem", padding: "2px 8px" }} onClick={onCancel}>
                    Cancel
                </Button>

            </div>

        ) : (

            <Button size="sm" variant="outline-danger" style={{ fontSize: "0.7rem" }} onClick={onClick}>
                Remove
            </Button>

        )}

    </div>

);

export default DangerButton;
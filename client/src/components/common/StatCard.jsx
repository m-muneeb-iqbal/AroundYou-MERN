/* eslint-disable no-unused-vars */
import { Card } from "react-bootstrap";

const StatCard = ({ icon: Icon, label, value, sub, color }) => (

    <Card className="border-0 shadow-sm h-100">

        <Card.Body className="d-flex align-items-center gap-3 p-3">

            <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style={{ width: 48, height: 48, backgroundColor: `${color}18` }} >
                <Icon size={22} color={color} />
            </div>

            <div>

                <div className="text-muted" style={{ fontSize: "0.78rem" }}>{label}</div>
                <div className="fw-bold" style={{ fontSize: "1.3rem", color: "#04263D" }}>
                    {value ?? "—"}
                </div>
                
                {sub && (
                    <div style={{ fontSize: "0.7rem", color: "#898C8F" }}>{sub}</div>
                )}

            </div>

        </Card.Body>

    </Card>

);

export default StatCard;
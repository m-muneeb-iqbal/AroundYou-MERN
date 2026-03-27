import { House } from "lucide-react";

const Feed = () => {
    return (
        <div
            className="d-flex flex-column align-items-center justify-content-center py-5 rounded"
            style={{ minHeight: "200px", border: "2px dashed #E0E0E0", color: "#C0C0C0" }}
        >
            <House size={40} color="#C0C0C0" />
            <p className="mt-3 mb-0" style={{ fontSize: "0.9rem" }}>Feed coming soon</p>
        </div>
    );
};

export default Feed;
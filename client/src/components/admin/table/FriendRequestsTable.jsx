import { Table } from "react-bootstrap";
import { Trash2 } from "lucide-react";

import InitialsAvatar from "../../common/InitialsAvatar";

const FriendRequestsTable = ({ friendRequests, onDelete }) => (

    <Table hover responsive style={{ fontSize: "0.85rem" }}>

        <thead style={{ backgroundColor: "#F8F9FA" }}>

            <tr>
                <th>From</th>
                <th>To</th>
                <th>Sent</th>
                <th></th>
            </tr>

        </thead>

        <tbody>

            {friendRequests.length === 0 ? (

                <tr>
                    <td colSpan={4} className="text-center text-muted py-4">
                        No pending requests
                    </td>
                </tr>

            ) : (

                friendRequests.map((req) => (

                    <tr key={req._id}>

                        <td>
                            <div className="d-flex align-items-center gap-2">
                                <InitialsAvatar name={req.requester.fullName} profilePic={req.requester.profilePic} size={28} />
                                <span>{req.requester.fullName}</span>
                            </div>
                        </td>

                        <td>
                            <div className="d-flex align-items-center gap-2">
                                <InitialsAvatar name={req.recipient.fullName} profilePic={req.recipient.profilePic} size={28} />
                                <span>{req.recipient.fullName}</span>
                            </div>
                        </td>

                        <td className="text-muted align-middle">
                            {new Date(req.createdAt).toLocaleDateString()}
                        </td>

                        <td className="align-middle">
                            <Trash2 size={16} color="#dc3545" role="button" title="Remove request" onClick={() => onDelete(req._id)} />
                        </td>

                    </tr>

                ))
                
            )}

        </tbody>
        
    </Table>

);

export default FriendRequestsTable;
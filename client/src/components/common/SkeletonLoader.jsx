/**
 * SkeletonLoader — reusable shimmer placeholder blocks.
 *
 * Usage:
 *   <SkeletonLoader rows={3} />                → list of user-card skeletons
 *   <SkeletonLoader variant="card" />          → single card skeleton
 *   <SkeletonLoader variant="text" />          → single text line
 *   <SkeletonLoader variant="table-row" rows={10} />  → <tr> skeleton rows for a table <tbody>
 */

// Vary line widths per row so adjacent skeletons look natural, not copy-pasted
const CARD_WIDTHS = [
    ["58%", "38%"],
    ["52%", "43%"],
    ["65%", "35%"],
    ["48%", "40%"],
    ["61%", "36%"],
];

const TABLE_WIDTHS = [
    ["62%", "42%", "55%", "52%", "44%"],
    ["50%", "35%", "40%", "58%", "40%"],
    ["68%", "50%", "45%", "46%", "48%"],
    ["55%", "38%", "50%", "62%", "36%"],
    ["60%", "45%", "48%", "50%", "42%"],
];

const Line = ({ width = "100%", height = 12, className = "", mb = 6 }) => (
    <div
        className={`skeleton ${className}`}
        style={{ width, height, borderRadius: 6, marginBottom: mb }}
    />
);

const UserCardSkeleton = ({ index = 0 }) => {
    const [w1, w2] = CARD_WIDTHS[index % CARD_WIDTHS.length];
    return (
        <div className="d-flex align-items-center gap-2 px-0 py-2">
            <div className="skeleton rounded-circle flex-shrink-0" style={{ width: 40, height: 40 }} />
            <div className="flex-grow-1">
                <Line width={w1} height={12} />
                <Line width={w2} height={10} mb={0} />
            </div>
        </div>
    );
};

const TableRowSkeleton = ({ index = 0 }) => {
    const [w1, w2, w3, w4, w5] = TABLE_WIDTHS[index % TABLE_WIDTHS.length];
    return (
        <tr>
            <td style={{ verticalAlign: "middle", padding: "10px 8px" }}>
                <div className="d-flex align-items-center gap-2">
                    <div className="skeleton rounded-circle flex-shrink-0" style={{ width: 32, height: 32 }} />
                    <div className="flex-grow-1">
                        <Line width={w1} height={11} />
                        <Line width={w2} height={9} mb={0} />
                    </div>
                </div>
            </td>
            <td style={{ verticalAlign: "middle" }}><Line width={w3} height={11} mb={0} /></td>
            <td style={{ verticalAlign: "middle" }}><Line width="28px" height={11} mb={0} /></td>
            <td style={{ verticalAlign: "middle" }}><Line width={w4} height={20} className="rounded-pill" mb={0} /></td>
            <td style={{ verticalAlign: "middle" }}><Line width={w5} height={11} mb={0} /></td>
        </tr>
    );
};

const SkeletonLoader = ({ rows = 4, variant = "user-card" }) => {
    if (variant === "text") return <Line />;

    if (variant === "card") {
        return (
            <div className="p-3">
                <div className="skeleton rounded-circle mb-3" style={{ width: 56, height: 56, margin: "0 auto" }} />
                <Line width="60%" className="mx-auto" />
                <Line width="40%" className="mx-auto" mb={0} />
            </div>
        );
    }

    if (variant === "table-row") {
        return (
            <>
                {Array.from({ length: rows }).map((_, i) => (
                    <TableRowSkeleton key={i} index={i} />
                ))}
            </>
        );
    }

    // Default: user-card list
    return (
        <>
            {Array.from({ length: rows }).map((_, i) => (
                <UserCardSkeleton key={i} index={i} />
            ))}
        </>
    );
};

export default SkeletonLoader;

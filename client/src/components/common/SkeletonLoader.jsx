/**
 * SkeletonLoader — reusable pulsing placeholder blocks.
 *
 * Usage:
 *   <SkeletonLoader rows={3} />          → list of user-card skeletons
 *   <SkeletonLoader variant="card" />    → single card skeleton
 *   <SkeletonLoader variant="text" />    → single text line
 */

const Line = ({ width = "100%", height = 12, className = "" }) => (
    <div
        className={`skeleton ${className}`}
        style={{ width, height, borderRadius: 6, marginBottom: 6 }}
    />
);

const UserCardSkeleton = () => (
    <div className="d-flex align-items-center gap-2 px-0 py-2">
        {/* Avatar */}
        <div className="skeleton rounded-circle flex-shrink-0" style={{ width: 40, height: 40 }} />
        {/* Text lines */}
        <div className="flex-grow-1">
            <Line width="55%" height={12} />
            <Line width="38%" height={10} />
        </div>
    </div>
);

const SkeletonLoader = ({ rows = 4, variant = "user-card" }) => {
    if (variant === "text") return <Line />;

    if (variant === "card") {
        return (
            <div className="p-3">
                <div className="skeleton rounded-circle mb-3" style={{ width: 56, height: 56, margin: "0 auto" }} />
                <Line width="60%" className="mx-auto" />
                <Line width="40%" className="mx-auto" />
            </div>
        );
    }

    // Default: user-card list
    return (
        <>
            {Array.from({ length: rows }).map((_, i) => (
                <UserCardSkeleton key={i} />
            ))}
        </>
    );
};

export default SkeletonLoader;

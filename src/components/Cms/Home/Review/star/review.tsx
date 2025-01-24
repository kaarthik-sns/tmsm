export function renderStars(rating: number) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <span
                key={i}
                className={`${i <= rating ? "text-yellow-500" : "text-gray-300"} text-2xl`}
            >
                &#9733;
            </span>
        );
    }
    return <div className="inline-block">{stars}</div>;
}

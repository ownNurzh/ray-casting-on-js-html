
export function darkenColor(color, factor) {

    let match = color.match(/\d+/g);
    if (!match) return color;

    let [r, g, b] = match.map(Number);
    r = Math.max(0, r * factor);
    g = Math.max(0, g * factor);
    b = Math.max(0, b * factor);

    return `rgb(${r}, ${g}, ${b})`;
}

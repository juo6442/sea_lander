export default {
    /**
     * Returns random number between [min, max)
     * @param min - Range min
     * @param max - Range max
     * @returns Random number
     */
    random: function(min: number, max: number): number {
        return min + Math.floor(Math.random() * (max - min));
    },

    /**
     * Fits the number into the range.
     * @param min - Range min
     * @param max - Range max
     * @returns Arranged number
     */
    fitIn: function(n: number, min: number, max: number): number {
        return Math.min(Math.max(min, n), max);
    },

    /**
     * Return if the number is between [min, max]
     * @param n - number
     * @param min - Range min
     * @param max - Range max
     * @returns True if n is between min and max
     */
    isBetween: function(n: number, min: number, max: number): boolean {
        return min <= n && n <= max;
    },

    /**
     * Convert degree to radian
     * @param degree - Angle in degree
     * @returns Angle in radian
     */
    toRadian: function(degree: number): number {
        return degree * Math.PI / 180;
    },
}

export default {
    /**
     * Returns random numbe between [min, max)
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
     * Convert degree to radian
     * @param degree - Angle in degree
     * @returns Angle in radian
     */
    toRadian: function(degree: number): number {
        return degree * Math.PI / 180;
    },
}

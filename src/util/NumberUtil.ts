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
     * Convert degree to radian
     * @param degree - Angle in degree
     * @returns Angle in radian
     */
    toRadian: function(degree: number): number {
        return degree * Math.PI / 180;
    },
}

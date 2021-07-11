/**
 * @see https://easings.net
 */
export default {
    /**
     * @param x - Animation progress 0 ~ 1
     * @returns Position 0 ~ 1
     */
    easeInOutCubic: function(x: number): number {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    },
}

export function mapBetweenRanges(
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number,
  n: number
) {
  return (n / (fromMax - fromMin)) * (toMax - toMin);
}

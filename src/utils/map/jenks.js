const DEFAULT_JENKS_CLASSES = 5;

const buildJenksBreaks = (values, classCount = DEFAULT_JENKS_CLASSES) => {
  if (!Array.isArray(values) || values.length === 0) {
    return [];
  }

  const sorted = values
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);

  if (sorted.length === 0) {
    return [];
  }

  const nClasses = Math.min(classCount, sorted.length);
  const lowerClassLimits = Array.from({ length: sorted.length + 1 }, () =>
    Array(nClasses + 1).fill(0)
  );
  const varianceCombinations = Array.from({ length: sorted.length + 1 }, () =>
    Array(nClasses + 1).fill(Infinity)
  );

  for (let i = 1; i <= nClasses; i += 1) {
    lowerClassLimits[1][i] = 1;
    varianceCombinations[1][i] = 0;
  }

  for (let l = 2; l <= sorted.length; l += 1) {
    let sum = 0;
    let sumSquares = 0;
    let w = 0;

    for (let m = 1; m <= l; m += 1) {
      const i3 = l - m + 1;
      const val = sorted[i3 - 1];

      w += 1;
      sum += val;
      sumSquares += val * val;

      const variance = sumSquares - (sum * sum) / w;
      const i4 = i3 - 1;

      if (i4 !== 0) {
        for (let j = 2; j <= nClasses; j += 1) {
          if (
            varianceCombinations[l][j] >=
            variance + varianceCombinations[i4][j - 1]
          ) {
            lowerClassLimits[l][j] = i3;
            varianceCombinations[l][j] =
              variance + varianceCombinations[i4][j - 1];
          }
        }
      }
    }

    lowerClassLimits[l][1] = 1;
    varianceCombinations[l][1] = sumSquares - (sum * sum) / w;
  }

  const breaks = Array(nClasses + 1).fill(0);
  breaks[nClasses] = sorted[sorted.length - 1];
  breaks[0] = sorted[0];

  let k = sorted.length;
  for (let countNum = nClasses; countNum > 1; countNum -= 1) {
    const idx = lowerClassLimits[k][countNum] - 1;
    breaks[countNum - 1] = sorted[idx];
    k = lowerClassLimits[k][countNum] - 1;
  }

  for (let i = 1; i < breaks.length; i += 1) {
    if (breaks[i] < breaks[i - 1]) {
      breaks[i] = breaks[i - 1];
    }
  }

  return breaks;
};

export { DEFAULT_JENKS_CLASSES, buildJenksBreaks };

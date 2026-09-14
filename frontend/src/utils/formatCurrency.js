/**
 * Format currency with compact units (Triệu, Tỷ) for clean UI presentation
 * @param {number|string} amount 
 * @returns {{ value: string, unit: string, fullString: string }}
 */
export const formatCompactCurrency = (amount) => {
  const num = Number(amount) || 0;
  const absNum = Math.abs(num);

  if (absNum >= 1_000_000_000) {
    const val = num / 1_000_000_000;
    const formattedVal = val % 1 === 0 ? val.toString() : val.toFixed(1).replace('.', ',');
    return {
      value: formattedVal,
      unit: 'Tỷ',
      fullString: `${formattedVal} Tỷ`
    };
  }

  if (absNum >= 1_000_000) {
    const val = num / 1_000_000;
    const formattedVal = val % 1 === 0 ? val.toString() : val.toFixed(1).replace('.', ',');
    return {
      value: formattedVal,
      unit: 'Triệu',
      fullString: `${formattedVal} Triệu`
    };
  }

  const formattedVal = num.toLocaleString('vi-VN');
  return {
    value: formattedVal,
    unit: 'VNĐ',
    fullString: `${formattedVal} VNĐ`
  };
};

/**
 * Standard full currency string format: 500.000.000 VNĐ
 */
export const formatFullCurrency = (amount) => {
  const num = Number(amount) || 0;
  return `${num.toLocaleString('vi-VN')} VNĐ`;
};

/**
 * 货币工具函数
 */

// 支持的货币列表
export const CURRENCIES = [
  { code: 'CNY', symbol: '¥', name: '人民币' },
  { code: 'USD', symbol: '$', name: '美元' },
  { code: 'EUR', symbol: '€', name: '欧元' },
  { code: 'GBP', symbol: '£', name: '英镑' },
  { code: 'JPY', symbol: '¥', name: '日元' }
];

/**
 * 格式化货币金额
 * @param {number} value - 金额
 * @param {string} currencyCode - 货币代码 (如 'CNY', 'USD')
 * @returns {string} 格式化后的货币字符串
 */
export const formatCurrency = (value, currencyCode = 'CNY') => {
  const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value).replace(currencyCode, currency.symbol);
};

/**
 * 获取货币符号
 * @param {string} currencyCode - 货币代码
 * @returns {string} 货币符号
 */
export const getCurrencySymbol = (currencyCode) => {
  const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  return currency.symbol;
};
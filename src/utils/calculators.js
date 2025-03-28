/**
 * 复利投资计算工具函数
 */

/**
 * 计算复利投资的未来价值
 * @param {number} principal - 初始投资金额
 * @param {number} monthlyContribution - 每月追加投资金额
 * @param {number} annualRate - 年化收益率（百分比，如7表示7%）
 * @param {number} years - 投资年限
 * @param {number} inflationRate - 通货膨胀率（百分比，如2.5表示2.5%）
 * @param {boolean} adjustForInflation - 是否调整通货膨胀
 * @returns {Object} 包含年度投资数据的对象数组
 */
export const calculateCompoundInterest = (
  principal,
  monthlyContribution,
  annualRate,
  years,
  inflationRate = 2.5,
  adjustForInflation = true
) => {
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = years * 12;
  const monthlyInflationRate = inflationRate / 100 / 12;
  
  let currentValue = principal;
  let totalContributions = principal;
  const yearlyData = [];
  
  for (let month = 1; month <= totalMonths; month++) {
    // 添加每月投资
    currentValue += monthlyContribution;
    totalContributions += monthlyContribution;
    
    // 计算当月收益
    currentValue *= (1 + monthlyRate);
    
    // 每年记录一次数据
    if (month % 12 === 0) {
      const yearIndex = month / 12;
      const inflationAdjustmentFactor = adjustForInflation 
        ? Math.pow(1 + monthlyInflationRate, month) 
        : 1;
      
      const inflationAdjustedValue = currentValue / inflationAdjustmentFactor;
      
      yearlyData.push({
        year: new Date().getFullYear() + yearIndex,
        age: null, // 可以根据用户输入的当前年龄计算
        totalInvestment: totalContributions,
        investmentValue: currentValue,
        inflationAdjustedValue: inflationAdjustedValue,
      });
    }
  }
  
  return {
    yearlyProjections: yearlyData,
    finalInvestmentValue: yearlyData[yearlyData.length - 1].investmentValue,
    totalContributions: totalContributions,
    totalGrowth: yearlyData[yearlyData.length - 1].investmentValue - totalContributions
  };
};

/**
 * 计算多种投资类型的组合收益
 * @param {number} principal - 初始投资金额
 * @param {number} monthlyContribution - 每月追加投资金额
 * @param {Array} allocation - 投资分配数组，每个元素包含类型、百分比和预期收益率
 * @param {number} years - 投资年限
 * @param {number} inflationRate - 通货膨胀率
 * @returns {Object} 包含年度投资数据的对象数组，按投资类型分类
 */
export const calculateMixedInvestment = (
  principal,
  monthlyContribution,
  allocation,
  years,
  inflationRate = 2.5
) => {
  // 验证分配百分比总和是否为100%
  const totalPercentage = allocation.reduce((sum, item) => sum + item.percentage, 0);
  if (Math.abs(totalPercentage - 100) > 0.01) {
    throw new Error('投资分配百分比总和必须为100%');
  }
  
  // 计算每种投资类型的初始金额和每月投资
  const investments = allocation.map(item => ({
    type: item.type,
    principal: principal * (item.percentage / 100),
    monthlyContribution: monthlyContribution * (item.percentage / 100),
    annualRate: item.expectedReturn,
    percentage: item.percentage
  }));
  
  // 分别计算每种投资类型的收益
  const results = investments.map(investment => ({
    type: investment.type,
    percentage: investment.percentage,
    result: calculateCompoundInterest(
      investment.principal,
      investment.monthlyContribution,
      investment.annualRate,
      years,
      inflationRate
    )
  }));
  
  // 合并结果
  const yearlyProjections = [];
  for (let i = 0; i < years; i++) {
    const yearData = {
      year: new Date().getFullYear() + i + 1,
      totalInvestment: 0,
      investmentValue: 0,
      inflationAdjustedValue: 0,
      breakdown: {}
    };
    
    results.forEach(result => {
      const yearResult = result.result.yearlyProjections[i];
      yearData.totalInvestment += yearResult.totalInvestment;
      yearData.investmentValue += yearResult.investmentValue;
      yearData.inflationAdjustedValue += yearResult.inflationAdjustedValue;
      yearData.breakdown[result.type] = {
        value: yearResult.investmentValue,
        adjustedValue: yearResult.inflationAdjustedValue
      };
    });
    
    yearlyProjections.push(yearData);
  }
  
  // 计算总体结果
  const finalInvestmentValue = yearlyProjections[yearlyProjections.length - 1].investmentValue;
  const totalContributions = yearlyProjections[yearlyProjections.length - 1].totalInvestment;
  
  return {
    yearlyProjections,
    finalInvestmentValue,
    totalContributions,
    totalGrowth: finalInvestmentValue - totalContributions,
    breakdown: results.map(result => ({
      type: result.type,
      percentage: result.percentage,
      value: result.result.finalInvestmentValue
    }))
  };
};

/**
 * 计算税后投资收益
 * @param {Object} investmentResult - 投资计算结果
 * @param {number} taxRate - 税率（百分比，如15表示15%）
 * @returns {Object} 税后投资结果
 */
export const calculateAfterTaxReturns = (investmentResult, taxRate) => {
  const taxRateDecimal = taxRate / 100;
  
  const afterTaxYearlyProjections = investmentResult.yearlyProjections.map((yearData, index, array) => {
    // 计算当年增长
    const previousValue = index > 0 ? array[index - 1].investmentValue : 0;
    const yearlyContribution = index > 0 
      ? yearData.totalInvestment - array[index - 1].totalInvestment 
      : yearData.totalInvestment;
    const growth = yearData.investmentValue - previousValue - yearlyContribution;
    
    // 计算应税金额（仅对增长部分征税）
    const taxableAmount = growth;
    const taxAmount = taxableAmount * taxRateDecimal;
    
    // 税后价值
    const afterTaxValue = yearData.investmentValue - taxAmount;
    
    return {
      ...yearData,
      growth,
      taxAmount,
      afterTaxValue
    };
  });
  
  const finalAfterTaxValue = afterTaxYearlyProjections[afterTaxYearlyProjections.length - 1].afterTaxValue;
  
  return {
    ...investmentResult,
    yearlyProjections: afterTaxYearlyProjections,
    finalAfterTaxValue,
    totalTaxPaid: investmentResult.finalInvestmentValue - finalAfterTaxValue
  };
};
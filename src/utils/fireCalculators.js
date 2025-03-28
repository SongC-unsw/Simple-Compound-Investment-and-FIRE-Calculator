/**
 * FIRE（财务独立提前退休）计算工具函数
 */

/**
 * 计算FIRE所需资金
 * @param {number} annualExpenses - 年度支出
 * @param {number} withdrawalRate - 提款率（百分比，如4表示4%）
 * @param {number} safetyMargin - 安全边际（百分比，如10表示10%）
 * @returns {number} FIRE所需资金
 */
export const calculateFireNumber = (annualExpenses, withdrawalRate, safetyMargin = 0) => {
  const safetyFactor = 1 + (safetyMargin / 100);
  return (annualExpenses * safetyFactor) / (withdrawalRate / 100);
};

/**
 * 计算达到FIRE目标所需的年限
 * @param {number} currentSavings - 当前储蓄
 * @param {number} fireNumber - FIRE所需资金
 * @param {number} annualSavings - 年度储蓄金额
 * @param {number} expectedReturnRate - 预期年化收益率（百分比，如7表示7%）
 * @returns {number} 达到FIRE目标所需的年限
 */
export const calculateYearsToFire = (
  currentSavings,
  fireNumber,
  annualSavings,
  expectedReturnRate
) => {
  const monthlyRate = expectedReturnRate / 100 / 12;
  const monthlySavings = annualSavings / 12;
  
  let savings = currentSavings;
  let months = 0;
  
  while (savings < fireNumber && months < 1200) { // 最多计算100年
    savings = savings * (1 + monthlyRate) + monthlySavings;
    months++;
  }
  
  return months / 12;
};

/**
 * 计算FIRE后的提款策略
 * @param {number} initialPortfolio - 初始投资组合价值
 * @param {number} annualExpenses - 年度支出
 * @param {number} withdrawalRate - 提款率（百分比，如4表示4%）
 * @param {number} expectedReturnRate - 预期年化收益率（百分比，如7表示7%）
 * @param {number} inflationRate - 通货膨胀率（百分比，如2.5表示2.5%）
 * @param {string} strategy - 提款策略（'constantDollar', 'constantPercentage', 'percentageOfPortfolio'）
 * @param {number} years - 模拟年数
 * @returns {Object} 提款策略模拟结果
 */
export const simulateWithdrawalStrategy = (
  initialPortfolio,
  annualExpenses,
  withdrawalRate,
  expectedReturnRate,
  inflationRate,
  strategy = 'constantDollar',
  years = 30
) => {
  const initialWithdrawal = strategy === 'percentageOfPortfolio' 
    ? initialPortfolio * (withdrawalRate / 100)
    : annualExpenses;
  
  let portfolio = initialPortfolio;
  let currentExpenses = annualExpenses;
  let currentWithdrawal = initialWithdrawal;
  
  const yearlyData = [];
  
  for (let year = 1; year <= years; year++) {
    // 根据策略计算当年提款金额
    switch (strategy) {
      case 'constantDollar':
        // 固定金额提款，考虑通货膨胀
        currentWithdrawal = annualExpenses * Math.pow(1 + inflationRate / 100, year - 1);
        break;
      case 'constantPercentage':
        // 固定百分比提款
        currentWithdrawal = portfolio * (withdrawalRate / 100);
        break;
      case 'percentageOfPortfolio':
        // 投资组合百分比提款，有上下限
        const baseWithdrawal = portfolio * (withdrawalRate / 100);
        const inflationAdjustedInitial = initialWithdrawal * Math.pow(1 + inflationRate / 100, year - 1);
        // 设置上限和下限（例如，不超过初始提款的1.5倍，不低于初始提款的0.8倍）
        const upperLimit = inflationAdjustedInitial * 1.5;
        const lowerLimit = inflationAdjustedInitial * 0.8;
        currentWithdrawal = Math.min(Math.max(baseWithdrawal, lowerLimit), upperLimit);
        break;
      default:
        // 默认使用constantDollar策略
        currentWithdrawal = annualExpenses * Math.pow(1 + inflationRate / 100, year - 1);
    }
    
    // 确保提款不超过投资组合价值
    currentWithdrawal = Math.min(currentWithdrawal, portfolio);
    
    // 从投资组合中提款
    portfolio -= currentWithdrawal;
    
    // 计算当年投资回报
    const annualReturn = portfolio * (expectedReturnRate / 100);
    portfolio += annualReturn;
    
    // 更新通货膨胀调整后的支出
    currentExpenses = annualExpenses * Math.pow(1 + inflationRate / 100, year);
    
    // 记录当年数据
    yearlyData.push({
      year: new Date().getFullYear() + year,
      portfolioValue: portfolio,
      withdrawal: currentWithdrawal,
      inflationAdjustedExpenses: currentExpenses,
      withdrawalRate: (currentWithdrawal / portfolio) * 100,
      portfolioGrowth: annualReturn
    });
    
    // 如果投资组合耗尽，提前结束模拟
    if (portfolio <= 0) {
      break;
    }
  }
  
  // 计算成功率（投资组合是否在模拟期结束时仍有价值）
  const isSuccessful = portfolio > 0;
  const finalPortfolioValue = isSuccessful ? portfolio : 0;
  const survivalYears = yearlyData.length;
  
  return {
    strategy,
    initialPortfolio,
    initialWithdrawal,
    withdrawalRate,
    yearlyData,
    finalPortfolioValue,
    survivalYears,
    isSuccessful
  };
};

/**
 * 计算FIRE计划的可持续性
 * @param {number} initialPortfolio - 初始投资组合价值
 * @param {number} annualExpenses - 年度支出
 * @param {number} withdrawalRate - 提款率（百分比，如4表示4%）
 * @param {Array} returnRateScenarios - 不同收益率情景的数组
 * @param {number} inflationRate - 通货膨胀率（百分比，如2.5表示2.5%）
 * @param {number} simulationYears - 模拟年数
 * @returns {Object} 可持续性分析结果
 */
export const analyzeSustainability = (
  initialPortfolio,
  annualExpenses,
  withdrawalRate,
  returnRateScenarios,
  inflationRate = 2.5,
  simulationYears = 50
) => {
  // 模拟不同收益率情景
  const scenarioResults = returnRateScenarios.map(scenario => {
    const result = simulateWithdrawalStrategy(
      initialPortfolio,
      annualExpenses,
      withdrawalRate,
      scenario.returnRate,
      inflationRate,
      'constantDollar',
      simulationYears
    );
    
    return {
      scenario: scenario.name,
      returnRate: scenario.returnRate,
      probability: scenario.probability,
      result
    };
  });
  
  // 计算加权成功率
  const weightedSuccessRate = scenarioResults.reduce((sum, scenario) => {
    return sum + (scenario.result.isSuccessful ? scenario.probability : 0);
  }, 0);
  
  // 计算平均存活年数
  const averageSurvivalYears = scenarioResults.reduce((sum, scenario) => {
    return sum + (scenario.result.survivalYears * scenario.probability);
  }, 0);
  
  // 找出最佳和最差情景
  const bestScenario = scenarioResults.reduce((best, current) => {
    return current.result.finalPortfolioValue > best.result.finalPortfolioValue ? current : best;
  }, scenarioResults[0]);
  
  const worstScenario = scenarioResults.reduce((worst, current) => {
    return current.result.finalPortfolioValue < worst.result.finalPortfolioValue ? current : worst;
  }, scenarioResults[0]);
  
  return {
    initialPortfolio,
    annualExpenses,
    withdrawalRate,
    inflationRate,
    simulationYears,
    scenarioResults,
    weightedSuccessRate,
    averageSurvivalYears,
    bestScenario,
    worstScenario,
    sustainabilityScore: weightedSuccessRate * 100 // 0-100分
  };
};
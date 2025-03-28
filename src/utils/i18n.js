import React, { createContext, useContext, useState } from 'react';

// 支持的语言
export const SUPPORTED_LANGUAGES = [
  { code: 'zh-CN', display: '简体中文' },
  { code: 'zh-TW', display: '繁體中文' },
  { code: 'en', display: 'English' },
  { code: 'ja', display: '日本語' }
];

// 翻译资源
const translations = {
  'zh-CN': {
    nav: {
      appTitle: '复利FIRE计算器',
      compound: '复利计算',
      fire: 'FIRE计算',
      settings: '设置'
    },
    common: {
      noData: '无数据可显示'
    },
    calculator: {
      compoundTitle: '复利计算器',
      compoundDescription: '计算不同投资参数下的复利增长',
      inputParameters: '输入参数',
      initialAmount: '初始投资金额',
      monthlyContribution: '每月追加投资',
      annualReturn: '年化收益率',
      years: '投资年限',
      yearsUnit: '年',
      inflationRate: '通货膨胀率',
      adjustInflation: '考虑通货膨胀',
      saveCalculation: '保存计算',
      calculationError: '计算过程中出错: ',
      saveError: '保存计算结果失败',
      saveSuccess: '计算已保存',
      investmentSummary: '投资概览',
      finalValue: '最终价值',
      totalContributions: '总投资',
      totalGrowth: '总收益',
      returnMultiple: '收益倍数',
      growthChart: '增长图表',
      inflationAdjusted: '通胀调整后价值',
      compoundCalculation: '复利投资计算'
    },
    fire: {
      title: 'FIRE计算器',
      description: '计算财务独立和提前退休所需资金和时间',
      personalInfoSection: '个人信息', // 使用自然语言描述
      currentAge: '当前年龄',
      currentSavings: '当前储蓄',
      annualIncome: '年收入',
      annualExpenses: '年支出',
      annualSavings: '年储蓄',
      expectedReturn: '预期收益率',
      withdrawalRate: '提款率',
      safetyMargin: '安全边际',
      fireNumber: 'FIRE目标金额',
      yearsToFire: '达到FIRE所需年数',
      fireAge: 'FIRE年龄',
      ageUnit: '岁',
      savingsRate: '储蓄率',
      firePath: 'FIRE路径',
      withdrawalStrategy: '提款策略可持续性分析',
      calculationError: '计算过程中出错: ',
      saveError: '保存计算结果失败',
      saveSuccess: '计算已保存',
      saveCalculation: '保存计算',
      calculationName: 'FIRE计算',
      basedOn: '基于',
      fireGoal: 'FIRE目标',
      withdrawalAmount: '提款金额',
      portfolioValue: '投资组合价值',
      achieved: '已达成',
      years: '年',
      inflationRate: '通货膨胀率' // 添加fire.inflationRate翻译
    },
    settings: {
      title: '设置',
      languageSettings: '语言设置',
      currencySettings: '货币设置',
      dataManagement: '数据管理',
      selectLanguage: '选择语言',
      selectCurrency: '选择货币',
      loadCalculations: '加载保存的计算',
      export: '导出',
      delete: '删除',
      exportAll: '导出所有',
      deleteSuccess: '计算已删除',
      deleteError: '删除计算失败',
      exportError: '导出计算失败',
      exportAllError: '导出所有计算失败'
    },
    pdf: {
      exportToPDF: '导出为PDF',
      generatedOn: '生成日期',
      exportedFrom: '导出自',
      exportSuccess: 'PDF导出成功',
      exportError: 'PDF导出失败'
    }
  },
  'zh-TW': {
    nav: {
      appTitle: '複利FIRE計算器',
      compound: '複利計算',
      fire: 'FIRE計算',
      settings: '設置'
    },
    common: {
      noData: '無數據可顯示'
    },
    calculator: {
      compoundTitle: '複利計算器',
      compoundDescription: '計算不同投資參數下的複利增長',
      inputParameters: '輸入參數',
      initialAmount: '初始投資金額',
      monthlyContribution: '每月追加投資',
      annualReturn: '年化收益率',
      years: '投資年限',
      yearsUnit: '年',
      inflationRate: '通貨膨脹率',
      adjustInflation: '考慮通貨膨脹',
      saveCalculation: '保存計算',
      calculationError: '計算過程中出錯: ',
      saveError: '保存計算結果失敗',
      saveSuccess: '計算已保存',
      investmentSummary: '投資概覽',
      finalValue: '最終價值',
      totalContributions: '總投資',
      totalGrowth: '總收益',
      returnMultiple: '收益倍數',
      growthChart: '增長圖表',
      inflationAdjusted: '通脹調整後價值',
      compoundCalculation: '複利投資計算'
    },
    fire: {
      title: 'FIRE計算器',
      description: '計算財務獨立和提前退休所需資金和時間',
      personalInfoSection: '個人信息', // 使用自然语言描述
      currentAge: '當前年齡',
      currentSavings: '當前儲蓄',
      annualIncome: '年收入',
      annualExpenses: '年支出',
      annualSavings: '年儲蓄',
      expectedReturn: '預期收益率',
      withdrawalRate: '提款率',
      safetyMargin: '安全邊際',
      fireNumber: 'FIRE目標金額',
      yearsToFire: '達到FIRE所需年數',
      fireAge: 'FIRE年齡',
      ageUnit: '歲',
      savingsRate: '儲蓄率',
      firePath: 'FIRE路徑',
      withdrawalStrategy: '提款策略可持續性分析',
      calculationError: '計算過程中出錯: ',
      saveError: '保存計算結果失敗',
      saveSuccess: '計算已保存',
      saveCalculation: '保存計算',
      calculationName: 'FIRE計算',
      basedOn: '基於',
      fireGoal: 'FIRE目標',
      withdrawalAmount: '提款金額',
      portfolioValue: '投資組合價值',
      achieved: '已達成',
      years: '年',
      inflationRate: '通貨膨脹率' // 添加fire.inflationRate翻译
    },
    settings: {
      title: '設置',
      languageSettings: '語言設置',
      currencySettings: '貨幣設置',
      dataManagement: '數據管理',
      selectLanguage: '選擇語言',
      selectCurrency: '選擇貨幣',
      loadCalculations: '加載保存的計算',
      export: '導出',
      delete: '刪除',
      exportAll: '導出所有',
      deleteSuccess: '計算已刪除',
      deleteError: '刪除計算失敗',
      exportError: '導出計算失敗',
      exportAllError: '導出所有計算失敗'
    },
    pdf: {
      exportToPDF: '導出為PDF',
      generatedOn: '生成日期',
      exportedFrom: '導出自',
      exportSuccess: 'PDF導出成功',
      exportError: 'PDF導出失敗'
    }
  },
  'en': {
    nav: {
      appTitle: 'Compound FIRE Calculator',
      compound: 'Compound',
      fire: 'FIRE',
      settings: 'Settings'
    },
    common: {
      noData: 'No data to display'
    },
    calculator: {
      compoundTitle: 'Compound Interest Calculator',
      compoundDescription: 'Calculate compound growth with different investment parameters',
      inputParameters: 'Input Parameters',
      initialAmount: 'Initial Investment',
      monthlyContribution: 'Monthly Contribution',
      annualReturn: 'Annual Return',
      years: 'Investment Years',
      yearsUnit: 'years',
      inflationRate: 'Inflation Rate',
      adjustInflation: 'Adjust for Inflation',
      saveCalculation: 'Save Calculation',
      calculationError: 'Error during calculation: ',
      saveError: 'Failed to save calculation',
      saveSuccess: 'Calculation saved',
      investmentSummary: 'Investment Summary',
      finalValue: 'Final Value',
      totalContributions: 'Total Contributions',
      totalGrowth: 'Total Growth',
      returnMultiple: 'Return Multiple',
      growthChart: 'Growth Chart',
      inflationAdjusted: 'Inflation Adjusted Value',
      compoundCalculation: 'Compound Investment'
    },
    fire: {
      title: 'FIRE Calculator',
      description: 'Calculate time and money needed for Financial Independence and Early Retirement',
      personalInfoSection: 'Personal Information', // 使用自然语言描述
      currentAge: 'Current Age',
      currentSavings: 'Current Savings',
      annualIncome: 'Annual Income',
      annualExpenses: 'Annual Expenses',
      annualSavings: 'Annual Savings',
      expectedReturn: 'Expected Return',
      withdrawalRate: 'Withdrawal Rate',
      safetyMargin: 'Safety Margin',
      fireNumber: 'FIRE Number',
      yearsToFire: 'Years to FIRE',
      fireAge: 'FIRE Age',
      ageUnit: 'years old',
      savingsRate: 'Savings Rate',
      firePath: 'Path to FIRE',
      withdrawalStrategy: 'Withdrawal Strategy Sustainability',
      calculationError: 'Error during calculation: ',
      saveError: 'Failed to save calculation',
      saveSuccess: 'Calculation saved',
      saveCalculation: 'Save Calculation',
      calculationName: 'FIRE Calculation',
      basedOn: 'based on',
      fireGoal: 'FIRE Goal',
      withdrawalAmount: 'Withdrawal Amount',
      portfolioValue: 'Portfolio Value',
      achieved: 'Achieved',
      years: 'years',
      inflationRate: 'Inflation Rate' // 添加fire.inflationRate翻译
    },
    settings: {
      title: 'Settings',
      languageSettings: 'Language Settings',
      currencySettings: 'Currency Settings',
      dataManagement: 'Data Management',
      selectLanguage: 'Select Language',
      selectCurrency: 'Select Currency',
      loadCalculations: 'Load Saved Calculations',
      export: 'Export',
      delete: 'Delete',
      exportAll: 'Export All',
      deleteSuccess: 'Calculation deleted',
      deleteError: 'Failed to delete calculation',
      exportError: 'Failed to export calculation',
      exportAllError: 'Failed to export all calculations'
    },
    pdf: {
      exportToPDF: 'Export to PDF',
      generatedOn: 'Generated on',
      exportedFrom: 'Exported from',
      exportSuccess: 'PDF exported successfully',
      exportError: 'Failed to export PDF'
    }
  },
  'ja': {
    nav: {
      appTitle: '複利FIRE計算機',
      compound: '複利計算',
      fire: 'FIRE計算',
      settings: '設定'
    },
    common: {
      noData: 'データがありません'
    },
    calculator: {
      compoundTitle: '複利計算機',
      compoundDescription: '異なる投資パラメータでの複利成長を計算',
      inputParameters: '入力パラメータ',
      initialAmount: '初期投資額',
      monthlyContribution: '毎月の追加投資',
      annualReturn: '年間利回り',
      years: '投資期間',
      yearsUnit: '年',
      inflationRate: 'インフレ率',
      adjustInflation: 'インフレ調整',
      saveCalculation: '計算を保存',
      calculationError: '計算中にエラーが発生しました: ',
      saveError: '計算の保存に失敗しました',
      saveSuccess: '計算が保存されました',
      investmentSummary: '投資概要',
      finalValue: '最終価値',
      totalContributions: '総投資額',
      totalGrowth: '総成長',
      returnMultiple: 'リターン倍率',
      growthChart: '成長チャート',
      inflationAdjusted: 'インフレ調整後価値',
      compoundCalculation: '複利投資計算'
    },
    fire: {
      title: 'FIRE計算機',
      description: '経済的自立と早期退職に必要な時間とお金を計算',
      personalInfoSection: '個人情報', // 使用自然语言描述
      currentAge: '現在の年齢',
      currentSavings: '現在の貯蓄',
      annualIncome: '年間収入',
      annualExpenses: '年間支出',
      annualSavings: '年間貯蓄',
      expectedReturn: '期待収益率',
      withdrawalRate: '引き出し率',
      safetyMargin: '安全マージン',
      fireNumber: 'FIRE数値',
      yearsToFire: 'FIREまでの年数',
      fireAge: 'FIRE年齢',
      ageUnit: '歳',
      savingsRate: '貯蓄率',
      firePath: 'FIREへの道',
      withdrawalStrategy: '引き出し戦略の持続可能性',
      calculationError: '計算中にエラーが発生しました: ',
      saveError: '計算の保存に失敗しました',
      saveSuccess: '計算が保存されました',
      saveCalculation: '計算を保存',
      calculationName: 'FIRE計算',
      basedOn: 'に基づく',
      fireGoal: 'FIRE目標',
      withdrawalAmount: '引出金額',
      portfolioValue: 'ポートフォリオ価値',
      achieved: '達成済み',
      years: '年',
      inflationRate: 'インフレ率' // 添加fire.inflationRate翻译
    },
    settings: {
      title: '設定',
      languageSettings: '言語設定',
      currencySettings: '通貨設定',
      dataManagement: 'データ管理',
      selectLanguage: '言語を選択',
      selectCurrency: '通貨を選択',
      loadCalculations: '保存された計算を読み込む',
      export: 'エクスポート',
      delete: '削除',
      exportAll: 'すべてエクスポート',
      deleteSuccess: '計算が削除されました',
      deleteError: '計算の削除に失敗しました',
      exportError: '計算のエクスポートに失敗しました',
      exportAllError: 'すべての計算のエクスポートに失敗しました'
    },
    pdf: {
      exportToPDF: 'PDFにエクスポート',
      generatedOn: '生成日',
      exportedFrom: 'エクスポート元',
      exportSuccess: 'PDFのエクスポートに成功しました',
      exportError: 'PDFのエクスポートに失敗しました'
    }
  }
};

// 创建上下文
const I18nContext = createContext();

// 提供者组件
export const I18nProvider = ({ children }) => {
  const [language, setLanguage] = useState('zh-CN');
  
  const t = (key) => {
    const keys = key.split('.');
    let result = translations[language];
    
    for (const k of keys) {
      result = result?.[k];
      if (!result) break;
    }
    
    return result || key;
  };
  
  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

// 自定义hook
export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

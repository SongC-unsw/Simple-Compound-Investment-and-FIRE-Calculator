/**
 * 本地存储工具函数
 */

const STORAGE_KEY = 'investment_fire_calculator_data';

/**
 * 保存数据到本地存储
 * @param {Object} data - 要保存的数据
 * @returns {boolean} 是否保存成功
 */
export const saveToLocalStorage = (data) => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serializedData);
    return true;
  } catch (error) {
    console.error('保存数据到本地存储失败:', error);
    return false;
  }
};

/**
 * 从本地存储加载数据
 * @returns {Object|null} 加载的数据，如果没有数据则返回null
 */
export const loadFromLocalStorage = () => {
  try {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (serializedData === null) {
      return null;
    }
    return JSON.parse(serializedData);
  } catch (error) {
    console.error('从本地存储加载数据失败:', error);
    return null;
  }
};

/**
 * 从本地存储删除数据
 * @returns {boolean} 是否删除成功
 */
export const removeFromLocalStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('从本地存储删除数据失败:', error);
    return false;
  }
};

/**
 * 保存计算结果到本地存储
 * @param {string} name - 计算名称
 * @param {Object} inputParams - 输入参数
 * @param {Object} results - 计算结果
 * @returns {boolean} 是否保存成功
 */
export const saveCalculation = (name, inputParams, results) => {
  const timestamp = new Date().toISOString();
  const calculation = {
    id: `calc_${Date.now()}`,
    name,
    timestamp,
    inputParams,
    results
  };
  
  // 加载现有数据
  const existingData = loadFromLocalStorage() || { calculations: [] };
  
  // 添加新计算
  existingData.calculations.push(calculation);
  
  // 保存回本地存储
  return saveToLocalStorage(existingData);
};

/**
 * 获取所有保存的计算
 * @returns {Array} 计算数组
 */
export const getAllCalculations = () => {
  const data = loadFromLocalStorage();
  return data ? data.calculations || [] : [];
};

/**
 * 根据ID获取特定计算
 * @param {string} id - 计算ID
 * @returns {Object|null} 计算对象，如果未找到则返回null
 */
export const getCalculationById = (id) => {
  const calculations = getAllCalculations();
  return calculations.find(calc => calc.id === id) || null;
};

/**
 * 删除特定计算
 * @param {string} id - 计算ID
 * @returns {boolean} 是否删除成功
 */
export const deleteCalculation = (id) => {
  const data = loadFromLocalStorage();
  if (!data || !data.calculations) {
    return false;
  }
  
  const index = data.calculations.findIndex(calc => calc.id === id);
  if (index === -1) {
    return false;
  }
  
  data.calculations.splice(index, 1);
  return saveToLocalStorage(data);
};

/**
 * 导出计算数据为JSON文件
 * @param {string} id - 计算ID，如果为null则导出所有计算
 * @returns {boolean} 是否导出成功
 */
export const exportCalculationToJson = (id = null) => {
  try {
    let dataToExport;
    
    if (id) {
      dataToExport = getCalculationById(id);
      if (!dataToExport) {
        return false;
      }
    } else {
      dataToExport = { calculations: getAllCalculations() };
    }
    
    const serializedData = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([serializedData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = id ? `calculation_${id}.json` : 'all_calculations.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('导出计算数据失败:', error);
    return false;
  }
};

/**
 * 导入计算数据
 * @param {File} file - JSON文件
 * @returns {Promise<boolean>} 是否导入成功的Promise
 */
export const importCalculationFromJson = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        
        // 验证导入的数据格式
        if (importedData.calculations) {
          // 导入多个计算
          const existingData = loadFromLocalStorage() || { calculations: [] };
          
          // 合并计算，避免重复
          const existingIds = new Set(existingData.calculations.map(calc => calc.id));
          importedData.calculations.forEach(calc => {
            if (!existingIds.has(calc.id)) {
              existingData.calculations.push(calc);
            }
          });
          
          saveToLocalStorage(existingData);
          resolve(true);
        } else if (importedData.id) {
          // 导入单个计算
          const existingData = loadFromLocalStorage() || { calculations: [] };
          
          // 检查是否已存在
          const exists = existingData.calculations.some(calc => calc.id === importedData.id);
          if (!exists) {
            existingData.calculations.push(importedData);
            saveToLocalStorage(existingData);
          }
          
          resolve(true);
        } else {
          reject(new Error('无效的导入数据格式'));
        }
      } catch (error) {
        console.error('解析导入数据失败:', error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      console.error('读取文件失败:', error);
      reject(error);
    };
    
    reader.readAsText(file);
  });
};

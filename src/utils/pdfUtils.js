import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * 将指定DOM元素导出为PDF
 * @param {string} elementId - 要导出的DOM元素ID
 * @param {string} fileName - PDF文件名
 * @param {Object} options - 配置选项
 * @param {string} options.title - PDF标题
 * @param {string} options.description - PDF描述
 * @param {Object} options.currency - 货币对象
 * @param {Function} options.t - 国际化翻译函数
 */
export const exportToPDF = async (elementId, fileName, options = {}) => {
  try {
    const { title, description, currency, t } = options;
    const element = document.getElementById(elementId);
    
    if (!element) {
      console.error('Element not found:', elementId);
      return false;
    }
    
    // 创建PDF文档
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    
    // 添加标题和描述
    if (title) {
      pdf.setFontSize(18);
      pdf.text(title, margin, margin + 10);
    }
    
    if (description) {
      pdf.setFontSize(12);
      pdf.text(description, margin, margin + 20);
    }
    
    // 添加生成日期
    const date = new Date();
    const dateStr = date.toLocaleDateString();
    pdf.setFontSize(10);
    pdf.text(`${t ? t('pdf.generatedOn') : 'Generated on'}: ${dateStr}`, margin, margin + 30);
    
    // 转换DOM为图像
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    // 计算图像尺寸以适应页面
    const imgWidth = pageWidth - (margin * 2);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // 添加图像到PDF
    pdf.addImage(imgData, 'PNG', margin, margin + 35, imgWidth, imgHeight);
    
    // 添加页脚
    const footerText = `${t ? t('pdf.exportedFrom') : 'Exported from'} ${window.location.hostname}`;
    pdf.setFontSize(8);
    pdf.text(footerText, margin, pageHeight - margin);
    
    // 保存PDF
    pdf.save(`${fileName}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    return false;
  }
};
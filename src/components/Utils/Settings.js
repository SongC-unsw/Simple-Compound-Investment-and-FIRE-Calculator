import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import { getAllCalculations, deleteCalculation, exportCalculationToJson } from '../../utils/storageUtils';
import { CURRENCIES } from '../../utils/currencyUtils';
import { useCurrency } from '../../contexts/CurrencyContext';
import { SUPPORTED_LANGUAGES, useI18n } from '../../utils/i18n';

const Settings = () => {
  const [calculations, setCalculations] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { currency, setCurrency } = useCurrency();
  const { language, setLanguage, t } = useI18n();

  // 加载保存的计算
  const loadCalculations = () => {
    const savedCalculations = getAllCalculations();
    setCalculations(savedCalculations);
  };

  // 删除计算
  const handleDelete = (id) => {
    const success = deleteCalculation(id);
    if (success) {
      setSuccess(t('settings.deleteSuccess'));
      setTimeout(() => setSuccess(''), 3000);
      loadCalculations();
    } else {
      setError(t('settings.deleteError'));
    }
  };

  // 导出计算
  const handleExport = (id) => {
    const success = exportCalculationToJson(id);
    if (!success) {
      setError(t('settings.exportError'));
    }
  };

  // 导出所有计算
  const handleExportAll = () => {
    const success = exportCalculationToJson();
    if (!success) {
      setError(t('settings.exportAllError'));
    }
  };

  // 处理货币变更
  const handleCurrencyChange = (e) => {
    const newCurrency = CURRENCIES.find(c => c.code === e.target.value) || CURRENCIES[0];
    setCurrency(newCurrency);
  };

  // 处理语言变更
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('settings.title')}
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('settings.languageSettings')}
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>{t('settings.selectLanguage')}</InputLabel>
          <Select
            value={language}
            label={t('settings.selectLanguage')}
            onChange={handleLanguageChange}
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <MenuItem key={lang.code} value={lang.code}>
                {lang.display}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('settings.currencySettings')}
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>{t('settings.selectCurrency')}</InputLabel>
          <Select
            value={currency.code}
            label={t('settings.selectCurrency')}
            onChange={handleCurrencyChange}
          >
            {CURRENCIES.map((curr) => (
              <MenuItem key={curr.code} value={curr.code}>
                {curr.name} ({curr.symbol})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('settings.dataManagement')}
        </Typography>

        <Button 
          variant="contained" 
          onClick={loadCalculations}
          sx={{ mb: 2 }}
        >
          {t('settings.loadCalculations')}
        </Button>

        {calculations.length > 0 && (
          <>
            <Box sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
              {calculations.map((calc) => (
                <Paper key={calc.id} sx={{ p: 2, mb: 1 }}>
                  <Typography variant="subtitle1">{calc.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(calc.timestamp).toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => handleExport(calc.id)}
                    >
                      {t('settings.export')}
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="error" 
                      size="small"
                      onClick={() => handleDelete(calc.id)}
                    >
                      {t('settings.delete')}
                    </Button>
                  </Box>
                </Paper>
              ))}
            </Box>

            <Button 
              variant="outlined" 
              onClick={handleExportAll}
            >
              {t('settings.exportAll')}
            </Button>
          </>
        )}
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}
    </Box>
  );
};

export default Settings;
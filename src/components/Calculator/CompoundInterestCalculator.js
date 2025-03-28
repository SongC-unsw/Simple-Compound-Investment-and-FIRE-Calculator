import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Slider,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  Alert,
  useTheme,
  InputAdornment
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { calculateCompoundInterest } from '../../utils/calculators';
import { saveCalculation } from '../../utils/storageUtils';
import { exportToPDF } from '../../utils/pdfUtils';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useI18n } from '../../utils/i18n';
import InvestmentResultsChart from '../Charts/InvestmentResultsChart';

const CompoundInterestCalculator = () => {
  const [inputs, setInputs] = useState({
    principal: 100000,
    monthlyContribution: 1000,
    annualRate: 7,
    years: 20,
    inflationRate: 2.5,
    adjustForInflation: true
  });

  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { currency } = useCurrency();
  const { t } = useI18n();
  const theme = useTheme();

  // 当输入变化时重新计算
  useEffect(() => {
    try {
      const calculationResults = calculateCompoundInterest(
        inputs.principal,
        inputs.monthlyContribution,
        inputs.annualRate,
        inputs.years,
        inputs.inflationRate,
        inputs.adjustForInflation
      );
      setResults(calculationResults);
      setError('');
    } catch (err) {
      setError(t('calculator.calculationError') + err.message);
      setResults(null);
    }
  }, [inputs, t]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value.replace(/,/g, '')) || 0
    }));
  };

  const handleSliderChange = (name) => (e, value) => {
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (e) => {
    setInputs(prev => ({
      ...prev,
      adjustForInflation: e.target.checked
    }));
  };

  const handleSaveCalculation = () => {
    if (!results) return;

    const success = saveCalculation(
      t('calculator.compoundCalculation'),
      inputs,
      results
    );

    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setError(t('calculator.saveError'));
    }
  };

  const handleExportToPDF = async () => {
    if (!results) return;
    
    const success = await exportToPDF(
      'compound-results',
      `compound-investment-${new Date().getTime()}`,
      {
        title: t('calculator.compoundTitle'),
        description: t('calculator.compoundDescription'),
        currency,
        t
      }
    );
    
    if (success) {
      // 显示成功消息
      setError('');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      // 显示错误消息
      setError(t('pdf.exportError'));
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value).replace(currency.code, currency.symbol);
  };

  // 添加千分符格式化函数
  const formatNumberWithCommas = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        {t('calculator.compoundTitle')}
      </Typography>
      <Typography variant="body1" paragraph color="text.secondary">
        {t('calculator.compoundDescription')}
      </Typography>

      <Grid container spacing={3}>
        {/* 输入表单 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              {t('calculator.inputParameters')}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>{t('calculator.initialAmount')}</Typography>
              <TextField
                fullWidth
                name="principal"
                value={formatNumberWithCommas(inputs.principal)}
                onChange={handleInputChange}
                size="small"
                InputProps={{
                  startAdornment: <InputAdornment position="start">{currency.symbol}</InputAdornment>
                }}
              />
              <Slider
                value={inputs.principal}
                onChange={handleSliderChange('principal')}
                min={0}
                max={1000000}
                step={10000}
                valueLabelDisplay="auto"
                valueLabelFormat={value => formatCurrency(value)}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>{t('calculator.monthlyContribution')}</Typography>
              <TextField
                fullWidth
                name="monthlyContribution"
                value={formatNumberWithCommas(inputs.monthlyContribution)}
                onChange={handleInputChange}
                size="small"
                InputProps={{
                  startAdornment: <InputAdornment position="start">{currency.symbol}</InputAdornment>
                }}
              />
              <Slider
                value={inputs.monthlyContribution}
                onChange={handleSliderChange('monthlyContribution')}
                min={0}
                max={10000}
                step={100}
                valueLabelDisplay="auto"
                valueLabelFormat={value => formatCurrency(value)}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>{t('calculator.annualReturn')}</Typography>
              <TextField
                fullWidth
                name="annualRate"
                type="number"
                value={inputs.annualRate}
                onChange={handleInputChange}
                size="small"
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }}
              />
              <Slider
                value={inputs.annualRate}
                onChange={handleSliderChange('annualRate')}
                min={0}
                max={15}
                step={0.1}
                valueLabelDisplay="auto"
                valueLabelFormat={value => `${value}%`}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>{t('calculator.years')}</Typography>
              <TextField
                fullWidth
                name="years"
                type="number"
                value={inputs.years}
                onChange={handleInputChange}
                size="small"
                InputProps={{
                  endAdornment: <InputAdornment position="end">{t('calculator.yearsUnit')}</InputAdornment>
                }}
              />
              <Slider
                value={inputs.years}
                onChange={handleSliderChange('years')}
                min={1}
                max={50}
                step={1}
                valueLabelDisplay="auto"
                valueLabelFormat={value => `${value}${t('calculator.yearsUnit')}`}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>{t('calculator.inflationRate')}</Typography>
              <TextField
                fullWidth
                name="inflationRate"
                type="number"
                value={inputs.inflationRate}
                onChange={handleInputChange}
                size="small"
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }}
              />
              <Slider
                value={inputs.inflationRate}
                onChange={handleSliderChange('inflationRate')}
                min={0}
                max={10}
                step={0.1}
                valueLabelDisplay="auto"
                valueLabelFormat={value => `${value}%`}
              />
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={inputs.adjustForInflation}
                  onChange={handleSwitchChange}
                  name="adjustForInflation"
                />
              }
              label={t('calculator.adjustInflation')}
            />

            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveCalculation}
                disabled={!results}
                fullWidth
                size="large"
              >
                {t('calculator.saveCalculation')}
              </Button>
            </Box>

            {saveSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {t('calculator.saveSuccess')}
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* 结果展示 */}
        <Grid item xs={12} md={8}>
          {results && (
            <Box id="compound-results">
              <Paper sx={{ p: 3, mb: 3, borderRadius: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {t('calculator.investmentSummary')}
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={handleExportToPDF}
                    size="small"
                  >
                    {t('pdf.exportToPDF')}
                  </Button>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Card sx={{ height: '100%', borderRadius: 4 }}>
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          {t('calculator.finalValue')}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                          {formatCurrency(results.finalInvestmentValue)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Card sx={{ height: '100%', borderRadius: 4 }}>
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          {t('calculator.totalContributions')}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                          {formatCurrency(results.totalContributions)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Card sx={{ height: '100%', borderRadius: 4 }}>
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          {t('calculator.totalGrowth')}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                          {formatCurrency(results.totalGrowth)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Card sx={{ height: '100%', borderRadius: 4 }}>
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          {t('calculator.returnMultiple')}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                          {(results.finalInvestmentValue / results.totalContributions).toFixed(2)}x
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Paper>

              <Paper sx={{ p: 3, borderRadius: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {t('calculator.growthChart')}
                </Typography>

                <Box sx={{ height: 400 }}>
                  <InvestmentResultsChart data={results.yearlyProjections} currency={currency} />
                </Box>
              </Paper>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompoundInterestCalculator;
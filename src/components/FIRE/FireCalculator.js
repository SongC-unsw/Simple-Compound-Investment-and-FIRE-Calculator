import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Slider,
  Card,
  CardContent,
  Alert,
  useTheme,
  useMediaQuery,
  InputAdornment
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { calculateFireNumber, calculateYearsToFire, simulateWithdrawalStrategy } from '../../utils/fireCalculators';
import { saveCalculation } from '../../utils/storageUtils';
import { exportToPDF } from '../../utils/pdfUtils';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useI18n } from '../../utils/i18n';
import FireProjectionChart from '../Charts/FireProjectionChart';
import WithdrawalStrategyChart from '../Charts/WithdrawalStrategyChart';

const FireCalculator = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [inputs, setInputs] = useState({
    currentAge: 30,
    currentSavings: 100000,
    annualIncome: 100000,
    annualExpenses: 60000,
    annualSavings: 40000,
    expectedReturnRate: 7,
    withdrawalRate: 4,
    safetyMargin: 10,
    inflationRate: 2.5
  });

  const [results, setResults] = useState(null);
  const [withdrawalResults, setWithdrawalResults] = useState(null);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { currency } = useCurrency();
  const { t } = useI18n();

  // 计算FIRE结果
  useEffect(() => {
    try {
      const fireNumber = calculateFireNumber(
        inputs.annualExpenses,
        inputs.withdrawalRate,
        inputs.safetyMargin
      );

      const yearsToFire = calculateYearsToFire(
        inputs.currentSavings,
        fireNumber,
        inputs.annualSavings,
        inputs.expectedReturnRate
      );

      const fireAge = inputs.currentAge + yearsToFire;

      // 模拟提款策略
      const withdrawalSimulation = simulateWithdrawalStrategy(
        fireNumber,
        inputs.annualExpenses,
        inputs.withdrawalRate,
        inputs.expectedReturnRate,
        inputs.inflationRate,
        'percentageOfPortfolio',
        50
      );

      setResults({
        fireNumber,
        yearsToFire,
        fireAge,
        currentSavings: inputs.currentSavings,
        annualSavings: inputs.annualSavings
      });

      setWithdrawalResults(withdrawalSimulation);
      setError('');
    } catch (err) {
      setError(t('fire.calculationError') + err.message);
      setResults(null);
      setWithdrawalResults(null);
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

  const handleSaveCalculation = () => {
    if (!results) return;
    
    const success = saveCalculation(
      t('fire.calculationName'),
      inputs,
      { ...results, withdrawalResults }
    );
    
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setError(t('fire.saveError'));
    }
  };

  const handleExportToPDF = async () => {
    if (!results) return;
    
    const success = await exportToPDF(
      'fire-results',
      `fire-calculation-${new Date().getTime()}`,
      {
        title: t('fire.title'),
        description: t('fire.description'),
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
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        {t('fire.title')}
      </Typography>
      <Typography variant="body1" paragraph color="text.secondary">
        {t('fire.description')}
      </Typography>
      
      <Grid container spacing={isMobile ? 1 : 3}>
        {/* 输入表单 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              {t('fire.personalInfoSection')}
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>{t('fire.currentAge')}</Typography>
              <TextField
                fullWidth
                name="currentAge"
                type="number"
                value={inputs.currentAge}
                onChange={handleInputChange}
                size="small"
              />
              <Slider
                value={inputs.currentAge}
                onChange={handleSliderChange('currentAge')}
                min={18}
                max={80}
                step={1}
                valueLabelDisplay="auto"
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>{t('fire.currentSavings')}</Typography>
              <TextField
                fullWidth
                name="currentSavings"
                value={formatNumberWithCommas(inputs.currentSavings)}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">{currency.symbol}</InputAdornment>
                }}
                size="small"
              />
              <Slider
                value={inputs.currentSavings}
                onChange={handleSliderChange('currentSavings')}
                min={0}
                max={1000000}
                step={10000}
                valueLabelDisplay="auto"
                valueLabelFormat={value => formatCurrency(value)}
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>{t('fire.annualIncome')}</Typography>
              <TextField
                fullWidth
                name="annualIncome"
                value={formatNumberWithCommas(inputs.annualIncome)}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">{currency.symbol}</InputAdornment>
                }}
                size="small"
              />
              <Slider
                value={inputs.annualIncome}
                onChange={handleSliderChange('annualIncome')}
                min={0}
                max={500000}
                step={1000}
                valueLabelDisplay="auto"
                valueLabelFormat={value => formatCurrency(value)}
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>{t('fire.annualExpenses')}</Typography>
              <TextField
                fullWidth
                name="annualExpenses"
                value={formatNumberWithCommas(inputs.annualExpenses)}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">{currency.symbol}</InputAdornment>
                }}
                size="small"
              />
              <Slider
                value={inputs.annualExpenses}
                onChange={handleSliderChange('annualExpenses')}
                min={0}
                max={300000}
                step={1000}
                valueLabelDisplay="auto"
                valueLabelFormat={value => formatCurrency(value)}
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>{t('fire.annualSavings')}</Typography>
              <TextField
                fullWidth
                name="annualSavings"
                value={formatNumberWithCommas(inputs.annualSavings)}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">{currency.symbol}</InputAdornment>
                }}
                size="small"
              />
              <Slider
                value={inputs.annualSavings}
                onChange={handleSliderChange('annualSavings')}
                min={0}
                max={200000}
                step={1000}
                valueLabelDisplay="auto"
                valueLabelFormat={value => formatCurrency(value)}
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>{t('fire.expectedReturn')}</Typography>
              <TextField
                fullWidth
                name="expectedReturnRate"
                type="number"
                value={inputs.expectedReturnRate}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }}
                size="small"
              />
              <Slider
                value={inputs.expectedReturnRate}
                onChange={handleSliderChange('expectedReturnRate')}
                min={0}
                max={15}
                step={0.1}
                valueLabelDisplay="auto"
                valueLabelFormat={value => `${value}%`}
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>{t('fire.withdrawalRate')}</Typography>
              <TextField
                fullWidth
                name="withdrawalRate"
                type="number"
                value={inputs.withdrawalRate}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }}
                size="small"
              />
              <Slider
                value={inputs.withdrawalRate}
                onChange={handleSliderChange('withdrawalRate')}
                min={1}
                max={10}
                step={0.1}
                valueLabelDisplay="auto"
                valueLabelFormat={value => `${value}%`}
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>{t('fire.safetyMargin')}</Typography>
              <TextField
                fullWidth
                name="safetyMargin"
                type="number"
                value={inputs.safetyMargin}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }}
                size="small"
              />
              <Slider
                value={inputs.safetyMargin}
                onChange={handleSliderChange('safetyMargin')}
                min={0}
                max={30}
                step={1}
                valueLabelDisplay="auto"
                valueLabelFormat={value => `${value}%`}
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>{t('fire.inflationRate')}</Typography>
              <TextField
                fullWidth
                name="inflationRate"
                type="number"
                value={inputs.inflationRate}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }}
                size="small"
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
            
            <Button 
              variant="contained"
              color="primary" 
              onClick={handleSaveCalculation}
              disabled={!results}
              fullWidth
              sx={{ mt: 2 }}
            >
              {t('fire.saveCalculation')}
            </Button>
            
            {saveSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {t('fire.saveSuccess')}
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
            <Box id="fire-results">
              <Paper sx={{ p: 3, mb: 3, borderRadius: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {t('fire.fireGoal')}
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
                
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <Card sx={{ height: '100%', borderRadius: 4 }}>
                      <CardContent>
                        <Typography variant="subtitle2" color="textSecondary">
                          {t('fire.fireNumber')}
                        </Typography>
                        <Typography variant="h5">
                          {formatCurrency(results.fireNumber)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ({t('fire.basedOn')} {inputs.withdrawalRate}% {t('fire.withdrawalRate')})
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Card sx={{ height: '100%', borderRadius: 4 }}>
                      <CardContent>
                        <Typography variant="subtitle2" color="textSecondary">
                          {t('fire.yearsToFire')}
                        </Typography>
                        <Typography variant="h5">
                          {results.yearsToFire.toFixed(1)} {t('fire.years')}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Card sx={{ height: '100%', borderRadius: 4 }}>
                      <CardContent>
                        <Typography variant="subtitle2" color="textSecondary">
                          {t('fire.fireAge')}
                        </Typography>
                        <Typography variant="h5">
                          {Math.round(results.fireAge)} {t('fire.ageUnit')}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Card sx={{ height: '100%', borderRadius: 4 }}>
                      <CardContent>
                        <Typography variant="subtitle2" color="textSecondary">
                          {t('fire.savingsRate')}
                        </Typography>
                        <Typography variant="h5">
                          {((inputs.annualSavings / inputs.annualIncome) * 100).toFixed(1)}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Paper>
              
              <Paper sx={{ p: 3, mb: 3, borderRadius: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {t('fire.firePath')}
                </Typography>
                <Box sx={{ height: 300 }}>
                  <FireProjectionChart 
                    currentAge={inputs.currentAge}
                    fireAge={results.fireAge}
                    currentSavings={results.currentSavings}
                    annualSavings={results.annualSavings}
                    fireNumber={results.fireNumber}
                    currency={currency}
                  />
                </Box>
              </Paper>
              
              {withdrawalResults && (
                <Paper sx={{ p: 3, borderRadius: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {t('fire.withdrawalStrategy')}
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <WithdrawalStrategyChart 
                      data={withdrawalResults.yearlyData} 
                      currency={currency}
                    />
                  </Box>
                </Paper>
              )}
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default FireCalculator;
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Slider, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Card,
  CardContent,
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { calculateCompoundInterest, calculateMixedInvestment } from '../../utils/calculators';
import { analyzeSustainability } from '../../utils/fireCalculators';
import { saveCalculation } from '../../utils/storageUtils';
import ScenarioComparisonChart from '../Charts/ScenarioComparisonChart';

const ScenarioAnalysis = () => {
  const [scenarios, setScenarios] = useState([
    {
      id: 1,
      name: '基准情景',
      principal: 100000,
      monthlyContribution: 1000,
      annualRate: 7,
      years: 20,
      inflationRate: 2.5
    },
    {
      id: 2,
      name: '乐观情景',
      principal: 100000,
      monthlyContribution: 1000,
      annualRate: 10,
      years: 20,
      inflationRate: 2.5
    }
  ]);
  
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const handleScenarioChange = (id, field, value) => {
    setScenarios(prevScenarios => 
      prevScenarios.map(scenario => 
        scenario.id === id ? { ...scenario, [field]: value } : scenario
      )
    );
  };
  
  const handleAddScenario = () => {
    const newId = Math.max(...scenarios.map(s => s.id), 0) + 1;
    setScenarios([
      ...scenarios,
      {
        id: newId,
        name: `情景 ${newId}`,
        principal: 100000,
        monthlyContribution: 1000,
        annualRate: 7,
        years: 20,
        inflationRate: 2.5
      }
    ]);
  };
  
  const handleDeleteScenario = (id) => {
    if (scenarios.length <= 1) {
      setError('至少需要保留一个情景');
      return;
    }
    setScenarios(scenarios.filter(scenario => scenario.id !== id));
  };
  
  const handleCalculate = () => {
    try {
      const calculatedResults = scenarios.map(scenario => {
        const result = calculateCompoundInterest(
          scenario.principal,
          scenario.monthlyContribution,
          scenario.annualRate,
          scenario.years,
          scenario.inflationRate,
          true
        );
        
        return {
          id: scenario.id,
          name: scenario.name,
          result
        };
      });
      
      setResults(calculatedResults);
      setError('');
    } catch (err) {
      setError('计算过程中出错: ' + err.message);
      setResults([]);
    }
  };
  
  const handleSaveCalculation = () => {
    if (results.length === 0) {
      setError('请先计算结果');
      return;
    }
    
    const success = saveCalculation(
      '情景分析',
      { scenarios },
      { results }
    );
    
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setError('保存计算结果失败');
    }
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        情景分析
      </Typography>
      <Typography variant="body1" paragraph>
        创建和比较不同投资情景下的结果。
      </Typography>
      
      <Grid container spacing={3}>
        {/* 情景配置 */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">投资情景</Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={handleAddScenario}
              >
                添加情景
              </Button>
            </Box>
            
            {scenarios.map((scenario, index) => (
              <Box key={scenario.id} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <TextField
                    fullWidth
                    label="情景名称"
                    value={scenario.name}
                    onChange={(e) => handleScenarioChange(scenario.id, 'name', e.target.value)}
                    sx={{ mr: 1 }}
                  />
                  <IconButton 
                    color="error" 
                    onClick={() => handleDeleteScenario(scenario.id)}
                    disabled={scenarios.length <= 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography gutterBottom>初始投资金额</Typography>
                  <TextField
                    fullWidth
                    type="number"
                    value={scenario.principal}
                    onChange={(e) => handleScenarioChange(scenario.id, 'principal', e.target.value)}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>¥</Typography>
                    }}
                  />
                  <Slider
                    value={scenario.principal}
                    onChange={(e, value) => handleScenarioChange(scenario.id, 'principal', value)}
                    min={0}
                    max={1000000}
                    step={10000}
                    valueLabelDisplay="auto"
                    valueLabelFormat={value => formatCurrency(value)}
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography gutterBottom>每月追加投资</Typography>
                  <TextField
                    fullWidth
                    type="number"
                    value={scenario.monthlyContribution}
                    onChange={(e) => handleScenarioChange(scenario.id, 'monthlyContribution', e.target.value)}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>¥</Typography>
                    }}
                  />
                  <Slider
                    value={scenario.monthlyContribution}
                    onChange={(e, value) => handleScenarioChange(scenario.id, 'monthlyContribution', value)}
                    min={0}
                    max={10000}
                    step={100}
                    valueLabelDisplay="auto"
                    valueLabelFormat={value => formatCurrency(value)}
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography gutterBottom>年化收益率 (%)</Typography>
                  <TextField
                    fullWidth
                    type="number"
                    value={scenario.annualRate}
                    onChange={(e) => handleScenarioChange(scenario.id, 'annualRate', e.target.value)}
                    InputProps={{
                      endAdornment: <Typography sx={{ ml: 1 }}>%</Typography>
                    }}
                  />
                  <Slider
                    value={scenario.annualRate}
                    onChange={(e, value) => handleScenarioChange(scenario.id, 'annualRate', value)}
                    min={0}
                    max={15}
                    step={0.1}
                    valueLabelDisplay="auto"
                    valueLabelFormat={value => `${value}%`}
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography gutterBottom>投资年限</Typography>
                  <TextField
                    fullWidth
                    type="number"
                    value={scenario.years}
                    onChange={(e) => handleScenarioChange(scenario.id, 'years', e.target.value)}
                    InputProps={{
                      endAdornment: <Typography sx={{ ml: 1 }}>年</Typography>
                    }}
                  />
                  <Slider
                    value={scenario.years}
                    onChange={(e, value) => handleScenarioChange(scenario.id, 'years', value)}
                    min={1}
                    max={50}
                    step={1}
                    valueLabelDisplay="auto"
                    valueLabelFormat={value => `${value}年`}
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography gutterBottom>通货膨胀率 (%)</Typography>
                  <TextField
                    fullWidth
                    type="number"
                    value={scenario.inflationRate}
                    onChange={(e) => handleScenarioChange(scenario.id, 'inflationRate', e.target.value)}
                    InputProps={{
                      endAdornment: <Typography sx={{ ml: 1 }}>%</Typography>
                    }}
                  />
                  <Slider
                    value={scenario.inflationRate}
                    onChange={(e, value) => handleScenarioChange(scenario.id, 'inflationRate', value)}
                    min={0}
                    max={10}
                    step={0.1}
                    valueLabelDisplay="auto"
                    valueLabelFormat={value => `${value}%`}
                  />
                </Box>
              </Box>
            ))}
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<CompareArrowsIcon />}
              onClick={handleCalculate}
              fullWidth
              sx={{ mt: 2 }}
            >
              计算情景
            </Button>
            
            <Button
              variant="outlined"
              color="primary"
              onClick={handleSaveCalculation}
              fullWidth
              sx={{ mt: 2 }}
              disabled={results.length === 0}
            >
              保存分析
            </Button>
            
            {saveSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>
                分析结果已成功保存！
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
        <Grid item xs={12} md={7}>
          {results.length > 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                情景比较
              </Typography>
              
              <Box sx={{ height: 400, mb: 3 }}>
                <ScenarioComparisonChart data={results} />
              </Box>
              
              <Typography variant="h6" gutterBottom>
                详细结果
              </Typography>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>情景</TableCell>
                      <TableCell align="right">最终价值</TableCell>
                      <TableCell align="right">总投资</TableCell>
                      <TableCell align="right">总收益</TableCell>
                      <TableCell align="right">收益倍数</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell component="th" scope="row">
                          {result.name}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(result.result.finalInvestmentValue)}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(result.result.totalContributions)}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(result.result.totalGrowth)}
                        </TableCell>
                        <TableCell align="right">
                          {(result.result.finalInvestmentValue / result.result.totalContributions).toFixed(2)}x
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ScenarioAnalysis;

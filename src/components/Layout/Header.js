import React from 'react';
import { 
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useI18n } from '../../utils/i18n';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useI18n();

  return (
    <AppBar 
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        color: 'text.primary',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>
        <Typography 
          variant="h6" 
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            textDecoration: 'none',
            color: 'primary.main',
          }}
        >
          {t('nav.appTitle')}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            component={Link}
            to="/"
            color="inherit"
            sx={{ 
              color: 'text.primary',
              '&:hover': {
                color: 'primary.main',
                backgroundColor: 'transparent',
              }
            }}
          >
            {t('nav.compound')}
          </Button>
          <Button 
            component={Link}
            to="/fire"
            color="inherit"
            sx={{ 
              color: 'text.primary',
              '&:hover': {
                color: 'primary.main',
                backgroundColor: 'transparent',
              }
            }}
          >
            {t('nav.fire')}
          </Button>
          <Button 
            component={Link}
            to="/settings"
            color="inherit"
            sx={{ 
              color: 'text.primary',
              '&:hover': {
                color: 'primary.main',
                backgroundColor: 'transparent',
              }
            }}
          >
            {t('nav.settings')}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
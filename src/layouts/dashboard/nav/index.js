import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
// mock
import account from '../../../_mock/account';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
import Cict from './bsu.png';
//
import navConfig from './config';
import AccountPopover from '../header/AccountPopover';


// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav, setOpenNav }) {
  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        {/* <Logo /> */}
      </Box>

      

      <Box sx={{ mb: 3, mx: 11 }}>
        <Logo />
      </Box>

      <NavSection data={navConfig}  />

      <Box sx={{ flexGrow: 1 }} />

    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
     <Button
  onClick={() => setOpenNav(!openNav)}
  sx={{ mb: 2, color: 'black' }} // Use color: 'black' to set text color
>
  {openNav ? <MenuIcon /> : 'Open Sidebar'}
</Button>
      {isDesktop ? (
        <Drawer
        open 
        variant="permanent"
        PaperProps={{
          sx: {
            width: NAV_WIDTH,
            bgcolor: '#F0EFF6', // Change this to your desired color
            borderRightStyle: 'dashed',
          },
        }}
      >
        {renderContent}
      </Drawer>
      ) : (
        <Drawer
      open={openNav} // Use the state variable to control the open state
      onClose={onCloseNav}
      ModalProps={{
          keepMounted: true,
      }}
      PaperProps={{
          sx: { width: NAV_WIDTH },
      }}
    >
  {renderContent}
</Drawer>
      )}
    </Box>
  );
}

import React from 'react';
import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
import { Box, List, ListItemText, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material'; 
import { StyledNavItem, StyledNavItemIcon } from './styles';

NavSection.propTypes = {
  data: PropTypes.array,
};

export default function NavSection({ data = [], ...other }) {
  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {data.map((item) => (
          <NavItem key={item.title} item={item} />
        ))}
      </List>
    </Box>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};

function NavItem({ item }) {
  const { title, path, icon, info, children } = item;
  const [open, setOpen] = React.useState(false);

  const handleExpand = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <div>
      <StyledNavItem
        component={RouterLink}
        to={path}
        sx={{
          '&.active': {
            color: 'text.primary',
            bgcolor: 'action.selected',
            fontWeight: 'fontWeightBold',
          },
        }}
        onClick={children ? handleExpand : undefined}
      >
        <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>
        <ListItemText disableTypography primary={title} />
        {children ? open ? <ExpandLess /> : <ExpandMore /> : null}
      </StyledNavItem>
      {children && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children.map((subItem) => (
              <StyledNavItem
                key={subItem.title}
                component={RouterLink}
                to={subItem.path}
                sx={{ pl: 4 }}
              >
                <ListItemText primary={subItem.title} />
              </StyledNavItem>
            ))}
          </List>
        </Collapse>
      )}
    </div>
  );
}
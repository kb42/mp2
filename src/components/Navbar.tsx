import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Button,
    MenuItem
} from '@mui/material';
import './Navbar.css';

const pages = [
  { label: 'List', path: '/list' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Surprise Me!', path: '/surprise' }
];

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    handleCloseNavMenu();
  };


  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            onClick={() => navigate('/list')}
            className="navbar-logo-desktop"
          >
            MealsViewer
          </Typography>

          <Box className="navbar-mobile-menu-container">
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              ☰
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              className="navbar-mobile-menu"
            >
              {pages.map((page) => (
                <MenuItem key={page.label} onClick={() => handleNavClick(page.path)}>
                  <Typography className="navbar-menu-item-text">{page.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="div"
            onClick={() => navigate('/list')}
            className="navbar-logo-mobile"
          >
            MealsViewer
          </Typography>
          <Box className="navbar-pages-container">
            {pages.map((page) => (
              <Button
                key={page.label}
                onClick={() => handleNavClick(page.path)}
                className="navbar-page-button"
              >
                {page.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;

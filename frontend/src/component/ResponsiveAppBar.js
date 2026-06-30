import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu'; // Import Menu from @mui/material
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem'; // Import MenuItem from @mui/material
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { usermethod } from '../redux/UserSlice';
import { useDispatch } from 'react-redux';

const pages = ['Blue Bus', 'Booking', 'Check Ticket'];
const settings = ['My Booking', 'MasterList', 'Logout'];
const loginRegisterPage = ['Login', 'Register'];


function ResponsiveAppBar() {

  const user = useSelector((state) => state.user)
  const history = useNavigate();
  const dispatch = useDispatch()
  // console.log(user) 

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  function logout() {
    dispatch(usermethod.Logout_User())
    history('/')
  }


  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <img src="https://static.vecteezy.com/system/resources/previews/008/442/189/original/blue-bus-free-vector.jpg" style={{ width: '50px', height: '50px' }} alt="" />
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
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
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >

              <Link to='/' onClick={handleCloseNavMenu} style={{ textDecoration: 'none', color: 'red' }}>
                <MenuItem key={pages[0]} >
                  <Typography textAlign="center">{pages[0]}</Typography>
                </MenuItem>
              </Link>
              <Link to='/BookBus' onClick={handleCloseNavMenu} style={{ textDecoration: 'none', color: 'black' }}>
                <MenuItem key={pages[1]} >
                  <Typography textAlign="center">{pages[1]}</Typography>
                </MenuItem>
              </Link>
              <Link to='/checkstatus' onClick={handleCloseNavMenu} style={{ textDecoration: 'none', color: 'black' }}>
                <MenuItem key={pages[2]} >
                  <Typography textAlign="center">{pages[2]}</Typography>
                </MenuItem>
              </Link>
            </Menu>
          </Box>


          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Link to='/' onClick={handleCloseNavMenu} style={{ textDecoration: 'none', size: "large", color: "#F8F9F9" }}>
              <MenuItem key={pages[0]} >
                <Typography textAlign="center">{pages[0]}</Typography>
              </MenuItem>
            </Link>
            <Link to='/BookBus' onClick={handleCloseNavMenu} style={{ textDecoration: 'none', color: "#F8F9F9" }}>
              <MenuItem key={pages[1]} >
                <Typography textAlign="center">{pages[1]}</Typography>
              </MenuItem>
            </Link>
            <Link to='/checkstatus' onClick={handleCloseNavMenu} style={{ textDecoration: 'none', color: "#F8F9F9" }}>
              <MenuItem key={pages[2]} >
                <Typography textAlign="center">{pages[2]}</Typography>
              </MenuItem>
            </Link>

          </Box>

          {user?.user?.auth ?
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Profile">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <Link to='/LastTransaction' onClick={handleCloseNavMenu} style={{ textDecoration: 'none', color: 'black' }}>
                  <MenuItem key={settings[0]} >
                    <Typography textAlign="center">{settings[0]}</Typography>
                  </MenuItem>
                </Link>
                <Link to='/MasterList' style={{ textDecoration: 'none', color: 'black' }}>
                  <MenuItem key={settings[1]} >
                    <Typography textAlign="center">{settings[1]}</Typography>
                  </MenuItem>
                </Link>
                <Link onClick={logout} style={{ textDecoration: 'none', color: 'black' }}>
                  <MenuItem key={settings[2]} >
                    <Typography textAlign="center">{settings[2]}</Typography>
                  </MenuItem>
                </Link>
              </Menu>
            </Box> :
            <Box sx={{ display: 'flex' }}>
              <Link to='/Login' style={{ textDecoration: 'none', color: 'white' }}>
                <MenuItem key={loginRegisterPage[0]} >
                  <Typography textAlign="center">{loginRegisterPage[0]}</Typography>
                </MenuItem>
              </Link>
              <Link to='/Register' style={{ textDecoration: 'none', color: 'white' }}>
                <MenuItem key={loginRegisterPage[1]} >
                  <Typography textAlign="center">{loginRegisterPage[1]}</Typography>
                </MenuItem>
              </Link>
            </Box>}
        </Toolbar>
      </Container>
    </AppBar >
  );
}

export default ResponsiveAppBar;

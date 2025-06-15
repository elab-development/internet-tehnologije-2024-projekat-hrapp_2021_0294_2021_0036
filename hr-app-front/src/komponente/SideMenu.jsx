import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Icon,
  Button,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';
import {
  FiHome,
  FiCalendar,
  FiBarChart2,
  FiLogOut,
} from 'react-icons/fi';
import { NavLink, useNavigate } from 'react-router-dom';
import api from '../util/api';

export default function SideMenu() {
  const navigate = useNavigate();
  const bg       = useColorModeValue('white', 'gray.800');
  const activeBg = useColorModeValue('pink.100', 'pink.900');
  const hoverBg  = useColorModeValue('pink.50',  'pink.800');

  const [roleName, setRoleName] = useState('');

  // fetch role name once
  useEffect(() => {
    const stored = JSON.parse(sessionStorage.getItem('user') || '{}');
    const token  = sessionStorage.getItem('token');
    if (stored.role_id && token) {
      api.get(`/roles/${stored.role_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setRoleName(res.data.name))
      .catch(() => setRoleName(''));
    }
  }, []);

  // decide path based on role
  const reviewsPath = roleName === 'hr_worker'
    ? '/performance-reviews-hr'
    : '/performance-reviews';

  const links = [
    { label: 'Home',               icon: FiHome,       to: '/home' },
    { label: 'Leave Requests',     icon: FiCalendar,   to: '/leave-requests' },
    { label: 'Performance Reviews',icon: FiBarChart2,  to: reviewsPath },
  ];

  const handleLogout = async () => {
    const token = sessionStorage.getItem('token');
    try {
      await api.post('/logout', null, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      navigate('/');
    }
  };

  return (
    <Box
      as="nav"
      position="fixed"
      top="0"
      left="0"
      h="100vh"
      w="60px"
      bg={bg}
      boxShadow="md"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="center"
      py={4}
    >
      <VStack spacing={6} flex="1">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              width: '100%',
              textAlign: 'center',
              background: isActive ? activeBg : undefined,
              borderRadius: 8,
            })}
          >
            {({ isActive }) => (
              <HStack
                justify="center"
                p={3}
                color={isActive ? 'pink.600' : 'gray.500'}
                _hover={{ bg: hoverBg, color: 'pink.500' }}
                borderRadius="md"
              >
                <Icon as={link.icon} boxSize={6} />
              </HStack>
            )}
          </NavLink>
        ))}
      </VStack>

      <Box>
        <Divider mb={4} />
        <Button
          onClick={handleLogout}
          variant="ghost"
          colorScheme="pink"
          size="lg"
          p={0}
          mb={2}
          _hover={{ bg: hoverBg }}
        >
          <Icon as={FiLogOut} boxSize={6} />
        </Button>
      </Box>
    </Box>
  );
}

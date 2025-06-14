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
  const bg = useColorModeValue('white', 'gray.800');
  const activeBg = useColorModeValue('pink.100', 'pink.900');
  const hoverBg = useColorModeValue('pink.50', 'pink.800');

  const links = [
    { label: 'Home',       icon: FiHome,       to: '/home' },
    { label: 'Leave Requests', icon: FiCalendar,  to: '/leave-requests' },
    { label: 'Performance Reviews', icon: FiBarChart2, to: '/performance-reviews' },
  ];

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.error('Logout failed', err);
    }
    // clear session
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
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
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              width: '100%',
              textAlign: 'center',
              background: isActive ? activeBg : undefined,
              borderRadius: '8px',
            })}
          >
            {({ isActive }) => (
              <HStack
                spacing={0}
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
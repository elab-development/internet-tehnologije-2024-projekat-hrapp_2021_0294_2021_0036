import { Outlet } from 'react-router-dom';
import { Flex, Box } from '@chakra-ui/react';
import SideMenu from './SideMenu';

export default function ProtectedLayout() {
  return (
    <Flex>
      <SideMenu />
      <Box flex="1" ml="60px">
        <Outlet />
      </Box>
    </Flex>
  );
}

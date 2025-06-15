import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Spinner,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import api from '../../util/api';

export default function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState({});
  const [depts, setDepts] = useState({});
  const [loading, setLoading] = useState(true);
  const bg = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    // fetch users, roles, departments in parallel
    Promise.all([
      api.get('/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
      api.get('/roles',       { headers: { Authorization: `Bearer ${token}` } }),
      api.get('/departments', { headers: { Authorization: `Bearer ${token}` } }),
    ])
    .then(([uRes, rRes, dRes]) => {
      setUsers(uRes.data);
      // build lookup maps
      const rMap = {};
      rRes.data.forEach(r => { rMap[r.id] = r.name; });
      setRoles(rMap);
      const dMap = {};
      dRes.data.forEach(d => { dMap[d.id] = d.name; });
      setDepts(dMap);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" color="pink.400" />
      </Box>
    );
  }

  if (users.length === 0) {
    return (
      <Box bg={bg} p={6} rounded="xl" shadow="md" textAlign="center">
        <Heading size="lg" color="pink.500" mb={4}>
          No Users Found
        </Heading>
        <Text>There are no users to display.</Text>
      </Box>
    );
  }

  return (
    <Box bg={bg} p={6} rounded="xl" shadow="md" overflowX="auto">
      <Heading size="lg" color="pink.500" mb={4}>
        All Users
      </Heading>
      <Table variant="simple">
        <Thead bg="pink.50">
          <Tr>
            <Th>Avatar</Th>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Department</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map(user => (
            <Tr key={user.id} _hover={{ bg: 'pink.25' }}>
              <Td>
                <Avatar
                  size="sm"
                  src={user.image_url || undefined}
                  name={user.name}
                />
              </Td>
              <Td>{user.id}</Td>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>{roles[user.role_id] || user.role_id}</Td>
              <Td>{depts[user.department_id] || user.department_id}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

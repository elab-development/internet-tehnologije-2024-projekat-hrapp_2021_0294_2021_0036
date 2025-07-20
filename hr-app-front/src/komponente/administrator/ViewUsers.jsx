import React, { useState, useEffect } from 'react';
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
  Button,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import api from '../../util/api';

export default function ViewUsers() {
  const [users, setUsers]     = useState([]);
  const [roles, setRoles]     = useState({});
  const [depts, setDepts]     = useState({});
  const [loading, setLoading] = useState(true);
  const toast                 = useToast();
  const bg                    = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [uRes, rRes, dRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/roles'),
          api.get('/departments'),
        ]);
        // Build role & dept maps
        const rMap = {};
        rRes.data.forEach(r => { rMap[r.id] = r.name; });
        setRoles(rMap);
        const dMap = {};
        dRes.data.forEach(d => { dMap[d.id] = d.name; });
        setDepts(dMap);
        // Filter out administrators
        const filtered = uRes.data.filter(u => rMap[u.role_id] !== 'administrator');
        setUsers(filtered);
      } catch (err) {
        toast({
          title: 'Greška pri učitavanju podataka.',
          description: err.response?.data?.error || err.message,
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(us => us.filter(u => u.id !== id));
      toast({
        title: 'Korisnik obrisan.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Greška pri brisanju korisnika.',
        description: err.response?.data?.error || err.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

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
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map(user => (
            <Tr key={user.id} _hover={{ bg: 'pink.25' }}>
              <Td>
                <Avatar size="sm" src={user.image_url || undefined} name={user.name}/>
              </Td>
              <Td>{user.id}</Td>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>{roles[user.role_id]}</Td>
              <Td>{depts[user.department_id]}</Td>
              <Td>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

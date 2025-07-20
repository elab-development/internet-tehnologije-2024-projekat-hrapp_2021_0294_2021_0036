// src/components/ViewUsers.jsx
import React, { useState, useEffect, useMemo } from 'react';
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
  Input,
  Select,
  HStack,
  VStack,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import api from '../../util/api';

const PAGE_SIZE = 5;

export default function ViewUsers() {
  const [users, setUsers]       = useState([]);
  const [roles, setRoles]       = useState({});
  const [depts, setDepts]       = useState({});
  const [loading, setLoading]   = useState(true);
  const [searchTerm, setSearch] = useState('');
  const [filterRole, setFilter] = useState(''); // '' | 'employee' | 'hr_worker'
  const [sortField, setSortField] = useState('id'); // 'id' | 'name'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'
  const [page, setPage]         = useState(1);
  const toast                   = useToast();
  const bg                      = useColorModeValue('white', 'gray.700');

  // Load data on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [uRes, rRes, dRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/roles'),
          api.get('/departments'),
        ]);
        // build lookup maps
        const rMap = {};
        rRes.data.forEach(r => { rMap[r.id] = r.name; });
        setRoles(rMap);
        const dMap = {};
        dRes.data.forEach(d => { dMap[d.id] = d.name; });
        setDepts(dMap);
        // filter out administrators
        setUsers(uRes.data.filter(u => rMap[u.role_id] !== 'administrator'));
      } catch (err) {
        toast({
          title: 'Greška pri učitavanju.',
          description: err.response?.data?.error || err.message,
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const handleDelete = async id => {
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(us => us.filter(u => u.id !== id));
      toast({ title: 'Korisnik obrisan.', status: 'success', duration: 3000, isClosable: true });
    } catch (err) {
      toast({
        title: 'Greška pri brisanju.',
        description: err.response?.data?.error || err.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  // filter by search & role
  const filtered = useMemo(() => {
    return users
      .filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(u =>
        !filterRole || roles[u.role_id] === filterRole
      );
  }, [users, searchTerm, filterRole, roles]);

  // sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortField === 'name') {
        const cmp = a.name.localeCompare(b.name);
        return sortOrder === 'asc' ? cmp : -cmp;
      } else {
        return sortOrder === 'asc'
          ? a.id - b.id
          : b.id - a.id;
      }
    });
  }, [filtered, sortField, sortOrder]);

  // pagination
  const pageCount = Math.ceil(sorted.length / PAGE_SIZE) || 1;
  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, page]);

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" color="pink.400" />
      </Box>
    );
  }

  return (
    <Box bg={bg} p={6} rounded="xl" shadow="md" overflowX="auto">
      <VStack align="start" spacing={4} mb={4}>
        <Heading size="lg" color="pink.500">All Users</Heading>
        <HStack spacing={3} w="100%">
          <Input
            placeholder="Search by name..."
            value={searchTerm}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          <Select
            w="200px"
            placeholder="Filter by role"
            value={filterRole}
            onChange={e => { setFilter(e.target.value); setPage(1); }}
          >
            <option value="employee">Employee</option>
            <option value="hr_worker">HR Worker</option>
          </Select>
          <Select
            w="160px"
            value={`${sortField}:${sortOrder}`}
            onChange={e => {
              const [f, o] = e.target.value.split(':');
              setSortField(f); setSortOrder(o); setPage(1);
            }}
          >
            <option value="id:asc">ID ↑</option>
            <option value="id:desc">ID ↓</option>
            <option value="name:asc">Name A→Z</option>
            <option value="name:desc">Name Z→A</option>
          </Select>
        </HStack>
      </VStack>

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
          {paged.map(user => (
            <Tr key={user.id} _hover={{ bg: 'pink.25' }}>
              <Td>
                <Avatar size="sm" src={user.image_url} name={user.name} />
              </Td>
              <Td>{user.id}</Td>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>{roles[user.role_id]}</Td>
              <Td>{depts[user.department_id]}</Td>
              <Td>
                <Button size="sm" colorScheme="red" onClick={() => handleDelete(user.id)}>
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Pagination controls */}
      <HStack spacing={2} mt={4} justify="center">
        <Button
          size="sm"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          isDisabled={page === 1}
        >
          Prev
        </Button>
        {Array.from({ length: pageCount }, (_, i) => (
          <Button
            key={i+1}
            size="sm"
            variant={page === i+1 ? 'solid' : 'outline'}
            colorScheme="pink"
            onClick={() => setPage(i+1)}
          >
            {i+1}
          </Button>
        ))}
        <Button
          size="sm"
          onClick={() => setPage(p => Math.min(pageCount, p + 1))}
          isDisabled={page === pageCount}
        >
          Next
        </Button>
      </HStack>
    </Box>
  );
}

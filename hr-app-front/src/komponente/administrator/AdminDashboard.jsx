import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  IconButton,
  Image,
  CircularProgress,
  CircularProgressLabel,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../util/api';

export default function AdminDashboard() {
  const [metrics, setMetrics]       = useState([]);
  const [hires, setHires]           = useState([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingHires, setLoadingHires]     = useState(true);
  const [page, setPage]             = useState(0);

  const pageSize = 3;

  // 1) Fetch department metrics
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    api.get('/admin/metrics', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(r => setMetrics(r.data))
    .catch(console.error)
    .finally(() => setLoadingMetrics(false));
  }, []);

  // 2) Fetch all users and take the 9 most recent by created_at
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    api.get('/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(r => {
      const all = r.data
        .filter(u => u.created_at)            // if you store created_at
        .sort((a,b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 9);
      setHires(all);
    })
    .catch(console.error)
    .finally(() => setLoadingHires(false));
  }, []);

  // 3) Carousel pagination
  const totalPages = Math.ceil(hires.length / pageSize);
  const currentHires = hires.slice(page * pageSize, page * pageSize + pageSize);

  // 4) Top projects static data
  const projects = useMemo(() => [
    { name: 'Project 1', value: 40 },
    { name: 'Project 2', value: 45 },
    { name: 'Project 3', value: 50 },
  ], []);

  const bg = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');

  return (
    <Box bg={bg} minH="100vh" p={{ base: 4, md: 8 }}>
      <Stack spacing={8}>

        {/* DEPARTMENT METRICS */}
        <Box bg={cardBg} rounded="xl" shadow="lg" p={6}>
          <Heading size="md" mb={4}>Number of Employees per Department</Heading>
          {loadingMetrics ? (
            <Text>Loading…</Text>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={metrics}>
                <XAxis dataKey="department_name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="employee_count" fill="#D53F8C" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Box>

        <Flex gap={8} direction={{ base: 'column', md: 'row' }}>
          {/* RECENT HIRES CAROUSEL */}
          <Box flex="1" bg={cardBg} rounded="xl" shadow="lg" p={6}>
            <Heading size="md" mb={4}>Recent Hires</Heading>
            {loadingHires ? (
              <Text>Loading…</Text>
            ) : (
              <Flex align="center">
                <IconButton
                  icon={<ChevronLeftIcon />}
                  aria-label="Prev"
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  isDisabled={page === 0}
                  mr={2}
                />
                <Flex flex="1" justify="space-around">
                  {currentHires.map(u => (
                    <Box key={u.id} textAlign="center" w="120px">
                      <Image
                        src={u.image_url || 'https://via.placeholder.com/100'}
                        alt={u.name}
                        boxSize="100px"
                        objectFit="cover"
                        rounded="md"
                        mb={2}
                      />
                      <Text fontWeight="semibold" noOfLines={1}>{u.name}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {new Date(u.created_at).toLocaleDateString()}
                      </Text>
                    </Box>
                  ))}
                </Flex>
                <IconButton
                  icon={<ChevronRightIcon />}
                  aria-label="Next"
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  isDisabled={page === totalPages - 1}
                  ml={2}
                />
              </Flex>
            )}
          </Box>

          {/* TOP PROJECTS – REVENUE */}
          <Box flex="1" bg={cardBg} rounded="xl" shadow="lg" p={6}>
            <Heading size="md" mb={4}>Top Projects – Revenue</Heading>
            <Flex justify="space-around">
              {projects.map(p => (
                <Box key={p.name} textAlign="center">
                  <CircularProgress
                    value={p.value}
                    size="100px"
                    color="pink.400"
                    thickness="8px"
                    mb={2}
                    trackColor="gray.200"
                  >
                    <CircularProgressLabel>{p.value}%</CircularProgressLabel>
                  </CircularProgress>
                  <Text mt={2}>{p.name}</Text>
                </Box>
              ))}
            </Flex>
          </Box>
        </Flex>
      </Stack>
    </Box>
  );
}

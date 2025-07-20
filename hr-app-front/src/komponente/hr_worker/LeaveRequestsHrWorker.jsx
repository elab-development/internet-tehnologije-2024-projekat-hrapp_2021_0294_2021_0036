// src/components/LeaveRequestsHrWorker.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Badge,
  SimpleGrid,
  Button,
  Spinner,
  Flex,
  Stack,
  Avatar,
  useToast,
} from '@chakra-ui/react';
import api from '../../util/api';

export default function LeaveRequestsHrWorker() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const toast                  = useToast();

  // Učitaj sve zahteve dodeljene ovom HR radniku
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res  = await api.get('/leave-requests');
        const list = Array.isArray(res.data) ? res.data : res.data.data || [];
        setRequests(list);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Promeni status zahteva
  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/leave-requests/${id}/status`, { status });
      setRequests(rs =>
        rs.map(r => (r.id === id ? { ...r, status } : r))
      );
      toast({
        title: `Zahtev ${status === 'approved' ? 'odobren' : 'odbijen'}.`,
        status: status === 'approved' ? 'success' : 'error',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Greška pri ažuriranju statusa.',
        description: err.response?.data?.error || err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" color="blue.400" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Text color="red.500">Error: {error}</Text>
      </Box>
    );
  }

  return (
    <Box p={8}>
      <Heading as="h1" size="xl" mb={6}>
        Leave Requests for you
      </Heading>

      <SimpleGrid columns={[1, null, 2, 3]} spacing="24px">
        {requests.length === 0 && (
          <Box
            p={6}
            borderWidth="1px"
            borderRadius="2xl"
            boxShadow="lg"
            gridColumn="1 / -1"
          >
            <Text fontSize="lg" fontWeight="bold" textAlign="center">
              There are no pending leave requests for you...
            </Text>
          </Box>
        )}

        {requests.map(req => (
          <Box
            key={req.id}
            p={6}
            borderWidth="1px"
            borderRadius="2xl"
            boxShadow="lg"
          >
            <Stack spacing={4}>
              <Flex align="center">
                <Avatar
                  size="md"
                  src={req.employee.image_url}
                  name={req.employee.name}
                  mr={4}
                />
                <Text fontWeight="bold">{req.employee.name}</Text>
              </Flex>

              <Text>
                {new Date(req.start_date).toLocaleDateString()} –{' '}
                {new Date(req.end_date).toLocaleDateString()}
              </Text>

              <Badge
                colorScheme={
                  req.status === 'approved'
                    ? 'green'
                    : req.status === 'rejected'
                    ? 'red'
                    : 'yellow'
                }
                alignSelf="flex-start"
              >
                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
              </Badge>

              <Flex mt={4} justify="flex-end" wrap="wrap">
                {req.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      colorScheme="green"
                      mr={2}
                      onClick={() => handleStatusChange(req.id, 'approved')}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleStatusChange(req.id, 'rejected')}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </Flex>
            </Stack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

// src/components/LeaveRequestsEmployee.jsx
import React, { useEffect, useState, useMemo } from 'react';
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
  Select,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import api from '../../util/api';

export default function LeaveRequestsEmployee() {
  const [requests, setRequests]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');               // ← new
  const [isNewOpen, setIsNewOpen]       = useState(false);
  const [isEditOpen, setIsEditOpen]     = useState(false);
  const [current, setCurrent]           = useState(null);
  const [startDate, setStartDate]       = useState('');
  const [endDate, setEndDate]           = useState('');
  const [hrWorkerName, setHrWorkerName] = useState('');
  const toast                           = useToast();

  // load leave requests
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res  = await api.get('/leave-requests');
        const list = Array.isArray(res.data) ? res.data : res.data.data || [];
        setRequests(list);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // filtered list by status
  const filtered = useMemo(() => {
    if (filterStatus === 'all') return requests;
    return requests.filter(r => r.status === filterStatus);
  }, [requests, filterStatus]);

  // delete handler
  const handleDelete = async id => {
    try {
      await api.delete(`/leave-requests/${id}`);
      setRequests(r => r.filter(x => x.id !== id));
      toast({ title: 'Zahtev obrisan.', status: 'success', duration: 3000, isClosable: true });
    } catch (err) {
      toast({
        title: 'Greška pri brisanju.',
        description: err.response?.data?.error || err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // open new request modal
  const openNew = () => {
    setStartDate(''); setEndDate(''); setHrWorkerName('');
    setIsNewOpen(true);
  };

  // create new
  const handleNewSubmit = async () => {
    if (!startDate || !endDate) {
      toast({ title: 'Unesite oba datuma.', status: 'warning', duration: 2000, isClosable: true });
      return;
    }
    try {
      const payload = { start_date: startDate, end_date: endDate };
      if (hrWorkerName) payload.hr_worker_name = hrWorkerName;
      const res = await api.post('/leave-requests', payload);
      const created = res.data.data || res.data;
      setRequests(r => [created, ...r]);
      toast({ title: 'Zahtev kreiran.', status: 'success', duration: 3000, isClosable: true });
      setIsNewOpen(false);
    } catch (err) {
      toast({
        title: 'Greška pri kreiranju.',
        description: err.response?.data?.error || err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // open edit modal
  const openEdit = req => {
    setCurrent(req);
    setStartDate(req.start_date);
    setEndDate(req.end_date);
    setHrWorkerName('');
    setIsEditOpen(true);
  };

  // save edit
  const handleEditSubmit = async () => {
    if (!startDate || !endDate) {
      toast({ title: 'Unesite oba datuma.', status: 'warning', duration: 2000, isClosable: true });
      return;
    }
    try {
      const payload = { start_date: startDate, end_date: endDate };
      const res = await api.put(`/leave-requests/${current.id}`, payload);
      const updated = res.data.data || res.data;
      setRequests(r => r.map(x => x.id === updated.id ? updated : x));
      toast({ title: 'Zahtev izmenjen.', status: 'success', duration: 3000, isClosable: true });
      setIsEditOpen(false);
    } catch (err) {
      toast({
        title: 'Greška pri izmeni.',
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
        <Spinner size="xl" color="pink.400" />
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
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="xl">Leave Requests</Heading>
        <HStack spacing={3}>
          <Select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            w="160px"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </Select>
          <Button colorScheme="pink" onClick={openNew}>
            New Leave Request
          </Button>
        </HStack>
      </Flex>

      <SimpleGrid columns={[1, null, 2, 3]} spacing="24px">
        {filtered.length === 0 && (
          <Box
            p={6}
            borderWidth="1px"
            borderRadius="2xl"
            boxShadow="lg"
            gridColumn="1 / -1"
          >
            <Text fontSize="lg" fontWeight="bold" textAlign="center">
              You have no leave requests{' '}
              {filterStatus !== 'all' && `with status "${filterStatus}"`}.
            </Text>
          </Box>
        )}

        {filtered.map(req => (
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
              {req.hr_worker && (
                <Flex align="center" mt={2}>
                  <Avatar
                    size="sm"
                    src={req.hr_worker.image_url}
                    name={req.hr_worker.name}
                    mr={2}
                  />
                  <Text fontSize="sm">HR: {req.hr_worker.name}</Text>
                </Flex>
              )}
              <Flex mt={4} justify="flex-end">
                {req.status === 'pending' && (
                  <Button size="sm" mr={2} onClick={() => openEdit(req)}>
                    Update
                  </Button>
                )}
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDelete(req.id)}
                >
                  Delete
                </Button>
              </Flex>
            </Stack>
          </Box>
        ))}
      </SimpleGrid>

      {/* New Request Modal */}
      <Modal isOpen={isNewOpen} onClose={() => setIsNewOpen(false)} isCentered>
        <ModalOverlay bg="blackAlpha.600" />
        <ModalContent>
          <ModalHeader>Create a new leave request</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Start Date</FormLabel>
              <Input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>End Date</FormLabel>
              <Input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>HR Worker Name (optional)</FormLabel>
              <Input
                placeholder="Exact HR user name"
                value={hrWorkerName}
                onChange={e => setHrWorkerName(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsNewOpen(false)} mr={3}>
              Cancel
            </Button>
            <Button colorScheme="pink" onClick={handleNewSubmit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Request Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} isCentered>
        <ModalOverlay bg="blackAlpha.600" />
        <ModalContent>
          <ModalHeader>Update request #{current?.id}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Start Date</FormLabel>
              <Input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>End Date</FormLabel>
              <Input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsEditOpen(false)} mr={3}>
              Cancel
            </Button>
            <Button colorScheme="pink" onClick={handleEditSubmit}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

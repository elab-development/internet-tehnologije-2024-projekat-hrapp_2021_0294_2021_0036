import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Spinner,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Textarea,
  HStack,
  FormControl,
  FormLabel,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Stack,
  Divider,
} from '@chakra-ui/react';
import {
  ViewIcon,
  DownloadIcon,
  EditIcon,
  AddIcon,
} from '@chakra-ui/icons';
import api from '../../util/api';

export default function PerformanceReviewsHrWorker() {
  const [reviews, setReviews]   = useState([]);
  const [users, setUsers]       = useState([]);
  const [roles, setRoles]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);

  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose
  } = useDisclosure();
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose
  } = useDisclosure();

  const bg = useColorModeValue('white', 'gray.700');

  // form state
  const [createForm, setCreateForm] = useState({
    employee_id: '',
    score: 0,
    feedback: '',
  });
  const [editForm, setEditForm] = useState({
    score: 0,
    feedback: '',
  });

  // fetch reviews, users, roles
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    Promise.all([
      api.get('/performance-reviews', {
        headers: { Authorization: `Bearer ${token}` }
      }),
      api.get('/users', {
        headers: { Authorization: `Bearer ${token}` }
      }),
      api.get('/roles', {
        headers: { Authorization: `Bearer ${token}` }
      }),
    ])
    .then(([rRes, uRes, roRes]) => {
      // resource collection may be in rRes.data.data
      const list = Array.isArray(rRes.data)
        ? rRes.data
        : (rRes.data.data || []);
      setReviews(list);
      setUsers(uRes.data);
      setRoles(roRes.data);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  }, []);

  // helper: list of employees
  const employeeRole = roles.find(r => r.name === 'employee');
  const employeeList = employeeRole
    ? users.filter(u => u.role_id === employeeRole.id)
    : [];

  // refresh reviews
  const refresh = () => {
    setLoading(true);
    const token = sessionStorage.getItem('token');
    api.get('/performance-reviews', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const list = Array.isArray(res.data)
        ? res.data
        : (res.data.data || []);
      setReviews(list);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  };

  const openView = review => {
    setSelected(review);
    onViewOpen();
  };

  const openEdit = review => {
    setSelected(review);
    setEditForm({
      score: review.score,
      feedback: review.feedback,
    });
    onEditOpen();
  };

  const exportPDF = id => {
    const token = sessionStorage.getItem('token');
    api.get(`/performance-reviews/${id}/export-pdf`, {
      responseType: 'blob',
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(({ data, headers }) => {
      const blob = new Blob([data], { type: headers['content-type'] });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `performance_review_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    })
    .catch(console.error);
  };

  const handleCreateChange = e => {
    const { name, value } = e.target;
    setCreateForm(f => ({ ...f, [name]: value }));
  };
  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditForm(f => ({ ...f, [name]: value }));
  };

  const handleCreateSubmit = () => {
    const token = sessionStorage.getItem('token');
    api.post('/performance-reviews', createForm, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      onCreateClose();
      refresh();
      setCreateForm({ employee_id: '', score: 0, feedback: '' });
    })
    .catch(console.error);
  };

  const handleEditSubmit = () => {
    const token = sessionStorage.getItem('token');
    api.put(`/performance-reviews/${selected.id}`, editForm, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      onEditClose();
      refresh();
    })
    .catch(console.error);
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" color="pink.400" />
      </Box>
    );
  }

  return (
    <Box bg={bg} shadow="md" rounded="xl" p={6}>
      <HStack justify="space-between" mb={4}>
        <Heading size="lg" color="pink.500">
          Performance Reviews
        </Heading>
        <Button
          colorScheme="pink"
          leftIcon={<AddIcon />}
          onClick={onCreateOpen}
        >
          New Review
        </Button>
      </HStack>

      {reviews.length === 0 ? (
        <Text>You don’t have any performance reviews for now.</Text>
      ) : (
        <Table variant="simple">
          <Thead bg="pink.50">
            <Tr>
              <Th>ID</Th>
              <Th>Employee</Th>
              <Th>Score</Th>
              <Th>Created At</Th>
              <Th textAlign="center">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {reviews.map(r => (
              <Tr key={r.id} _hover={{ bg: 'pink.25' }}>
                <Td>{r.id}</Td>
                <Td>{r.employee.name}</Td>
                <Td>{r.score} / 5</Td>
                <Td>{new Date(r.created_at).toLocaleDateString()}</Td>
                <Td textAlign="center">
                  <Button
                    size="sm"
                    leftIcon={<ViewIcon />}
                    colorScheme="pink"
                    variant="outline"
                    mr={2}
                    onClick={() => openView(r)}
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    leftIcon={<EditIcon />}
                    colorScheme="pink"
                    variant="outline"
                    mr={2}
                    onClick={() => openEdit(r)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    leftIcon={<DownloadIcon />}
                    colorScheme="pink"
                    variant="solid"
                    onClick={() => exportPDF(r.id)}
                  >
                    PDF
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={onCreateClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Performance Review</ModalHeader>
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Employee</FormLabel>
                <Select
                  name="employee_id"
                  value={createForm.employee_id}
                  onChange={handleCreateChange}
                >
                  <option value="">Select employee</option>
                  {employeeList.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Score</FormLabel>
                <HStack spacing={2}>
                  {Array.from({ length: 5 }).map((_, i) => {
                    const val = i + 1;
                    const filled = createForm.score >= val;
                    return (
                      <Box
                        as="button"
                        key={val}
                        w="24px"
                        h="24px"
                        borderRadius="full"
                        bg={filled ? 'black' : 'white'}
                        border="1px solid black"
                        onClick={() =>
                          setCreateForm(f => ({ ...f, score: val }))
                        }
                      />
                    );
                  })}
                </HStack>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Feedback</FormLabel>
                <Textarea
                  name="feedback"
                  value={createForm.feedback}
                  onChange={handleCreateChange}
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onCreateClose} mr={3}>
              Cancel
            </Button>
            <Button colorScheme="pink" onClick={handleCreateSubmit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Performance Review</ModalHeader>
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Score</FormLabel>
                <HStack spacing={2}>
                  {Array.from({ length: 5 }).map((_, i) => {
                    const val = i + 1;
                    const filled = editForm.score >= val;
                    return (
                      <Box
                        as="button"
                        key={val}
                        w="24px"
                        h="24px"
                        borderRadius="full"
                        bg={filled ? 'black' : 'white'}
                        border="1px solid black"
                        onClick={() =>
                          setEditForm(f => ({ ...f, score: val }))
                        }
                      />
                    );
                  })}
                </HStack>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Feedback</FormLabel>
                <Textarea
                  name="feedback"
                  value={editForm.feedback}
                  onChange={handleEditChange}
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onEditClose} mr={3}>
              Cancel
            </Button>
            <Button colorScheme="pink" onClick={handleEditSubmit}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Modal */}
      {selected && (
        <Modal isOpen={isViewOpen} onClose={onViewClose} size="lg" isCentered>
          <ModalOverlay bg="blackAlpha.600" />
          <ModalContent>
            <ModalHeader>Review #{selected.id}</ModalHeader>
            <ModalBody>
              <Stack spacing={4}>
                <Box>
                  <Text fontWeight="bold">Employee:</Text>
                  <Text>
                    {selected.employee.name} — {selected.employee.department}
                  </Text>
                </Box>
                <Divider />
                <Box>
                  <Text fontWeight="bold">Reviewer:</Text>
                  <Text>
                    {selected.reviewer.name} — {selected.reviewer.department}
                  </Text>
                </Box>
                <Divider />
                <Box>
                  <Text fontWeight="bold">Score:</Text>
                  <Text>{selected.score} / 5</Text>
                </Box>
                <Divider />
                <Box>
                  <Text fontWeight="bold">Feedback:</Text>
                  <Text whiteSpace="pre-wrap">{selected.feedback}</Text>
                </Box>
                <Divider />
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Created at: {new Date(selected.created_at).toLocaleString()}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Updated at: {new Date(selected.updated_at).toLocaleString()}
                  </Text>
                </Box>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onViewClose} colorScheme="pink">
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
}

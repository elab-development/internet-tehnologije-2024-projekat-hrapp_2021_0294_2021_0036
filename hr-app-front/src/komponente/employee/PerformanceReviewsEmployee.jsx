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
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Stack,
  Divider
} from '@chakra-ui/react';
import { ViewIcon, DownloadIcon } from '@chakra-ui/icons';
import api from '../../util/api';

export default function PerformanceReviewsEmployee() {
  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    const token = sessionStorage.getItem('token');
   api.get('/performance-reviews', {
     headers: { Authorization: `Bearer ${token}` }
   })
   .then(res => {
     // Laravel Resource Collections wrap results in `data`
     const list = Array.isArray(res.data)
       ? res.data
       : res.data.data || [];
     setReviews(list);
   })    .catch(console.error)
    .finally(() => setLoading(false));
  }, []);

  const openDetails = r => {
    setSelected(r);
    onOpen();
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

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" color="pink.400" />
      </Box>
    );
  }

  // ** new empty state check **
  if (reviews.length === 0) {
    return (
      <Box bg={bg} shadow="md" rounded="xl" p={6} textAlign="center">
        <Heading size="lg" color="pink.500" mb={4}>
          My Performance Reviews
        </Heading>
        <Text>You don’t have any performance reviews for now.</Text>
      </Box>
    );
  }

  return (
    <Box bg={bg} shadow="md" rounded="xl" p={6}>
      <Heading mb={4} size="lg" color="pink.500">
        My Performance Reviews
      </Heading>
      <Table variant="simple">
        <Thead bg="pink.50">
          <Tr>
            <Th>ID</Th>
            <Th>Reviewer</Th>
            <Th>Department</Th>
            <Th>Score</Th>
            <Th>Created At</Th>
            <Th textAlign="center">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {reviews.map(r => (
            <Tr key={r.id} _hover={{ bg: 'pink.25' }}>
              <Td>{r.id}</Td>
              <Td>{r.reviewer.name}</Td>
              <Td>{r.reviewer.department}</Td>
              <Td>{r.score} / 5</Td>
              <Td>{new Date(r.created_at).toLocaleDateString()}</Td>
              <Td textAlign="center">
                <Button
                  size="sm"
                  leftIcon={<ViewIcon />}
                  colorScheme="pink"
                  variant="outline"
                  mr={2}
                  onClick={() => openDetails(r)}
                >
                  View
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

      {/* Details Modal */}
      {selected && (
        <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
          <ModalOverlay bg="blackAlpha.600" />
          <ModalContent>
            <ModalHeader>Review #{selected.id} Details</ModalHeader>
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
              <Button onClick={onClose} colorScheme="pink" mr={3}>
                Close
              </Button>
              <Button
                leftIcon={<DownloadIcon />}
                colorScheme="pink"
                onClick={() => exportPDF(selected.id)}
              >
                Export PDF
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
}

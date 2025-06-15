import { useState, useEffect, useMemo } from 'react';
import {
  Box, Flex, Stack, Heading, Text, Image,
  CircularProgress, CircularProgressLabel,
  Progress, IconButton, useColorModeValue, Spinner
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import api from '../util/api';
import { useRandomQuote } from '../custom-hooke/useRandomQuote';
import { useRandomFakeUsers } from '../custom-hooke/useRandomFakeUsers';

export default function Home() {
  // 1) Load user & resolved role/department names
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const [roleName, setRoleName] = useState('');
  const [deptName, setDeptName] = useState('');
  const roleLabels = {
    employee:      'Employee',
    hr_worker:     'HR Worker',
    administrator: 'Administrator',
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (user.role_id) {
      api.get(`/roles/${user.role_id}`, { headers: { Authorization: `Bearer ${token}` } })
         .then(r => setRoleName(roleLabels[r.data.name] || r.data.name))
         .catch(() => setRoleName(''));
    }
    if (user.department_id) {
      api.get(`/departments/${user.department_id}`, { headers: { Authorization: `Bearer ${token}` } })
         .then(r => setDeptName(r.data.name))
         .catch(() => setDeptName(''));
    }
  }, [user.role_id, user.department_id]);

  // 2) Progress animations + static data
  const [circleVal, setCircleVal] = useState(0);
  const [barVals, setBarVals]     = useState([0,0,0,0,0]);
  const projects = useMemo(() => [
    { label:'Project 1', target:90, color:'pink.400' },
    { label:'Project 2', target:70, color:'orange.400' },
    { label:'Project 3', target:40, color:'teal.400' },
    { label:'Project 4', target:80, color:'blue.400' },
    { label:'Project 5', target:50, color:'purple.400' },
  ], []);

  useEffect(() => {
    setTimeout(() => {
      setCircleVal(50);
      setBarVals([90,70,40,80,50]);
    }, 100);
  }, []);

  // 3) Quote of the Day
  const { quote, author, loading: qLoading } = useRandomQuote();

  // 4) Fake birthdays carousel
  const birthdays = useRandomFakeUsers(36);
  const pageSize   = 6;
  const totalPages = Math.ceil(birthdays.length / pageSize);
  const [page, setPage] = useState(0);
  const current = birthdays.slice(page * pageSize, page * pageSize + pageSize);

  const bg     = useColorModeValue('gray.50','gray.800');
  const cardBg = useColorModeValue('white','gray.700');

  return (
    <Box bg={bg} minH="100vh" p={{ base:4, md:8 }}>
      <Stack spacing={8}>

        {/* Top Panels */}
        <Flex direction={{ base:'column', md:'row' }} gap={8}>
          {/* Personal Overview */}
          <Box flex="1" bg={cardBg} shadow="lg" rounded="xl" p={6}>
            <Heading size="md" mb={4}>Personal Overview</Heading>
            <Flex justify="center" mb={6}>
              <CircularProgress
                value={circleVal}
                size="140px"
                color="pink.400"
                thickness="10px"
                transition="all 1s ease-out"
              >
                <CircularProgressLabel fontSize="lg">
                  {circleVal}%
                </CircularProgressLabel>
              </CircularProgress>
            </Flex>
            <Stack spacing={4}>
              {projects.map((p,i) => (
                <Flex key={p.label} align="center">
                  <Text w="25%" fontSize="sm">{p.label}</Text>
                  <Box w="60%" mx={2}>
                    <Progress
                      value={barVals[i]}
                      colorScheme={p.color.split('.')[0]}
                      size="sm"
                      borderRadius="md"
                      transition="width 1s ease-out"
                    />
                  </Box>
                  <Text w="15%" textAlign="right" fontSize="sm">
                    {barVals[i]}%
                  </Text>
                </Flex>
              ))}
            </Stack>
          </Box>

          {/* Welcome & Quote */}
          <Box flex="1" bg={cardBg} shadow="lg" rounded="xl" p={6}>
            <Heading size="md" mb={4}>Welcome {user.name}!</Heading>
            <Flex mb={6} align="center" gap={6}>
              <Box boxSize="100px" rounded="md" overflow="hidden">
                {user.image_url
                  ? <Image src={user.image_url} alt={user.name} w="100%" h="100%" objectFit="cover"/>
                  : <Text>No Image</Text>
                }
              </Box>
              <Stack spacing={1}>
                <Text><Text as="span" fontWeight="bold">Name: </Text>{user.name}</Text>
                <Text><Text as="span" fontWeight="bold">Email: </Text>{user.email}</Text>
                <Text><Text as="span" fontWeight="bold">Department: </Text>{deptName}</Text>
                <Text><Text as="span" fontWeight="bold">Role: </Text>{roleName}</Text>
              </Stack>
            </Flex>
            <Box bg="pink.50" p={4} rounded="lg" textAlign="center" minH="80px">
              {qLoading
                ? <Spinner />
                : <>
                    <Text fontStyle="italic" color="gray.600">“{quote}”</Text>
                    <Text mt={2} fontWeight="bold" fontSize="sm">— {author}</Text>
                  </>
              }
            </Box>
          </Box>
        </Flex>

        {/* Birthdays Carousel */}
        <Box bg={cardBg} shadow="lg" rounded="xl" p={6}>
          <Heading size="md" mb={4}>Today’s Birthdays</Heading>
          <Flex align="center">
            <IconButton
              icon={<ChevronLeftIcon />}
              aria-label="Previous"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              isDisabled={page === 0}
              mr={2}
            />
            <Flex flex="1" wrap="wrap" justify="space-around" rowGap={6}>
              {current.length === 0
                ? <Spinner />
                : current.map(b => (
                    <Box
                      key={b.id}
                      textAlign="center"
                      bg="gray.50"
                      p={4}
                      rounded="xl"
                      shadow="md"
                      w={{ base: '140px', md: '160px' }}
                    >
                      <Image
                        src={b.image_url}
                        alt={b.name}
                        w="100%"
                        h="100px"
                        objectFit="cover"
                        rounded="md"
                        mb={2}
                      />
                      <Text fontWeight="semibold">{b.name}</Text>
                      <Text fontSize="xs" color="gray.500">{b.department}</Text>
                      <Text fontSize="xs" color="gray.400">{b.date}</Text>
                    </Box>
                  ))
              }
            </Flex>
            <IconButton
              icon={<ChevronRightIcon />}
              aria-label="Next"
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              isDisabled={page === totalPages - 1}
              ml={2}
            />
          </Flex>
        </Box>
      </Stack>
    </Box>
  );
}

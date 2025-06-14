import  { useState } from 'react';
import {
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Stack,
  Text,
  Link,
  useToast,
  IconButton,
  Image,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import api from '../util/api';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const nav = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await api.post('/login', form);
      // save token to localStorage or context
      localStorage.setItem('token', res.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

      toast({
        title: 'Prijava uspešna!',
        description: res.data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      nav('/');
    } catch (err) {
      toast({
        title: 'Greška pri prijavi',
        description: err.response?.data?.message || err.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bgGradient="linear(to-br, white, pink.50)">
      <Stack spacing={4} w={{ base: '90%', md: '400px' }} p={8} bg="white" boxShadow="lg" borderRadius="lg">
        <Flex justify="center">
          <Image src="/images/hr-logo.png" alt="HR Logo" boxSize="80px" />
        </Flex>
        <Heading textAlign="center" color="pink.500">Prijava</Heading>

        <FormControl id="email" isRequired>
          <FormLabel>Email adresa</FormLabel>
          <Input type="email" name="email" placeholder="email@primer.com" value={form.email} onChange={handleChange} focusBorderColor="pink.400"/>
        </FormControl>

        <FormControl id="password" isRequired>
          <FormLabel>Lozinka</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="********"
              value={form.password}
              onChange={handleChange}
              focusBorderColor="pink.400"
            />
            <InputRightElement>
              <IconButton
                variant="ghost"
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button
          colorScheme="pink"
          isFullWidth
          isLoading={loading}
          loadingText="Proveravam..."
          onClick={handleSubmit}
        >
          Prijavi se
        </Button>

        <Text textAlign="center">
          Nemate nalog?{' '}
          <Link as={RouterLink} to="/register" color="pink.500">Registrujte se</Link>
        </Text>
      </Stack>
    </Flex>
  );
}

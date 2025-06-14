import { useState, useEffect, useRef } from 'react';
import {
  Flex, Heading, FormControl, FormLabel, Input, InputGroup, InputRightElement,
  Button, Stack, Text, Link, useToast, IconButton, Image, Select
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import api from '../util/api';

export default function Register() {
  const toast = useToast();
  const nav   = useNavigate();
  const fileInputRef = useRef();

  const [loading, setLoading]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [roles, setRoles] = useState([]);
  const [deps,  setDeps]  = useState([]);

  // form state
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    role_id: '', department_id: '', image_url: ''
  });
  // for enabling/disabling dept select & filtering options
  const [deptOptions, setDeptOptions] = useState([]);
  const [deptDisabled, setDeptDisabled] = useState(false);

  // 1) load roles & departments
  useEffect(() => {
    Promise.all([ api.get('/roles'), api.get('/departments') ])
      .then(([rRes, dRes]) => {
        setRoles(rRes.data);
        setDeps(dRes.data);
      })
      .catch(err => toast({
        title: 'Greška pri učitavanju',
        description: err.message, status: 'error', isClosable: true
      }));
  }, []);

  // 2) whenever role_id changes, adjust departments
  useEffect(() => {
    const role = roles.find(r => String(r.id) === String(form.role_id));
    if (!role) {
      // no role: empty & enabled
      setDeptOptions(deps);
      setDeptDisabled(false);
      setForm(f => ({ ...f, department_id: '' }));
      return;
    }

    switch (role.name) {
      case 'administrator': {
        // only IT
        const itDept = deps.find(d => d.name === 'IT');
        setForm(f => ({ ...f, department_id: itDept?.id || '' }));
        setDeptOptions(itDept ? [itDept] : []);
        setDeptDisabled(true);
        break;
      }
      case 'hr_worker': {
        // only Human Resources
        const hrDept = deps.find(d => d.name === 'Human Resources');
        setForm(f => ({ ...f, department_id: hrDept?.id || '' }));
        setDeptOptions(hrDept ? [hrDept] : []);
        setDeptDisabled(true);
        break;
      }
      case 'employee': {
        // all except Human Resources
        const filtered = deps.filter(d => d.name !== 'Human Resources');
        setDeptOptions(filtered);
        setDeptDisabled(false);
        setForm(f => ({ ...f, department_id: '' }));
        break;
      }
      default: {
        setDeptOptions(deps);
        setDeptDisabled(false);
        setForm(f => ({ ...f, department_id: '' }));
      }
    }
  }, [form.role_id, roles, deps]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // ImgBB upload
  const handleFileChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append('key', process.env.REACT_APP_IMGBB_KEY);
    data.append('image', file);

    try {
      const res = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: data
      }).then(r => r.json());

      if (res.success) {
        setForm(f => ({ ...f, image_url: res.data.url }));
        toast({ title: 'Slika otpremljena', status: 'success', isClosable: true });
      } else {
        throw new Error(res.error.message);
      }
    } catch (err) {
      toast({ title: 'Upload failed', description: err.message, status: 'error', isClosable: true });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setForm(f => ({ ...f, image_url: '' }));
    fileInputRef.current.value = null;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await api.post('/register', form);
      toast({ title: 'Registrovan uspešno!', description: res.data.message,
        status: 'success', duration: 3000, isClosable: true });
      nav('/');
    } catch (err) {
      toast({
        title: 'Greška pri registraciji',
        description: err.response?.data?.message || err.message,
        status: 'error', duration: 4000, isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  // helper to pretty‐print role names:
  const labelForRole = name => {
    switch (name) {
      case 'administrator': return 'Administrator';
      case 'hr_worker':     return 'HR Worker';
      case 'employee':      return 'Employee';
      default:              return name;
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center"
      bgGradient="linear(to-br, pink.50, white)">
      <Stack spacing={6} w={{ base:'90%', md:'450px' }} p={8}
        bg="white" boxShadow="2xl" borderRadius="xl">

        <Flex justify="center">
          <Image src="/images/hr-logo.png" alt="HR Logo" boxSize="80px" />
        </Flex>
        <Heading textAlign="center" color="pink.500">Kreiraj nalog</Heading>

        {/* name / email / password */}
        <FormControl isRequired>
          <FormLabel>Ime i prezime</FormLabel>
          <Input name="name" value={form.name} onChange={handleChange}
            placeholder="Dejana Savatic" focusBorderColor="pink.400" />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Email adresa</FormLabel>
          <Input type="email" name="email" value={form.email}
            onChange={handleChange} placeholder="email@primer.com"
            focusBorderColor="pink.400" />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Lozinka</FormLabel>
          <InputGroup>
            <Input type={showPassword?'text':'password'} name="password"
              value={form.password} onChange={handleChange}
              placeholder="********" focusBorderColor="pink.400" />
            <InputRightElement>
              <IconButton
                variant="ghost"
                icon={showPassword?<ViewOffIcon/>:<ViewIcon/>}
                onClick={()=>setShowPassword(!showPassword)}
                aria-label="Toggle password"
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        {/* role */}
        <FormControl isRequired>
          <FormLabel>Uloga</FormLabel>
          <Select name="role_id" value={form.role_id}
            onChange={handleChange} focusBorderColor="pink.400"
            placeholder="Izaberi ulogu">
            {roles.map(r=>(
              <option key={r.id} value={r.id}>
                {labelForRole(r.name)}
              </option>
            ))}
          </Select>
        </FormControl>

        {/* department */}
        <FormControl isRequired>
          <FormLabel>Odeljenje</FormLabel>
          <Select name="department_id"
            value={form.department_id}
            onChange={handleChange}
            focusBorderColor="pink.400"
            placeholder={deptDisabled ? undefined : 'Izaberi odeljenje'}
            isDisabled={deptDisabled}>
            {deptOptions.map(d=>(
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </Select>
        </FormControl>

        {/* image upload */}
        <FormControl>
          <FormLabel>Slika profila</FormLabel>
          {form.image_url ? (
            <Stack direction="row" align="center" spacing={4}>
              <Image boxSize="80px" src={form.image_url}
                alt="avatar" borderRadius="md" />
              <IconButton
                icon={<DeleteIcon />}
                colorScheme="red"
                aria-label="Ukloni"
                onClick={removeImage}
              />
            </Stack>
          ) : (
            <Button leftIcon={<AddIcon />}
              onClick={()=>fileInputRef.current.click()}
              isLoading={uploading}
              colorScheme="pink"
              variant="outline"
            >
              {uploading?'Otpremanje...':'Otpremi sliku'}
            </Button>
          )}
          <Input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            hidden
          />
        </FormControl>

        <Button
          colorScheme="pink"
          isFullWidth
          isLoading={loading}
          loadingText="Šaljem..."
          onClick={handleSubmit}
        >
          Registruj se
        </Button>

        <Text textAlign="center">
          Već imaš nalog?{' '}
          <Link as={RouterLink} to="/" color="pink.500">
            Prijavi se
          </Link>
        </Text>
      </Stack>
    </Flex>
  );
}

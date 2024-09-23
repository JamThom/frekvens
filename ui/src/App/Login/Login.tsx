import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Stack, Text } from '@chakra-ui/react';
import { useLogin } from '../../api/Auth';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const login = useLogin(isRegister);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password, confirmPassword });
  }

  return (
    <Box maxW="md" mx="auto" mt="8">
      <Text fontSize="2xl" mb="4">
        {isRegister ? 'Register' : 'Login'}
      </Text>
      <form onSubmit={handleSubmit}>
        <Stack spacing="4">
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          {isRegister && (
            <FormControl id="confirmPassword" isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormControl>
          )}
          <Button type="submit" colorScheme="blue">
            {isRegister ? 'Register' : 'Login'}
          </Button>
        </Stack>
      </form>
      <Button
        variant="link"
        mt="4"
        onClick={() => setIsRegister(!isRegister)}
      >
        {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
      </Button>
    </Box>
  );
};

export default Login;
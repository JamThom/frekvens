import { createContext, useContext, useState, ReactNode } from 'react';
import getApiUrl from './getApiUrl';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    accessToken: string | null;
    setAccessToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAccessToken = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return sessionStorage.getItem('accessToken');
};

export const useLogin = (isRegister: boolean) => {

    const context = useContext(AuthContext);
    const toast = useToast();
    const navigate = useNavigate();

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    

  const handleSubmit = async ({ email, password, confirmPassword }: {
    email: string;
    password: string;
    confirmPassword?: string;
    }) => {
    const endpoint = `${getApiUrl()}/${isRegister ? 'register' : 'login'}`;
    const payload = isRegister
      ? { email, password, confirmPassword }
      : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      sessionStorage.setItem('accessToken', data.accessToken);

      toast({
        title: isRegister ? 'Registration successful' : 'Login successful',
        description: data.message,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/stations');
    } catch (error) {
      toast({
        title: 'An error occurred',
        description: (error as {
            message: string;
        }).message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

    return handleSubmit;
};


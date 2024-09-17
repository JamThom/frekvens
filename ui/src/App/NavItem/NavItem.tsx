import { Button } from '@chakra-ui/react'

type NavItemProps = {
  children: React.ReactNode;
  isActive: boolean;
};

function NavItem({
  children,
  isActive
}: NavItemProps) {
  return (
    <Button
      justifyContent="start"
      borderRadius="md"
      padding="4"
      width="100%"
      bg={isActive ? 'gray.200' : 'transparent'}
      size="lg">{children}</Button>
  );
}

export default NavItem;
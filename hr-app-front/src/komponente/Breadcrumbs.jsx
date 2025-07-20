import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Icon
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { Link, useLocation } from 'react-router-dom';

const LABELS = {
  'leave-requests':        'Leave Requests',
  'performance-reviews':   'Performance Reviews',
  'performance-reviews-hr':'Performance Reviews',
  'leave-requests-hr': 'Leave Requests',
  'world-map': 'Our Locations',
  'view-users':            'Users',
  // etc...
};

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  // pathname = '/leave-requests'
  // split('/') = ['', 'leave-requests']
  // Boolean --> true ili false
  // falsy --> false, 0, '', null, undefined, NaN
  // truthy --> sve ostale
  // nakon filter --> ['leave-requests']
  const parts = pathname.split('/').filter(Boolean);

  // Determine home vs admin-dashboard
  const isAdminHome = pathname.startsWith('/admin-dashboard');
  const homePath    = isAdminHome ? '/admin-dashboard' : '/home';
  const homeLabel   = isAdminHome ? 'Admin Dashboard' : 'Home';

  // Don’t render on public or top‐level home pages
  if (
    parts.length === 0 ||              // "/"
    parts[0] === 'register' ||         // "/register"
    pathname === '/home' ||
    pathname === '/admin-dashboard'
  ) {
    return null;
  }

  return (
    <Box
      bg="white"
      px={{ base: 4, md: 8 }}
      py={2}
      boxShadow="sm"
      mb={4}
    >
      <Breadcrumb
        spacing="8px"
        separator={<Icon as={ChevronRightIcon} color="gray.400" />}
        fontSize="sm"
      >
        {/* First crumb */}
        <BreadcrumbItem>
          <BreadcrumbLink
            as={Link}
            to={homePath}
            color="pink.500"
          >
            {homeLabel}
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Remaining crumbs */}
        {parts.map((segment, idx) => {
          const to     = '/' + parts.slice(0, idx + 1).join('/');
          const isLast = idx === parts.length - 1;
          const label  = LABELS[segment] || segment;

          return (
            <BreadcrumbItem key={to} isCurrentPage={isLast}>
              {isLast ? (
                <BreadcrumbLink color="gray.700">
                  {label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbLink
                  as={Link}
                  to={to}
                  _hover={{ color: 'pink.500' }}
                >
                  {label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          );
        })}
      </Breadcrumb>
    </Box>
  );
}

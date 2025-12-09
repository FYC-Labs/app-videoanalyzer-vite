export const fetchCurrentUserMock = {
  id: 'usr_1234',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '555-123-4567',
  organizationId: 'org_5678',
  status: 'ACTIVE',
  createdAt: '2025-03-06T08:00:00.000Z',
  updatedAt: '2025-03-06T12:00:00.000Z',
};

export const fetchCurrentUserOrganizationMock = {
  id: 'org_5678',
  name: 'ABC Contractors',
  email: 'contact@abccontractors.com',
  phone: '555-987-6543',
  city: 'New York',
  state: 'NY',
  zip: '10001',
  type: 'SERVICE_PROVIDER',
  createdAt: '2025-02-15T08:00:00.000Z',
  updatedAt: '2025-03-06T12:00:00.000Z',
};

export const fetchUsersMock = [
  {
    id: 'usr_1234',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '555-123-4567',
    organizationId: 'org_5678',
    status: 'ACTIVE',
    createdAt: '2025-03-06T08:00:00.000Z',
    updatedAt: '2025-03-06T12:00:00.000Z',
  },
  {
    id: 'usr_5678',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '555-987-6543',
    organizationId: 'org_5678',
    status: 'ACTIVE',
    createdAt: '2025-02-20T10:30:00.000Z',
    updatedAt: '2025-03-06T11:45:00.000Z',
  },
];

export const fetchUserByIdMock = {
  id: 'usr_1234',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '555-123-4567',
  organizationId: 'org_5678',
  status: 'ACTIVE',
  createdAt: '2025-03-06T08:00:00.000Z',
  updatedAt: '2025-03-06T12:00:00.000Z',
};

export const createUserMock = {
  id: 'usr_6789',
  firstName: 'Alice',
  lastName: 'Brown',
  email: 'alice.brown@example.com',
  phone: '555-777-8888',
  organizationId: 'org_5432',
  status: 'PENDING',
  createdAt: '2025-03-06T14:20:00.000Z',
  updatedAt: '2025-03-06T14:20:00.000Z',
};

export const updateUserMock = {
  id: 'usr_6789',
  firstName: 'Alice',
  lastName: 'Brown',
  email: 'alice.brown@example.com',
  phone: '555-777-8888',
  organizationId: 'org_5432',
  status: 'ACTIVE',
  createdAt: '2025-03-06T14:20:00.000Z',
  updatedAt: '2025-03-06T15:00:00.000Z',
};

export const deleteUserMock = {
  id: 'usr_6789',
  deleted: true,
  message: 'User successfully deleted.',
};

export const getUsersMock = {
  firstName: 'First Name from signal',
  lastName: 'Last Name',
};

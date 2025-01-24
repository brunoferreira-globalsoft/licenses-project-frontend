export interface CreateUserDTO {
  clienteId: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  perfilId: string;
  roleId: string;
}

export interface UpdateUserDTO {
  clienteId: string;
  email: string;
  firstName: string;
  isActive: boolean;
  lastName: string;
  phoneNumber?: string;
  perfilId: string;
  roleId: string;
}

export interface UserDTO {
  clienteId?: string;
  firstName: string;
  id?: string;
  isActive?: boolean;
  lastName: string;
  email: string;
  password?: string;
  perfisUtilizador?: string[];
  roleId: string;
}

// Helper functions
export const toCreateUserDTO = (user: UserDTO): CreateUserDTO => ({
  clienteId: user.clienteId ?? '',
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  password: user.password ?? '',
  perfilId: '',
  roleId: user.roleId
});

export const toUpdateUserDTO = (
  user: UserDTO,
  perfilId: string
): UpdateUserDTO => ({
  clienteId: user.clienteId ?? '',
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  isActive: user.isActive ?? false,
  perfilId: perfilId ?? '',
  roleId: user.roleId,
  phoneNumber: ''
});

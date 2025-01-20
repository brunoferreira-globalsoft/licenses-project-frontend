export class CreateUser {
  clienteId = '';
  email = '';
  firstName = '';
  lastName = '';
  password = '';
  perfilId = '';
  roleId = '';
}

export class UpdateUser {
  clienteId = '';
  email = '';
  firstName = '';
  isActive = false;
  lastName = '';
  phoneNumber?: string = '';
  perfilId = '';
  roleId = '';
}

export class User {
  clienteId?: string;
  firstName: string;
  id?: string;
  isActive?: boolean;
  lastName: string;
  email: string;
  password?: string;
  perfisUtilizador?: string[];
  roleId: string;

  constructor(
    firstName = '',
    lastName = '',
    email = '',
    password = '',
    roleId = '',
    isActive = false,
    id?: string,
    clienteId?: string,
    perfisUtilizador?: string[]
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.roleId = roleId;
    this.isActive = isActive;
    this.id = id;
    this.clienteId = clienteId;
    this.perfisUtilizador = perfisUtilizador;
  }

  static toCreateUser(user: User): CreateUser {
    const n: CreateUser = new CreateUser();
    n.email = user.email;
    n.firstName = user.firstName;
    n.lastName = user.lastName;
    n.password = user.password ?? '';
    n.roleId = user.roleId;
    n.clienteId = user.clienteId ?? '';
    return n;
  }

  static toUpdateUser(user: User, perfilId: string): UpdateUser {
    const n: UpdateUser = new UpdateUser();
    n.email = user.email;
    n.firstName = user.firstName;
    n.lastName = user.lastName;
    n.roleId = user.roleId;
    n.isActive = user.isActive ?? false;
    n.clienteId = user.clienteId ?? '';
    n.perfilId = perfilId ?? '';
    return n;
  }
}

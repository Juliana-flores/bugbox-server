export const extractServer = (address: string): string => {
  const [server] = address.split('@');
  if (!server) {
    return '';
  }

  const [name] = server.split('.');

  return name;
};

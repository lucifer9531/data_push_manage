export const buildDeletePayload = (data) => {
  let interfaceCodes = '';
  let interfaceId = '';
  let name = '';

  if (!Array.isArray(data)) {
    interfaceCodes = data.code;
    interfaceId = data.interfaceId;
    name = data.name;
  }
  return {
    interfaceId,
    interfaceCodes,
    name,
  };
};

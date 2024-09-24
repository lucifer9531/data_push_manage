export const buildDeletePayload = (data) => {
  let strategyIds = '';
  let interfaceCodes = '';

  if (Array.isArray(data)) {
    strategyIds = data.map((item) => item.strategyId).join(',');
    interfaceCodes = data.map((item) => item.interfaceCode).join(',');
  } else {
    strategyIds = data.strategyId;
    interfaceCodes = data.interfaceCode;
  }
  return {
    strategyIds,
    interfaceCodes,
  };
};

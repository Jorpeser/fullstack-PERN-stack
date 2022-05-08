// Funcion para saber si estamos en el servidor o en el cliente
export const isServer = () => typeof window === 'undefined';
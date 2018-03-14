export const initOptInOut = async (options) => {
  const initOptInOut = ClientFunction(() => {
    window.optouthandler = OptInOut(options); 
    return window.optouthandler; 
  }); 

  return await initOptInOut(); 
};
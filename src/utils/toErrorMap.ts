const toErrorMap = (errors: []): Record<string, string> => {
  const errorMap: Record<string, string> = {};
  errors.forEach(({ field, message }) => {
    errorMap[field] = message;
  });

  return errorMap;
};

export default toErrorMap;

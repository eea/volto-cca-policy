export function composeSchema() {
  const enhancers = Array.from(arguments);
  const composer = (args) => {
    const props = enhancers.reduce(
      (acc, enhancer) => (enhancer ? { ...acc, schema: enhancer(acc) } : acc),
      { ...args },
    );
    return props.schema;
  };
  return composer;
}

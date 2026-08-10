export default function withClientOnly(WrappedComponent) {
  const WithClientWrappedComponent = (props) => {
    return __SERVER__ ? null : <WrappedComponent {...props} />;
  };

  return WithClientWrappedComponent;
}

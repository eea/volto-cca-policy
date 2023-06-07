export default function clientOnly(WrappedComponent) {
  const WithClientWrappedComponent = (props) => {
    return __SERVER__ ? null : <WrappedComponent {...props} />;
  };

  return WithClientWrappedComponent;
}

const ShareInfo = (props) => {
  return (
    <div className="share-info">
      <a href="/help/share-your-info">
        <button className="ui button primary icon labeled">
          Share your information
          <i aria-hidden="true" className="arrow right icon"></i>
        </button>
      </a>
    </div>
  );
};

export default ShareInfo;

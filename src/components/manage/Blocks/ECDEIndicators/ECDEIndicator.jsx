import superagent from 'superagent';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchContent, getContent } from '@plone/volto/actions';

function useIndicator(path) {
  const dispatch = useDispatch();

  // React.useEffect(() => {
  //   const action = getContent(path);
  //   console.log("BBB", action);
  // }, [dispatch, path]);

  React.useEffect(() => {
    const action = getContent(
      {
        url: path,
        subrequest: 'ecde_indicator_content',
        fullobjects: true
      }
    );
    dispatch(action);

    console.log(action);
  }, [dispatch, path]);

  return null;
}

export default function ECDEIndicator(props) {
  const { indicatorUrl } = props;
  const indicator = useIndicator(indicatorUrl);

  console.log("AAA", indicator);
  return null;
  // return (
  //   <>
  //     <div> {indicatorUrl} </div>
  //     <h4>{indicator.title}</h4>
  //     <p>{indicator.description}</p>
  //   </>
  // );
}

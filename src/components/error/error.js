import React, { useState, useEffect }  from 'react';
import { Link } from 'react-router-dom';

const Error = (props) => {

  const [title, setTitle] = useState('Ошибка :(');
  const [body, setBody] = useState('Что-то пошло не так.');
  const [redirectToLink, setRedirectToLink] = useState('/');
  const [redirectToText, setRedirectToText] = useState('Вернуться на главную');



  useEffect(() => {
    if (props.location.state) {
      const {title, body, redirectToLink, redirectToText} = props.location.state;
      setTitle(title);
      setBody(body);
      setRedirectToLink(redirectToLink);
      setRedirectToText(redirectToText);
    }
  }, [])

  return (
    <div>
      <h1>{title}</h1>
      <p>{body}</p>
      <Link className="btn btn-primary" to={redirectToLink}>{redirectToText}</Link>
    </div>
  )
}

export default Error;
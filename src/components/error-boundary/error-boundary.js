import React  from 'react';
import {Link} from "react-router-dom";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Обновить состояние с тем, чтобы следующий рендер показал запасной UI.
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // Можно отрендерить запасной UI произвольного вида
      return(
        <React.Fragment>
          <h1>Что-то пошло не так.</h1>
          <Link to={'/'} className={'btn btn-primary'}>Вернуться на главную</Link>
        </React.Fragment>
      )
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
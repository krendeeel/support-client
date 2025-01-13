export const withAuth = (Component) => {
  return (props) => {
    const queryParams = new URLSearchParams(window.location.search);
    const queryToken = queryParams.get('token');
    const localToken = localStorage.getItem('token');

    if (!queryToken && !localToken) {
      return window.location.replace(import.meta.env.VITE_AUTH_URL);
    }

    if (queryToken) {
      queryParams.delete('token');
      localStorage.setItem('token', queryToken);
      window.history.replaceState({}, '', window.location.pathname);
    }

    return <Component {...props} />;
  };
};

export const loginRequired = (loggedIn, prevProps, history) => {
  if (loggedIn !== prevProps.loggedIn) {
    if (!loggedIn) {
      history.push('/signin');
    }
  }
};

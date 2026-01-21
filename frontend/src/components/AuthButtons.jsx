import { useAuth } from '../context/AuthContext';

const AuthButtons = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      {isAuthenticated ? (
        <>
          <span>Welcome, {user.name} 👋</span>
          <button onClick={() => logout({ returnTo: window.location.origin })}>
            Log Out
          </button>
        </>
      ) : (
        <button onClick={() => loginWithRedirect()}>
          Log In
        </button>
      )}
    </div>
  );
};

export default AuthButtons;

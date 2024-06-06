import './loginLinkSec.css';
function LoginLink(props) {
  function showResetPasswordForm() {
    props.showResetPasswordForm('show');
    props.hideLoginForm('');
  }

  return (
    <div className="login-links">
      <p>
        New User?{' '}
        <span>
          {' '}
          <a href="#">Sign up</a>
        </span>
      </p>
      <a href="#" onClick={showResetPasswordForm}>
        Forget Password ?
      </a>
    </div>
  );
}
export default LoginLink;

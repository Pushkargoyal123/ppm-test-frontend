import RegistrationModal from "../logged_out/components/register_login/RegistrationModal";
import LoginModal from "../logged_out/components/register_login/LoginModal";
import VerifyModal from "../logged_out/components/register_login/VerifyModal";
import ResetPasswordModal from "../logged_out/components/register_login/ResetPasswordModal";
import ChangePasswordModal from "../logged_out/components/register_login/ChangePasswordModal";

export default function CalledModal(open, setGeneratedOTP, setEmail, generatedOTP, setOpen,body, setBody, loginEmail, setLoginEmail, email, password, setPassword, setLoginPassword, loginPassword){

    if (body === 1)
      return <LoginModal
        open={open}
        setOpen={setOpen}
        setBody={setBody}
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        email={email}
        password={password}
        setPassword={setPassword}
        setLoginPassword={setLoginPassword}
        loginPassword={loginPassword}
      />
    else if (body === 2)
      return <RegistrationModal
        setGeneratedOTP={setGeneratedOTP}
        open={open}
        setOpen={setOpen}
        setBody={setBody}
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        setEmail={setEmail}
        email={email}
        password={password}
        setPassword={setPassword}
        setLoginPassword={setLoginPassword}
        loginPassword={loginPassword}
      />
    else if (body === 3)
      return <VerifyModal
      open={open}
      setOpen={setOpen}
      setBody={setBody}
      loginEmail={loginEmail}
      setLoginEmail={setLoginEmail}
      email={email}
      password={password}
      setPassword={setPassword}
      setLoginPassword={setLoginPassword}
      loginPassword={loginPassword}
      setGeneratedOTP = {setGeneratedOTP}
      generatedOTP = {generatedOTP}
      />
    else if (body === 4)
      return <ResetPasswordModal
        open={open}
        setOpen={setOpen}
        setBody={setBody}
      />
    else if (body === 5)
      return <ChangePasswordModal
        open={open}
        setOpen={setOpen}
        setBody={setBody}
      />
}
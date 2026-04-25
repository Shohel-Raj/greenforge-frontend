import RegisterForm from "@/components/modules/Auth/RegisterForm";

const RegisterPage = async () => {
  const redirectPath =  '/login';
  return (
    <RegisterForm redirectPath={redirectPath}/>
  )
}

export default RegisterPage
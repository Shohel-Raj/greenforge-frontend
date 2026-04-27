import VerifyEmailForm from "@/components/modules/Auth/verifyEmailForm";

interface VerifyEmailPageProps {
  searchParams: {
    email?: string;
  };
}

const VerifyEmailPage = async ({ searchParams }: VerifyEmailPageProps) => {

  const {email} =await searchParams;

  return <VerifyEmailForm email={email} />;
};

export default VerifyEmailPage;
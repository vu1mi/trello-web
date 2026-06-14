import {useEffect ,useState} from 'react';
import { useSearchParams , Navigate } from 'react-router-dom';
import PageLoadingSpinner from "~/components/Loading/PageLoadingSpinner";
import { verifyAccountAPI } from '~/apis/index.js'; 

function AccountVerification() {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    const [verificationStatus, setVerificationStatus] = useState(false);

    useEffect(() => {
  
        if (email && token) {
            verifyAccountAPI({ email, token }).then(() => {
                setVerificationStatus(true);
            });
        }
    }, [email, token]);

    if (!email || !token) {
        return <Navigate to="/404" />;
    }
    // if (!verificationStatus) {
    //     return <PageLoadingSpinner caption="Verifying account..." />;
    // }

    

    return <Navigate to={`/login?verifiedEmail=${email}`} />;
}

export default AccountVerification; 
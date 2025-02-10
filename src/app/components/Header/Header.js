import { useCredits } from '@/context/CreditsContext';
import { GOOGLE_CLIENT_ID } from '@/lib/contants';
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConnectModal, useCurrentAccount } from '@mysten/dapp-kit';
import { GoogleLogin, googleLogout, GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect, useState } from 'react';
import styles from './Header.module.css';

const clientId = GOOGLE_CLIENT_ID;

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const { credits, setCredits } = useCredits();
  const [open, setOpen] = useState(false);

  const currentAccount = useCurrentAccount();

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");

    const storedGoogleCredential = localStorage.getItem("googleCredential");
    if (storedGoogleCredential) {
      setIsLoggedIn(true);
      fetchUserDetails(storedGoogleCredential);
    }
  }, []);

  const fetchUserDetails = (googleCredential) => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ google_credential: googleCredential }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch user details: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("User Details:", data);
        setUserName(data.name);
        setCredits(data.credits);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  };

  const handleLoginSuccess = (credentialResponse) => {
    console.log('Login Success:', credentialResponse);
    const googleCredential = credentialResponse.credential;

    setIsLoggedIn(true);
    localStorage.setItem("googleCredential", googleCredential);
    fetchUserDetails(googleCredential);
  };

  const handleLogout = () => {
    googleLogout();
    setIsLoggedIn(false);
    setUserName('');
    localStorage.removeItem("googleCredential");
  };

  console.log("Wallet address:", currentAccount?.address);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className={`${styles.header}`}>
        <div className="d-flex justify-content-between">
          <div className={styles.session}>
            <h5 className={styles.heading} style={{ fontWeight: 'bold' }}>
              Session: <span style={{ fontWeight: '400' }}>Default Project</span>
            </h5>
          </div>
          <div className={`${styles.rightSide} d-flex`}>
            {isLoggedIn && (
              <>
                <ConnectModal
                  trigger={
                    <button className={styles.credit} disabled={!!currentAccount}> {currentAccount ? 'Connected' : 'Connect Wallet'}</button>
                  }
                  open={open}
                  onOpenChange={(isOpen) => setOpen(isOpen)}
                />
                <div className={`${styles.credit}`}>
                  <h5 className={styles.heading}>Credit Balance: {credits} coins</h5>
                </div>
              </>
            )}
            <div className={`dropdown ${styles.dropdown}`}>
              <div
                className={`${styles.userAccount} d-flex align-items-center`}
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ cursor: 'pointer' }}
              >
                <h5 className={styles.heading}>
                  {isLoggedIn ? `Welcome, ${userName}` : 'User Account'}
                </h5>
                <div className={styles.iconContainer}>
                  <FontAwesomeIcon icon={faCircleUser} className="ms-2 icon" style={{ fontSize: '22px' }} />
                </div>
              </div>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                {!isLoggedIn ? (
                  <li>
                    <GoogleLogin
                      onSuccess={handleLoginSuccess}
                      onError={() => console.log('Login Failed')}
                      useOneTap
                    />
                  </li>
                ) : (
                  <>
                    <li>
                      <p className="dropdown-item">
                        Welcome, <b>{userName}</b>
                      </p>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#" onClick={handleLogout}>
                        Log Out
                      </a>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
        {currentAccount && (
          <div className='d-flex justify-content-end gap-1 mt-2'>
            <span className='fw-bold'>Wallet address: </span>
            {currentAccount.address}
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

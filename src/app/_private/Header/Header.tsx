import { useEffect, useRef, useState } from 'react';
import { GOOGLE_CLIENT_ID } from '@/lib/contants';
import { useUser } from '@/context/UserContext';
import { ConnectModal, useCurrentAccount } from '@mysten/dapp-kit';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import styles from './Header.module.css';

const clientId = GOOGLE_CLIENT_ID;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn, userName, credits, handleLoginSuccess, handleLogout } = useUser();
  const currentAccount = useCurrentAccount();

  useEffect(() => {
    const handleClickOutside = (event: { target: Node | null; }) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    // @ts-expect-error any
    document.addEventListener('mousedown', handleClickOutside);
    // @ts-expect-error any
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
                    <button className={styles.credit}
                            disabled={!!currentAccount}> {currentAccount ? 'Connected' : 'Connect Wallet'}</button>
                  }
                  open={open}
                  onOpenChange={(isOpen) => setOpen(isOpen)}
                />
                <div className={`${styles.credit}`}>
                  <h5 className={styles.heading}>Credit Balance: {credits} coins</h5>
                </div>
              </>
            )}
            <div className={`${styles.dropdown}`} ref={dropdownRef}>
              <div
                className={`${styles.userAccount} d-flex align-items-center`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ cursor: 'pointer' }}
              >
                <h5 className={styles.heading}>
                  {isLoggedIn ? `Welcome, ${userName}` : 'User Account'}
                </h5>
                <div className={styles.iconContainer}>
                  {/*<FontAwesomeIcon icon={faCircleUser} className="ms-2 icon" style={{ fontSize: '22px' }} />*/}
                </div>
              </div>
              {dropdownOpen && (
                <div className={styles.dropdownMenu}>
                  {!isLoggedIn ? (
                    <div className={styles.dropdownItem}>
                      <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        onError={() => console.log('Login Failed')}
                        useOneTap
                      />
                    </div>
                  ) : (
                    <>
                      <div className={styles.dropdownItem}>
                        <p>
                          Welcome, <b>{userName}</b>
                        </p>
                      </div>
                      <div
                        className={styles.dropdownItem}
                        onClick={handleLogout}
                      >
                        Log Out
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {currentAccount && (
          <div className="d-flex justify-content-end gap-1 mt-2">
            <span className="fw-bold">Wallet address: </span>
            {currentAccount.address}
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

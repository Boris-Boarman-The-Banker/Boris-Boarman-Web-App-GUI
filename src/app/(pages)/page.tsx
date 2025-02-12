"use client";
import { useUser } from "@/context/UserContext";
import { ConnectModal, useCurrentAccount } from '@mysten/dapp-kit';
import '@mysten/dapp-kit/dist/index.css';
import React, { useState } from "react";
import Header from "../components/Header/Header";
import styles from "../Home.module.css";
import { useSuiFundRelease } from "@/lib/sui";

// Types
interface TxDetails {
  digest: string;
  network: string;
}

interface FormState {
  executiveSummary: string;
  problemStatement: string;
  feasibilityPlan: string;
  feasibility: string;
  teamSkillsProfile: string;
  teamSkills: string;
}

interface ScoreState {
  problemScore: number;
  feasibilityScore: number;
  teamSkillsScore: number;
}

export default function Page() {
  // Form state
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    executiveSummary: "Boris Boarman is a specialized platform designed to evaluate and guide project proposals for crypto foundation grants. With a focus on the blockchain ecosystem, Boris assists users in refining their project ideas to ensure alignment with relevant grant opportunities. The platform offers comprehensive evaluations, including feasibility analysis, market size projections, and impact assessments.",
    problemStatement: "Describe the problem this project will solve and why it matters. Include any helpful data or statistics to back up your points.",
    feasibilityPlan: "",
    feasibility: "Feasibility analysis will appear here.",
    teamSkillsProfile: "",
    teamSkills: "Team skills evaluation will appear here."
  });

  // Score state
  const [scores, setScores] = useState<ScoreState>({
    problemScore: 0,
    feasibilityScore: 0,
    teamSkillsScore: 0
  });

  // UI state
  const [activeAccordion, setActiveAccordion] = useState<number | null>(1);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false);
  const [txDetails, setTxDetails] = useState<TxDetails | null>(null);
  const [eligible, setEligible] = useState(false);
  const [isClaimLoading, setIsClaimLoading] = useState(false);

  // Session state
  const [uniqueSessionId] = useState(() => crypto.randomUUID());

  // External hooks
  const currentAccount = useCurrentAccount();
  const { executeFunction } = useSuiFundRelease({ currentAccount });
  const { isLoggedIn, googleCredential, fetchUserDetails } = useUser();

  const totalScore = scores.problemScore + scores.feasibilityScore + scores.teamSkillsScore;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const clearText = () => setText("");

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleSubmit = async (step: number) => {
    if (!activeAccordion) return;
    setSubmitting(true);

    const selection = step === 1 ? ["executiveSummary"] 
                   : step === 2 ? ["feasibilityPlan"]
                   : ["teamSkillsProfile"];

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/form`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uniqueSessionId,
          projectIdea: text,
          google_credential: googleCredential,
          apiSelection: selection,
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();

      // Update form state based on step
      if (step === 1) {
        setFormState(prev => ({
          ...prev,
          executiveSummary: data.executiveSummary,
          problemStatement: data.problemStatement
        }));
        setScores(prev => ({ ...prev, problemScore: data.score }));
      } else if (step === 2) {
        setFormState(prev => ({
          ...prev,
          feasibilityPlan: data.feasibilityPlan,
          feasibility: data.feasibilityScoreReasoning || "Feasibility details not available."
        }));
        setScores(prev => ({ ...prev, feasibilityScore: data.feasibilityScore || 0 }));
      } else if (step === 3) {
        setFormState(prev => ({
          ...prev,
          teamSkillsProfile: data.teamSkillsProfile,
          teamSkills: data.teamSkillsScoreReasoning || "Team skills details not available."
        }));
        setScores(prev => ({ ...prev, teamSkillsScore: data.teamSkillsScore || 0 }));
      }

      // Update user credits and check eligibility
      if (googleCredential) {
        fetchUserDetails(googleCredential);
        const eligibilityResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/claim?google_credential=${googleCredential}&uniqueSessionId=${uniqueSessionId}`
        );
        const eligibilityData = await eligibilityResponse.json();
        setEligible(eligibilityData.eligible);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClaimFunds = async () => {
    if (!currentAccount) {
      alert('Please connect your wallet first');
      return;
    }

    setIsClaimLoading(true);
    try {
      const result = await executeFunction();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          google_credential: googleCredential,
          uniqueSessionId,
          digest: result.digest,
        }),
      });

      const data = await response.json();
      setTxDetails({ digest: data.transactionDigest, network: data.network });
      setShowTxModal(true);
    } catch (error) {
      alert("Error claiming funds: " + (error as Error).message);
      console.error("Error claiming funds:", error);
    } finally {
      setIsClaimLoading(false);
    }
  };

  console.log(txDetails);
  return (
    <>
      <Header />
      {isClaimLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingContent}>
            <div className={styles.loadingSpinner}></div>
            <p>Processing your claim...</p>
          </div>
        </div>
      )}
      {showTxModal && txDetails && (
        <div className={styles.modalOverlay} onClick={() => setShowTxModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Transaction Details</h3>
              <button className={styles.closeButton} onClick={() => setShowTxModal(false)}>×</button>
            </div>
            <div className={styles.modalContent}>
              <iframe 
                src={`https://suiscan.xyz/${txDetails.network}/tx/${txDetails.digest}`}
                width="100%"
                height="600px"
                frameBorder="0"
              />
            </div>
          </div>
        </div>
      )}
      <div className={styles.mainBody}>
        <div className={styles.leftSide}>
          <div className={styles.executiveSummary}>
            <h3>Executive Summary</h3>
            <p>{formState.executiveSummary}</p>
          </div>

          <div className={styles.problemStatement}>
            <h3>
              {activeAccordion === 1
                ? "Problem Statement"
                : activeAccordion === 2
                  ? "Feasibility"
                  : activeAccordion === 3
                    ? "Team Skills"
                    : "Problem Statement"}
            </h3>
            <div className={styles.problemContent}>
              {activeAccordion === 1 &&
                (submitting
                  ? "Generating summary, please wait..."
                  : formState.problemStatement || "Awaiting response...")}
              {activeAccordion === 2 &&
                (submitting
                  ? "Generating summary, please wait..."
                  : formState.feasibilityPlan || "Awaiting response")}
              {activeAccordion === 3 &&
                (submitting
                  ? "Generating summary, please wait..."
                  : formState.teamSkillsProfile || "Awaiting response...")}
            </div>
          </div>

          <div className={styles.userInput}>
            <div className={styles.character}>
              <h3>User Input</h3>
              <p className={styles.wordcount}>{text.length}/ 2000 characters</p>
            </div>
            <div className={styles.form} style={{ position: "relative" }}>
              <textarea
                value={text}
                onChange={handleChange}
                className={styles.textarea}
                maxLength={2000}
                placeholder={
                  !isLoggedIn
                    ? "Login is Required to use this Feature"
                    : "Enter your text here..."
                }
                disabled={!isLoggedIn}
              ></textarea>

              <div className={styles.resetIcon} onClick={clearText}>
                {text.length > 0 && (
                  <span className={styles.icon}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.6054 7.70537C16.8708 6.96718 15.9972 6.38183 15.0351 5.98308C14.073 5.58435 13.0414 5.38013 12 5.38222C9.89717 5.38222 7.88054 6.21757 6.39364 7.70446C4.90674 9.19136 4.07141 11.208 4.07141 13.3107C4.07141 15.4146 4.9064 17.4323 6.39299 18.9209C7.87958 20.4095 9.89622 21.2472 12 21.25C14.1037 21.2472 16.1204 20.4095 17.607 18.9209C19.0936 17.4323 19.9286 15.4146 19.9286 13.3107"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M16.8808 2.75L17.8292 6.60772C17.913 6.94965 17.858 7.31085 17.6763 7.61238C17.4945 7.9139 17.2009 8.13125 16.8594 8.21689L12.9911 9.16532"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
              </div>

              {!currentAccount ? (
                <ConnectModal
                  trigger={
                    <button className={styles.processBtn}>Connect Wallet</button>
                  }
                  open={walletModalOpen}
                  onOpenChange={(isOpen) => setWalletModalOpen(isOpen)}
                />
              ) : (
                <button
                  disabled={text.length < 140 || !isLoggedIn || submitting}
                  onClick={() => handleSubmit(activeAccordion || 1)}
                  className={styles.processBtn}
                >
                  {submitting ? "Processing..." : "Process"}
                </button>
              )}

            </div>
          </div>
        </div>

        <div className={styles.rightSide}>
          <div className={styles.rightHeader}>
            <div className={styles.scoreContainer}>
              <h2 className={styles.score}>Total Score - {totalScore}/300</h2>
              <button 
                className={styles.claimFundsBtn}
                onClick={handleClaimFunds}
                disabled={!eligible}
              >
                Claim Funds
              </button>
            </div>
          </div>

          <div className={styles.accordions}>
            <div className={styles.accordion}>
              <button
                className={styles.accordionButton}
                onClick={() => toggleAccordion(1)}
              >
                1 - Problem Statement - {scores.problemScore}/100
              </button>
              {activeAccordion === 1 && (
                <div className={styles.accordionContent}>
                  <p>{formState.problemStatement}</p>
                </div>
              )}
            </div>

            <div className={styles.accordion}>
              <button
                className={styles.accordionButton}
                onClick={() => toggleAccordion(2)}
              >
                2 - Feasibility - {scores.feasibilityScore}/100
              </button>
              {activeAccordion === 2 && (
                <div className={styles.accordionContent}>
                  <p>{formState.feasibility}</p>
                </div>
              )}
            </div>

            <div className={styles.accordion}>
              <button
                className={styles.accordionButton}
                onClick={() => toggleAccordion(3)}
              >
                3 - Team Skills - {scores.teamSkillsScore}/100
              </button>
              {activeAccordion === 3 && (
                <div className={styles.accordionContent}>
                  <p>{formState.teamSkills}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

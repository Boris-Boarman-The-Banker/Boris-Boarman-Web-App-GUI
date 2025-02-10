"use client";
import { useCredits } from "@/context/CreditsContext";
import { ConnectModal, useCurrentAccount } from '@mysten/dapp-kit';
import '@mysten/dapp-kit/dist/index.css';
import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import styles from "../Home.module.css";

export default function Page() {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [executiveSummary, setExecutiveSummary] = useState(
    "Boris Boarman is a specialized platform designed to evaluate and guide project proposals for crypto foundation grants. With a focus on the blockchain ecosystem, Boris assists users in refining their project ideas to ensure alignment with relevant grant opportunities. The platform offers comprehensive evaluations, including feasibility analysis, market size projections, and impact assessments."
  );
  const [problemStatement, setProblemStatement] = useState(
    "Describe the problem this project will solve and why it matters. Include any helpful data or statistics to back up your points."
  );
  const [feasibilityPlan, setFeasibilityPlan] = useState("");
  const [feasibility, setFeasibility] = useState(
    "Feasibility analysis will appear here."
  );
  const [teamSkillsProfile, setTeamSkillsProfile] = useState("");
  const [teamSkills, setTeamSkills] = useState(
    "Team skills evaluation will appear here."
  );
  const [score, setScore] = useState(0);
  const [feasibilityScore, setFeasibilityScore] = useState(0);
  const [teamSkillsScore, setTeamSkillsScore] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);

  const currentAccount = useCurrentAccount();
  const { setCredits } = useCredits();

  useEffect(() => {
    const storedGoogleCredential = localStorage.getItem("googleCredential");
    if (storedGoogleCredential) {
      setIsLoggedIn(true);
      fetchUserDetails(storedGoogleCredential);
    }
  }, []);

  const fetchUserDetails = (googleCredential: string) => {
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
        setCredits(data.credits);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const TotalScore = score + teamSkillsScore + feasibilityScore;

  const clearText = () => {
    setText("");
  };

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleSubmit = (step: number) => {
    if (!activeAccordion) return;

    setSubmitting(true);

    const clientId = localStorage.getItem("clientId");
    const googleCredential = localStorage.getItem("googleCredential");

    let selection: string[] = [];
    if (step === 1) {
      selection = ["executiveSummary"];
    } else if (step === 2) {
      selection = ["feasibilityPlan"];
    } else if (step === 3) {
      selection = ["teamSkillsProfile"];
    }

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/form`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectIdea: text,
        google_client_id: clientId,
        google_credential: googleCredential,
        apiSelection: selection,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        if (step === 1) {
          setExecutiveSummary(data.executiveSummary);
          setProblemStatement(data.problemStatement);
          setScore(data.score);
          setFeasibilityScore(feasibilityScore || 0);
          setTeamSkillsScore(teamSkillsScore || 0);
        } else if (step === 2) {
          setFeasibilityPlan(data.feasibilityPlan);
          setFeasibility(
            data.feasibilityScoreReasoning ||
            "Feasibility details not available."
          );
          setScore(score || 0);
          setFeasibilityScore(data.feasibilityScore || 0);
        } else if (step === 3) {
          setTeamSkillsProfile(data.teamSkillsProfile);
          setTeamSkills(
            data.teamSkillsScoreReasoning ||
            "Team skills details not available."
          );
          setScore(score || 0);
          setFeasibilityScore(feasibilityScore || 0);
          setTeamSkillsScore(data.teamSkillsScore || 0);
        }

        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ google_credential: googleCredential }),
        })
          .then((res) => res.json())
          .then((userData) => setCredits(userData.credits));
      })
      .catch((error) => {
        console.error("Error:", error.message);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <>
      <Header />
      <div className={styles.mainBody}>
        <div className={styles.leftSide}>
          <div className={styles.executiveSummary}>
            <h3>Executive Summary</h3>
            <p>{executiveSummary}</p>
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
                  : problemStatement || "Awaiting response...")}
              {activeAccordion === 2 &&
                (submitting
                  ? "Generating summary, please wait..."
                  : feasibilityPlan || "Awaiting response")}
              {activeAccordion === 3 &&
                (submitting
                  ? "Generating summary, please wait..."
                  : teamSkillsProfile || "Awaiting response...")}
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
                  open={open}
                  onOpenChange={(isOpen) => setOpen(isOpen)}
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
            <h2 className={styles.score}>Total Score - {TotalScore}/300</h2>
          </div>
          <div className={styles.accordions}>
            <div className={styles.accordion}>
              <button
                className={styles.accordionButton}
                onClick={() => toggleAccordion(1)}
              >
                1 - Problem Statement - {score}/100
              </button>
              {activeAccordion === 1 && (
                <div className={styles.accordionContent}>
                  <p>{problemStatement}</p>
                </div>
              )}
            </div>

            <div className={styles.accordion}>
              <button
                className={styles.accordionButton}
                onClick={() => toggleAccordion(2)}
              >
                2 - Feasibility - {feasibilityScore}/100
              </button>
              {activeAccordion === 2 && (
                <div className={styles.accordionContent}>
                  <p>{feasibility}</p>
                </div>
              )}
            </div>

            <div className={styles.accordion}>
              <button
                className={styles.accordionButton}
                onClick={() => toggleAccordion(3)}
              >
                3 - Team Skills - {teamSkillsScore}/100
              </button>
              {activeAccordion === 3 && (
                <div className={styles.accordionContent}>
                  <p>{teamSkills}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

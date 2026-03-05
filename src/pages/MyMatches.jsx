import React, { useEffect, useMemo, useState } from 'react';
import * as Auth from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import { apiGetRegional, apiListTeams, apiGetScoutingAssignments } from '../api';
import {
  loadAssignmentsState,
  saveAssignmentsState,
  buildCompletionCounts,
  getAssignmentsForEmail,
  savePrefillAssignment,
} from '../utils/scoutingAssignments';

function MyMatches() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [regional, setRegional] = useState(apiGetRegional());
  const [assignmentState, setAssignmentState] = useState(() => loadAssignmentsState());
  const [completionCounts, setCompletionCounts] = useState({});

  useEffect(() => {
    const loadEmail = async () => {
      try {
        const session = await Auth.fetchAuthSession();
        const value = String(session?.tokens?.idToken?.payload?.email || '').toLowerCase();
        setEmail(value);
      } catch (_) {
        setEmail('');
      }
    };

    loadEmail();
  }, []);

  useEffect(() => {
    if (regional) return;

    const id = setInterval(() => {
      const reg = apiGetRegional();
      if (reg) {
        setRegional(reg);
        clearInterval(id);
      }
    }, 500);

    return () => clearInterval(id);
  }, [regional]);

  useEffect(() => {
    if (!regional) return;

    const loadAssignments = async () => {
      try {
        const remote = await apiGetScoutingAssignments(regional);
        if (remote && typeof remote === 'object') {
          const merged = {
            ...loadAssignmentsState(),
            ...remote,
          };
          setAssignmentState(merged);
          saveAssignmentsState(merged);
          return;
        }

        setAssignmentState(loadAssignmentsState());
      } catch (err) {
        console.log('Failed to load scouting assignments', err);
        setAssignmentState(loadAssignmentsState());
      }
    };

    loadAssignments();
    const intervalId = setInterval(loadAssignments, 10000);

    return () => clearInterval(intervalId);
  }, [regional]);

  useEffect(() => {
    if (!regional) return;

    const loadCounts = async () => {
      try {
        const teamList = await apiListTeams();
        const items = teamList?.data?.listTeams?.items || [];
        setCompletionCounts(buildCompletionCounts(items, regional));
      } catch (err) {
        console.log('Failed to load completion counts', err);
      }
    };

    loadCounts();
    const intervalId = setInterval(loadCounts, 15000);

    return () => clearInterval(intervalId);
  }, [regional]);

  const myAssignments = useMemo(() => {
    return getAssignmentsForEmail(assignmentState, email);
  }, [assignmentState, email]);

  const handleOpenInForm = (assignment) => {
    savePrefillAssignment(assignment);
    navigate('/form');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <img
          src="./images/BLUETHUNDERLOGO_BLUE.png"
          alt="2443 Blue Thunder Logo"
          style={{ maxWidth: '100px', height: 'auto', marginBottom: '10px' }}
        />
        <h1 style={{ margin: 0, color: '#333', fontSize: '1.8em' }}>MY MATCHES</h1>
      </div>

      <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
        {myAssignments.length === 0 ? (
          <p style={{ margin: 0, color: '#666' }}>
            No assignments found for this account yet. Ask a scouting manager to add this email in Scouters.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {myAssignments.map((assignment) => {
              const completed = Number(completionCounts?.[assignment.matchNumber] || 0) >= 2;

              return (
                <button
                  key={`${assignment.matchKey}-${assignment.teamNumber}-${assignment.allianceColor}`}
                  onClick={() => handleOpenInForm(assignment)}
                  style={{
                    textAlign: 'left',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '12px',
                    cursor: 'pointer',
                    backgroundColor: completed ? '#d9d9d9' : 'white',
                    color: '#222',
                  }}
                  title="Click to open this assignment in Form"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Match {assignment.matchNumber}</strong>
                    <span style={{ fontSize: '13px', color: '#555' }}>
                      {completed ? `Completed (${completionCounts[assignment.matchNumber]} forms)` : `Open (${completionCounts[assignment.matchNumber] || 0}/2 forms)`}
                    </span>
                  </div>
                  <div style={{ marginTop: '4px' }}>
                    Team {assignment.teamNumber} • {assignment.allianceColor.toUpperCase()} alliance
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyMatches;

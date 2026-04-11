import { useEffect, useMemo, useRef, useState } from 'react';
import { Mic, MicOff, Phone, PhoneOff, Sparkles, Timer, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const DEMO_DURATION_SECONDS = 120;

export default function VoiceMockInterview() {
  const { user } = useAuth();
  const [topicInput, setTopicInput] = useState('');
  const [topicWarning, setTopicWarning] = useState('');
  const [validatingTopic, setValidatingTopic] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DEMO_DURATION_SECONDS);
  const [running, setRunning] = useState(false);
  const [listening, setListening] = useState(false);
  const [micPermission, setMicPermission] = useState('prompt');
  const [isMuted, setIsMuted] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState('Pick a topic and start your 2-minute mock interview.');
  const [turns, setTurns] = useState([]);
  const [historyTurns, setHistoryTurns] = useState([]);
  const [unsupportedSpeech, setUnsupportedSpeech] = useState(false);

  const micStreamRef = useRef(null);
  const recognitionRef = useRef(null);
  const currentQuestionRef = useRef('');
  const turnsRef = useRef([]);
  const endingRef = useRef(false);
  const runningRef = useRef(false);
  const processingRef = useRef(false);
  const timeLeftRef = useRef(DEMO_DURATION_SECONDS);
  const isMutedRef = useRef(false);
  const turnNumberRef = useRef(1);

  const formattedTime = useMemo(() => {
    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const s = (timeLeft % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }, [timeLeft]);

  const aiPromptBase = useMemo(() => {
    return [
      'You are a concise technical interviewer for a live voice mock interview demo.',
      `Interview topic: ${topicInput.trim() || 'General job and skills interview'}.`,
      'Ask one short question at a time only.',
      'No long explanations. Keep each question under 20 words.',
      'Use natural spoken style.',
    ].join(' ');
  }, [topicInput]);

  const speak = (text) => {
    return new Promise((resolve) => {
      const synth = window.speechSynthesis;
      if (!synth) {
        resolve();
        return;
      }
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      synth.speak(utterance);
    });
  };

  const askAi = async (message) => {
    const response = await api.post('/mock-interview/chat', { message });
    return response?.data?.reply?.trim() || 'Could you explain that a little more?';
  };

  const loadInterviewHistory = async () => {
    if (!user) {
      setHistoryTurns([]);
      return;
    }

    try {
      const response = await api.get('/mock-interview/history');
      setHistoryTurns(response?.data?.history || []);
    } catch {
      setHistoryTurns([]);
    }
  };

  const saveInterviewTurn = async (payload) => {
    try {
      const response = await api.post('/mock-interview/turns', payload);
      const savedTurn = response?.data?.turn;
      if (savedTurn) {
        setHistoryTurns((prev) => [...prev, savedTurn]);
      }
    } catch {
      // Keep the live interview working even if history persistence fails.
    }
  };

  const parseJsonFromText = (text) => {
    try {
      return JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) return null;
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
  };

  const hasCareerKeywords = (topic) => {
    const keywordPattern = /(job|career|skill|skills|interview|developer|engineer|frontend|backend|react|laravel|php|python|java|javascript|data|devops|docker|cloud|hr|resume|cv|qa|testing|database|sql|leadership|communication)/i;
    return keywordPattern.test(topic);
  };

  const validateTopic = async () => {
    const topic = topicInput.trim();

    if (topic.length < 3) {
      setTopicWarning('Please enter a clear topic related to job role or skills.');
      return false;
    }

    if (!hasCareerKeywords(topic)) {
      setTopicWarning('Warning: Topic must be related to jobs, interview sectors, or professional skills.');
      return false;
    }

    setValidatingTopic(true);
    try {
      const checkPrompt = [
        'Classify this topic for mock interview scope.',
        `Topic: "${topic}"`,
        'If it is related to jobs, careers, interview sectors, or professional skills, return ONLY: VALID',
        'Otherwise return ONLY: INVALID',
      ].join('\n');

      const verdict = await askAi(checkPrompt);
      const normalized = verdict.toUpperCase();
      const isValid = normalized.includes('VALID') && !normalized.includes('INVALID');

      if (!isValid) {
        setTopicWarning('Warning: Please provide a job/skill related sector before starting the mock interview.');
        return false;
      }

      setTopicWarning('');
      return true;
    } catch {
      // If validation request fails, allow interview if keyword rule already passed.
      setTopicWarning('');
      return true;
    } finally {
      setValidatingTopic(false);
    }
  };

  const startListening = () => {
    if (!recognitionRef.current || !runningRef.current || processingRef.current || isMutedRef.current) return;
    try {
      setStatus('Listening to your answer...');
      recognitionRef.current.start();
    } catch {
      // Ignore start conflicts and let next cycle retry.
    }
  };

  const endInterview = async () => {
    if (endingRef.current) return;
    endingRef.current = true;

    setRunning(false);
    runningRef.current = false;
    setListening(false);
    setProcessing(true);
    processingRef.current = true;
    setLiveTranscript('');
    setStatus('Generating final feedback...');

    try {
      recognitionRef.current?.stop();
    } catch {
      // no-op
    }

    const transcript = turnsRef.current
      .map((t) => `${t.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${t.text}`)
      .join('\n');

    try {
      const feedbackPrompt = [
        'Give short feedback for this 2-minute voice mock interview.',
        `Topic: ${topicInput.trim() || 'General job and skills interview'}.`,
        'Return exactly 3 bullet points: strengths, weak area, one improvement tip.',
        'Keep total response under 80 words.',
        transcript || 'No transcript available.',
      ].join('\n');

      const feedback = await askAi(feedbackPrompt);
      const finalText = `Time is over. Interview complete. ${feedback}`;
      setTurns((prev) => [...prev, { role: 'ai', text: finalText }]);
      turnsRef.current = [...turnsRef.current, { role: 'ai', text: finalText }];
      setStatus('Interview finished. You can start again with another topic.');
      await speak(finalText);
    } catch {
      const fallback = 'Time is over. Interview complete. Please try again for detailed feedback.';
      setTurns((prev) => [...prev, { role: 'ai', text: fallback }]);
      turnsRef.current = [...turnsRef.current, { role: 'ai', text: fallback }];
      setStatus('Interview finished.');
      await speak(fallback);
    } finally {
      setProcessing(false);
      processingRef.current = false;
      endingRef.current = false;
    }
  };

  const handleUserAnswer = async (answerText) => {
    if (!runningRef.current || !answerText.trim()) return;

    const askedQuestion = currentQuestionRef.current || 'N/A';

    try {
      recognitionRef.current?.stop();
    } catch {
      // no-op
    }

    const userTurn = { role: 'user', text: answerText.trim() };
    setTurns((prev) => [...prev, userTurn]);
    turnsRef.current = [...turnsRef.current, userTurn];

    if (timeLeftRef.current <= 8) {
      await saveInterviewTurn({
        topic: topicInput.trim() || 'General job and skills interview',
        turn_number: turnNumberRef.current,
        question: askedQuestion,
        answer: answerText.trim(),
        feedback: 'Interview ended before AI feedback was generated.',
      });
      turnNumberRef.current += 1;
      await endInterview();
      return;
    }

    setProcessing(true);
    processingRef.current = true;
    setStatus('AI is preparing next question...');

    try {
      const evaluationPrompt = [
        'You are an interview evaluator.',
        `Topic: ${topicInput.trim() || 'General job and skills interview'}.`,
        `Previous question: ${currentQuestionRef.current || 'N/A'}`,
        `Candidate answer: ${answerText.trim()}`,
        'Evaluate if answer is RIGHT, PARTIAL, or WRONG.',
        'Then ask one next related interview question.',
        'Return only valid JSON with keys: verdict, reason, next_question',
        'Keep reason under 20 words and next_question under 20 words.',
      ].join('\n');

      const evaluationRaw = await askAi(evaluationPrompt);
      const parsed = parseJsonFromText(evaluationRaw);

      const verdict = String(parsed?.verdict || 'PARTIAL').toUpperCase();
      const reason = parsed?.reason || 'Decent attempt. You can improve clarity and detail.';
      const nextQuestion = parsed?.next_question || 'Please explain your answer with one practical example.';

      const verdictLabel = verdict === 'RIGHT'
        ? 'Right'
        : verdict === 'WRONG'
          ? 'Wrong'
          : 'Partial';

      const feedbackTurn = {
        role: 'ai',
        text: `Assessment: ${verdictLabel}. ${reason}`,
      };

      setTurns((prev) => [...prev, feedbackTurn]);
      turnsRef.current = [...turnsRef.current, feedbackTurn];

      await saveInterviewTurn({
        topic: topicInput.trim() || 'General job and skills interview',
        turn_number: turnNumberRef.current,
        question: askedQuestion,
        answer: answerText.trim(),
        feedback: feedbackTurn.text,
      });
      turnNumberRef.current += 1;

      currentQuestionRef.current = nextQuestion;

      await speak(feedbackTurn.text);

      const aiTurn = { role: 'ai', text: nextQuestion };
      setTurns((prev) => [...prev, aiTurn]);
      turnsRef.current = [...turnsRef.current, aiTurn];

      setProcessing(false);
      processingRef.current = false;
      await speak(nextQuestion);
      startListening();
    } catch {
      setProcessing(false);
      processingRef.current = false;
      setStatus('Network issue. Tap End to finish, or wait and try again.');
    }
  };

  const startInterview = async () => {
    if (!user || running || processing || micPermission !== 'granted') return;

    const topicIsValid = await validateTopic();
    if (!topicIsValid) {
      setStatus('Provide a valid job or skill topic to start.');
      return;
    }

    setTurns([]);
    turnsRef.current = [];
    turnNumberRef.current = 1;
    setTimeLeft(DEMO_DURATION_SECONDS);
    timeLeftRef.current = DEMO_DURATION_SECONDS;
    setRunning(true);
    runningRef.current = true;
    setProcessing(true);
    processingRef.current = true;
    setLiveTranscript('');
    setStatus('Starting interview...');

    try {
      const firstPrompt = [
        aiPromptBase,
        'Start now and ask the first interview question only.',
      ].join('\n');

      const firstQuestion = await askAi(firstPrompt);
      currentQuestionRef.current = firstQuestion;

      const aiTurn = { role: 'ai', text: firstQuestion };
      setTurns([aiTurn]);
      turnsRef.current = [aiTurn];

      setProcessing(false);
      processingRef.current = false;
      await speak(firstQuestion);
      startListening();
    } catch {
      setRunning(false);
      runningRef.current = false;
      setProcessing(false);
      processingRef.current = false;
      setStatus('Could not start interview. Please try again.');
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMutedRef.current;
    isMutedRef.current = nextMuted;
    setIsMuted(nextMuted);

    if (micStreamRef.current) {
      micStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !nextMuted;
      });
    }

    if (nextMuted) {
      try {
        recognitionRef.current?.stop();
      } catch {
        // no-op
      }
      setListening(false);
      setStatus('Microphone muted. Unmute to continue answering.');
    } else if (runningRef.current && !processingRef.current) {
      setStatus('Microphone unmuted. Listening...');
      startListening();
    }
  };

  useEffect(() => {
    const requestMicPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;
        setMicPermission('granted');
      } catch {
        setMicPermission('denied');
        setStatus('Microphone permission denied. Allow microphone to run voice interview.');
      }
    };

    if (!navigator.mediaDevices?.getUserMedia) {
      setMicPermission('denied');
      setStatus('Microphone API is not available in this browser.');
      return;
    }

    requestMicPermission();

    return () => {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!running) return undefined;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        timeLeftRef.current = prev;
        if (prev <= 1) {
          clearInterval(timer);
          endInterview();
          timeLeftRef.current = 0;
          return 0;
        }
        timeLeftRef.current = prev - 1;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    loadInterviewHistory();
  }, [user]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setUnsupportedSpeech(true);
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.interimResults = true;
    rec.continuous = true;

    rec.onstart = () => setListening(true);
    rec.onend = () => {
      setListening(false);
      if (runningRef.current && !processingRef.current && !isMutedRef.current) {
        setTimeout(() => startListening(), 350);
      }
    };
    rec.onerror = () => setListening(false);

    rec.onresult = (event) => {
      let finalText = '';
      let interimText = '';

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const transcript = result[0]?.transcript || '';
        if (result.isFinal) {
          finalText += `${transcript} `;
        } else {
          interimText += transcript;
        }
      }

      const cleanedFinal = finalText.trim();
      const cleanedInterim = interimText.trim();

      if (cleanedInterim) {
        setLiveTranscript(cleanedInterim);
      }

      if (cleanedFinal) {
        setLiveTranscript(cleanedFinal);
        handleUserAnswer(cleanedFinal);
      }
    };

    recognitionRef.current = rec;

    return () => {
      try {
        rec.stop();
      } catch {
        // no-op
      }
    };
  }, [aiPromptBase, topicInput]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  useEffect(() => {
    processingRef.current = processing;
  }, [processing]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  return (
    <div className="min-h-screen bg-[#03070A] pt-28 pb-12 px-4">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-[#14b8a6]/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-[#06b6d4]/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#14b8a6]/[0.08] border border-[#14b8a6]/20 mb-4">
            <Sparkles size={14} className="text-[#14b8a6]" />
            <span className="text-xs font-semibold text-[#2dd4bf] uppercase tracking-wider">
              Voice Demo
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">2-Minute AI Voice Mock Interview</h1>
          <p className="text-gray-500 text-sm mt-2 max-w-2xl mx-auto">
            Type your own interview sector, start call, and answer by voice. AI asks follow-up interview questions in real time.
          </p>
        </div>

        {!user && (
          <div className="mb-5 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/[0.08] text-amber-200 text-sm">
            Please login first to use the voice mock interview.
          </div>
        )}

        {unsupportedSpeech && (
          <div className="mb-5 p-4 rounded-2xl border border-red-500/30 bg-red-500/[0.08] text-red-200 text-sm">
            Your browser does not support Web Speech Recognition. Use Google Chrome or Microsoft Edge for this demo.
          </div>
        )}

        {micPermission === 'denied' && (
          <div className="mb-5 p-4 rounded-2xl border border-red-500/30 bg-red-500/[0.08] text-red-200 text-sm">
            Microphone access is required. Allow mic permission in browser settings and reload this page.
          </div>
        )}

        {micPermission === 'granted' && (
          <div className="mb-5 p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.08] text-emerald-200 text-sm">
            Microphone access granted. You can start voice interview now.
          </div>
        )}

        <div className="grid md:grid-cols-[1fr_1.3fr] gap-4">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
            <h2 className="text-sm font-semibold text-white mb-3">Setup</h2>

            <label className="text-xs text-gray-500 mb-1 block">Interview Topic (write your own)</label>
            <input
              type="text"
              value={topicInput}
              onChange={(e) => {
                setTopicInput(e.target.value);
                if (topicWarning) setTopicWarning('');
              }}
              disabled={running || processing || validatingTopic || !user || unsupportedSpeech}
              placeholder="Example: React frontend interview for junior developer"
              className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[#14b8a6]/40"
              maxLength={120}
            />
            <p className="mt-1 text-[11px] text-gray-600">Only job/interview/skill sectors are allowed.</p>
            {topicWarning && (
              <p className="mt-2 text-xs text-amber-300 bg-amber-500/[0.1] border border-amber-500/30 rounded-lg px-2.5 py-2">
                {topicWarning}
              </p>
            )}

            <div className="mt-4 p-3 rounded-xl bg-[#14b8a6]/[0.08] border border-[#14b8a6]/20 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#2dd4bf]">
                <Timer size={14} />
                <span className="text-xs font-semibold uppercase tracking-wide">Remaining</span>
              </div>
              <span className="text-lg font-bold text-white tabular-nums">{formattedTime}</span>
            </div>

            <p className="mt-3 text-xs text-gray-500">Status: {status}</p>

            <div className="mt-4 flex gap-2">
              <button
                onClick={startInterview}
                disabled={!user || unsupportedSpeech || micPermission !== 'granted' || running || processing || validatingTopic}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #14b8a6, #06b6d4)' }}
              >
                <span className="inline-flex items-center gap-2">
                  <Phone size={14} />
                  {validatingTopic ? 'Validating...' : 'Start'}
                </span>
              </button>

              <button
                onClick={toggleMute}
                disabled={!running || processing}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-amber-200 bg-amber-500/[0.12] border border-amber-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="inline-flex items-center gap-2">
                  {isMuted ? <MicOff size={14} /> : <Mic size={14} />}
                  {isMuted ? 'Unmute' : 'Mute'}
                </span>
              </button>

              <button
                onClick={endInterview}
                disabled={!running || processing}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-red-300 bg-red-500/[0.1] border border-red-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="inline-flex items-center gap-2">
                  <PhoneOff size={14} />
                  End
                </span>
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
              {listening ? <Mic size={14} className="text-[#14b8a6]" /> : <MicOff size={14} className="text-gray-500" />}
              {processing ? (
                <span className="inline-flex items-center gap-1 text-[#2dd4bf]"><Loader2 size={12} className="animate-spin" /> AI thinking...</span>
              ) : validatingTopic ? (
                <span className="inline-flex items-center gap-1 text-[#2dd4bf]"><Loader2 size={12} className="animate-spin" /> Validating topic...</span>
              ) : listening ? (
                <span>Listening for your answer...</span>
              ) : (
                <span>Microphone idle</span>
              )}
            </div>

            <div className="mt-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
              <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">Voice Activity</p>
              <div className="flex items-end gap-1.5 h-10">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={`w-2 rounded-full ${listening && !isMuted ? 'bg-[#14b8a6]' : 'bg-gray-700'}`}
                    style={{
                      height: listening && !isMuted ? `${18 + ((i % 3) * 8)}px` : '8px',
                      animation: listening && !isMuted ? `voice-bar 0.8s ${i * 0.12}s ease-in-out infinite alternate` : 'none',
                    }}
                  />
                ))}
              </div>
              <p className="text-[11px] text-gray-400 mt-2">
                {isMuted ? 'Microphone muted.' : listening ? 'AI is receiving your voice.' : 'Waiting for your speech...'}
              </p>
            </div>

            <div className="mt-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
              <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">Live Transcript</p>
              <p className="text-sm text-gray-200 min-h-[22px]">
                {liveTranscript || 'Your spoken words will appear here...'}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 min-h-[420px]">
            <h2 className="text-sm font-semibold text-white mb-3">Interview Transcript (Voice)</h2>

            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {turns.length === 0 && (
                <div className="text-sm text-gray-500 border border-white/[0.06] rounded-xl p-4 bg-white/[0.02]">
                  No conversation yet. Start the interview to begin.
                </div>
              )}

              {turns.map((turn, idx) => (
                <div
                  key={`${turn.role}-${idx}`}
                  className={`p-3 rounded-xl border text-sm ${
                    turn.role === 'ai'
                      ? 'bg-[#14b8a6]/[0.08] border-[#14b8a6]/20 text-[#d1fffa]'
                      : 'bg-white/[0.03] border-white/[0.08] text-gray-200'
                  }`}
                >
                  <p className="text-[11px] uppercase tracking-wider opacity-70 mb-1 font-semibold">
                    {turn.role === 'ai' ? 'AI Interviewer' : 'You'}
                  </p>
                  <p className="leading-relaxed">{turn.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="text-sm font-semibold text-white">Saved Mock Interview History</h2>
            <span className="text-[11px] text-gray-500">Stored separately from chatbot conversations</span>
          </div>

          {historyTurns.length === 0 ? (
            <div className="text-sm text-gray-500 border border-white/[0.06] rounded-xl p-4 bg-white/[0.02]">
              No saved mock interview history yet.
            </div>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {historyTurns.map((turn) => (
                <div
                  key={turn.id}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-sm"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2 text-[11px] uppercase tracking-wider text-gray-500">
                    <span>Topic: {turn.topic || 'General interview'}</span>
                    <span>Turn #{turn.turn_number}</span>
                    <span>{turn.created_at ? new Date(turn.created_at).toLocaleString() : ''}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="rounded-lg bg-[#14b8a6]/[0.08] border border-[#14b8a6]/20 p-3 text-[#d1fffa]">
                      <p className="text-[11px] uppercase tracking-wider opacity-70 mb-1 font-semibold">AI Question</p>
                      <p className="leading-relaxed">{turn.question}</p>
                    </div>

                    <div className="rounded-lg bg-white/[0.03] border border-white/[0.08] p-3 text-gray-200">
                      <p className="text-[11px] uppercase tracking-wider opacity-70 mb-1 font-semibold">User Response</p>
                      <p className="leading-relaxed">{turn.answer}</p>
                    </div>

                    {turn.feedback && (
                      <div className="rounded-lg bg-amber-500/[0.08] border border-amber-500/20 p-3 text-amber-100">
                        <p className="text-[11px] uppercase tracking-wider opacity-70 mb-1 font-semibold">AI Feedback</p>
                        <p className="leading-relaxed">{turn.feedback}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes voice-bar {
          from { transform: scaleY(0.55); opacity: 0.6; }
          to { transform: scaleY(1.15); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

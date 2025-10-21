"use client";
import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Home,
  Wind,
  Heart,
  Moon,
  Sun,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const breathingPatterns = {
  "4-7-8": {
    name: "4-7-8 Relaxation",
    description: "Inhale for 4, hold for 7, exhale for 8",
    inhale: 4,
    hold: 7,
    exhale: 8,
    cycles: 4,
  },
  "4-4-4": {
    name: "Box Breathing",
    description: "Inhale 4, hold 4, exhale 4, hold 4",
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdAfterExhale: 4,
    cycles: 6,
  },
  "4-6": {
    name: "Calm Breathing",
    description: "Inhale for 4, exhale for 6",
    inhale: 4,
    hold: 0,
    exhale: 6,
    cycles: 8,
  },
  "6-2-6": {
    name: "Deep Relaxation",
    description: "Inhale for 6, hold for 2, exhale for 6",
    inhale: 6,
    hold: 2,
    exhale: 6,
    cycles: 5,
  },
};

// Audio Context and Sound Generation
class SoundGenerator {
  constructor() {
    this.audioContext = null;
    this.oscillators = [];
    this.gainNodes = [];
    this.filters = [];
    this.currentTheme = "sunset";
    this.isPlaying = false;
    this.masterVolume = 0.5;
  }

  async initialize() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
    }

    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }
  }

  createOceanWaves() {
    const frequencies = [60, 80, 120, 200];
    const nodes = [];

    frequencies.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(
        freq + Math.random() * 20,
        this.audioContext.currentTime
      );

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, this.audioContext.currentTime);
      filter.Q.setValueAtTime(0.5, this.audioContext.currentTime);

      gainNode.gain.setValueAtTime(
        0.1 * this.masterVolume,
        this.audioContext.currentTime
      );

      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Add modulation
      const lfo = this.audioContext.createOscillator();
      const lfoGain = this.audioContext.createGain();
      lfo.frequency.setValueAtTime(
        0.1 + Math.random() * 0.2,
        this.audioContext.currentTime
      );
      lfoGain.gain.setValueAtTime(10, this.audioContext.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);

      oscillator.start();
      lfo.start();

      nodes.push({ oscillator, gainNode, filter, lfo });
    });

    return nodes;
  }

  createForestSounds() {
    const frequencies = [200, 400, 800, 1200, 2000];
    const nodes = [];

    frequencies.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();

      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(
        freq + Math.random() * 100,
        this.audioContext.currentTime
      );

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(freq, this.audioContext.currentTime);
      filter.Q.setValueAtTime(2, this.audioContext.currentTime);

      gainNode.gain.setValueAtTime(
        0.05 * this.masterVolume,
        this.audioContext.currentTime
      );

      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Random modulation for bird-like sounds
      const lfo = this.audioContext.createOscillator();
      const lfoGain = this.audioContext.createGain();
      lfo.frequency.setValueAtTime(
        0.5 + Math.random() * 2,
        this.audioContext.currentTime
      );
      lfoGain.gain.setValueAtTime(freq * 0.1, this.audioContext.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);

      oscillator.start();
      lfo.start();

      nodes.push({ oscillator, gainNode, filter, lfo });
    });

    return nodes;
  }

  createSunsetWind() {
    const frequencies = [40, 80, 160, 320];
    const nodes = [];

    frequencies.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();

      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(
        300 + Math.random() * 200,
        this.audioContext.currentTime
      );
      filter.Q.setValueAtTime(0.3, this.audioContext.currentTime);

      gainNode.gain.setValueAtTime(
        0.08 * this.masterVolume,
        this.audioContext.currentTime
      );

      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Wind-like modulation
      const lfo = this.audioContext.createOscillator();
      const lfoGain = this.audioContext.createGain();
      lfo.frequency.setValueAtTime(
        0.2 + Math.random() * 0.3,
        this.audioContext.currentTime
      );
      lfoGain.gain.setValueAtTime(0.03, this.audioContext.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(gainNode.gain);

      oscillator.start();
      lfo.start();

      nodes.push({ oscillator, gainNode, filter, lfo });
    });

    return nodes;
  }

  createNightAmbience() {
    const frequencies = [100, 150, 220, 330, 500];
    const nodes = [];

    frequencies.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(
        freq + Math.random() * 20,
        this.audioContext.currentTime
      );

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(400, this.audioContext.currentTime);
      filter.Q.setValueAtTime(1, this.audioContext.currentTime);

      gainNode.gain.setValueAtTime(
        0.06 * this.masterVolume,
        this.audioContext.currentTime
      );

      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Gentle pulsing
      const lfo = this.audioContext.createOscillator();
      const lfoGain = this.audioContext.createGain();
      lfo.frequency.setValueAtTime(
        0.1 + Math.random() * 0.1,
        this.audioContext.currentTime
      );
      lfoGain.gain.setValueAtTime(0.02, this.audioContext.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(gainNode.gain);

      oscillator.start();
      lfo.start();

      nodes.push({ oscillator, gainNode, filter, lfo });
    });

    return nodes;
  }

  async startTheme(theme) {
    await this.initialize();
    this.stopAll();
    this.currentTheme = theme;

    let nodes = [];
    switch (theme) {
      case "ocean":
        nodes = this.createOceanWaves();
        break;
      case "forest":
        nodes = this.createForestSounds();
        break;
      case "sunset":
        nodes = this.createSunsetWind();
        break;
      case "night":
        nodes = this.createNightAmbience();
        break;
    }

    this.oscillators = nodes.map((n) => n.oscillator);
    this.gainNodes = nodes.map((n) => n.gainNode);
    this.filters = nodes.map((n) => n.filter);
    this.isPlaying = true;
  }

  setVolume(volume) {
    this.masterVolume = volume;
    this.gainNodes.forEach((gainNode) => {
      if (gainNode && gainNode.gain) {
        gainNode.gain.setTargetAtTime(
          gainNode.gain.value * (volume / this.masterVolume),
          this.audioContext.currentTime,
          0.1
        );
      }
    });
  }

  modulateForBreathingPhase(phase) {
    if (!this.audioContext || !this.isPlaying) return;

    const now = this.audioContext.currentTime;
    const targetVolume =
      this.masterVolume *
      (phase === "exhale" ? 0.7 : phase === "hold" ? 0.5 : 1.0);

    this.gainNodes.forEach((gainNode) => {
      if (gainNode && gainNode.gain) {
        gainNode.gain.setTargetAtTime(targetVolume * 0.1, now, 0.3);
      }
    });
  }

  stopAll() {
    this.oscillators.forEach((osc) => {
      try {
        osc.stop();
      } catch (e) {}
    });
    this.oscillators = [];
    this.gainNodes = [];
    this.filters = [];
    this.isPlaying = false;
  }
}

export default function BreathingMeditation() {
  const [isActive, setIsActive] = useState(false);
  const [currentPattern, setCurrentPattern] = useState("4-7-8");
  const [currentPhase, setCurrentPhase] = useState("ready");
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [volume, setVolume] = useState([0.5]);
  const [isMuted, setIsMuted] = useState(true);
  const [backgroundTheme, setBackgroundTheme] = useState("sunset");

  const intervalRef = useRef(null);
  const soundGeneratorRef = useRef(null);
  const pattern = breathingPatterns[currentPattern];

  const backgroundThemes = {
    ocean: "bg-gradient-to-br from-mint via-softgreen to-tealgreen",
    forest: "bg-gradient-to-br from-softgreen via-tealgreen to-seagreen",
    sunset: "bg-gradient-to-br from-tealgreen via-seagreen to-deepaqua",
    night: "bg-gradient-to-br from-deepaqua via-slateteal to-midnight",
  };

  const phaseInstructions = {
    ready: "Tap start when you're ready to begin",
    inhale: "Breathe in slowly and deeply",
    hold: "Hold your breath gently",
    exhale: "Breathe out slowly and completely",
    holdAfterExhale: "Rest and hold empty",
    complete: "Session complete! Well done.",
  };

  // Initialize sound generator
  useEffect(() => {
    soundGeneratorRef.current = new SoundGenerator();
    return () => {
      if (soundGeneratorRef.current) {
        soundGeneratorRef.current.stopAll();
      }
    };
  }, []);

  // Handle background theme changes
  useEffect(() => {
    if (soundGeneratorRef.current && !isMuted) {
      soundGeneratorRef.current.startTheme(backgroundTheme);
    }
  }, [backgroundTheme, isMuted]);

  // Handle volume changes
  useEffect(() => {
    if (soundGeneratorRef.current && !isMuted) {
      soundGeneratorRef.current.setVolume(volume[0]);
    }
  }, [volume, isMuted]);

  // Handle mute/unmute
  useEffect(() => {
    if (soundGeneratorRef.current) {
      if (isMuted) {
        soundGeneratorRef.current.stopAll();
      } else {
        soundGeneratorRef.current.startTheme(backgroundTheme);
      }
    }
  }, [isMuted, backgroundTheme]);

  // Handle breathing phase changes for sound modulation
  useEffect(() => {
    if (soundGeneratorRef.current && !isMuted) {
      soundGeneratorRef.current.modulateForBreathingPhase(currentPhase);
    }
  }, [currentPhase, isMuted]);

  const getCircleScale = () => {
    if (currentPhase === "inhale") return "scale-150";
    if (currentPhase === "exhale") return "scale-125";
    return "scale-100";
  };

  const getCircleOpacity = () => {
    if (currentPhase === "hold" || currentPhase === "holdAfterExhale")
      return "opacity-80";
    return "opacity-100";
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 0.1);
      }, 100);
    } else if (isActive && timeLeft <= 0) {
      // Move to next phase
      if (currentPhase === "inhale") {
        if (pattern.hold > 0) {
          setCurrentPhase("hold");
          setTimeLeft(pattern.hold);
        } else {
          setCurrentPhase("exhale");
          setTimeLeft(pattern.exhale);
        }
      } else if (currentPhase === "hold") {
        setCurrentPhase("exhale");
        setTimeLeft(pattern.exhale);
      } else if (currentPhase === "exhale") {
        if (pattern.holdAfterExhale > 0) {
          setCurrentPhase("holdAfterExhale");
          setTimeLeft(pattern.holdAfterExhale);
        } else {
          // Complete cycle
          const newCycle = currentCycle + 1;
          if (newCycle >= pattern.cycles) {
            setCurrentPhase("complete");
            setIsActive(false);
            setCurrentCycle(0);
          } else {
            setCurrentCycle(newCycle);
            setCurrentPhase("inhale");
            setTimeLeft(pattern.inhale);
          }
        }
      } else if (currentPhase === "holdAfterExhale") {
        // Complete cycle
        const newCycle = currentCycle + 1;
        if (newCycle >= pattern.cycles) {
          setCurrentPhase("complete");
          setIsActive(false);
          setCurrentCycle(0);
        } else {
          setCurrentCycle(newCycle);
          setCurrentPhase("inhale");
          setTimeLeft(pattern.inhale);
        }
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, currentPhase, currentCycle, pattern]);

  const startSession = async () => {
    // Start background sounds when session begins
    if (!isMuted && soundGeneratorRef.current) {
      await soundGeneratorRef.current.startTheme(backgroundTheme);
    }

    setIsActive(true);
    setCurrentPhase("inhale");
    setTimeLeft(pattern.inhale);
    setCurrentCycle(0);
  };

  const pauseSession = () => {
    setIsActive(false);
  };

  const resetSession = () => {
    setIsActive(false);
    setCurrentPhase("ready");
    setTimeLeft(0);
    setCurrentCycle(0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (time) => {
    return Math.ceil(time);
  };

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slateteal">
            Breathing & Meditation
          </h1>
          <p className="text-tealgreen">
            Find your calm with guided breathing exercises
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-slateteal hover:bg-softgreen/30 rounded-full"
          onClick={toggleMute}
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 flex-1 overflow-hidden">
        {/* Main Breathing Circle */}
        <div className="lg:col-span-2">
          <Card className="bg-white/20 backdrop-blur-md border-tealgreen/30 shadow-2xl h-full">
            <CardContent className="p-4 sm:p-6 md:p-8 lg:p-12 h-full flex items-center justify-center overflow-auto">
              <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10 w-full">
                {/* Control Buttons */}

                {/* Breathing Circle */}
                <div className="relative flex items-center justify-center w-[12rem] h-[12rem] sm:w-[6rem] sm:h-[6rem] md:w-[8rem] md:h-[8rem] lg:w-[10rem] lg:h-[10rem]">
                  {/* Outer Ring */}
                  <div className="absolute inset-0 rounded-full border-2 sm:border-3 md:border-4 border-tealgreen/30"></div>

                  {/* Animated Circle */}
                  <div
                    className={`absolute inset-3 sm:inset-4 md:inset-5 lg:inset-6 rounded-full bg-gradient-to-br from-mint/40 to-softgreen/20 backdrop-blur-sm transition-all duration-1000 ease-in-out ${getCircleScale()} ${getCircleOpacity()}`}
                  >
                    <div className="absolute inset-2 sm:inset-3 md:inset-4 lg:inset-5 rounded-full bg-gradient-to-br from-tealgreen/30 to-seagreen/10 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl md:text-3xl font-light text-slateteal mb-1 sm:mb-2">
                          {currentPhase !== "ready" &&
                          currentPhase !== "complete" ? (
                            formatTime(timeLeft)
                          ) : (
                            <Wind className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 mx-auto" />
                          )}
                        </div>
                        {currentPhase !== "ready" &&
                          currentPhase !== "complete" && (
                            <div className="text-xs sm:text-sm text-tealgreen font-medium">
                              Cycle {currentCycle + 1} of {pattern.cycles}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>

                  {/* Progress Ring */}
                  {currentPhase !== "ready" && currentPhase !== "complete" && (
                    <div className="absolute inset-0">
                      <svg
                        className="w-full h-full transform -rotate-90"
                        viewBox="0 0 100 100"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="46"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeOpacity="0.3"
                          className="text-tealgreen"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="46"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray={`${2 * Math.PI * 46}`}
                          strokeDashoffset={`${
                            2 *
                            Math.PI *
                            46 *
                            (1 -
                              timeLeft /
                                (currentPhase === "inhale"
                                  ? pattern.inhale
                                  : currentPhase === "hold"
                                  ? pattern.hold
                                  : currentPhase === "exhale"
                                  ? pattern.exhale
                                  : pattern.holdAfterExhale || 0))
                          }`}
                          className="text-seagreen transition-all duration-100 ease-linear"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Phase Instruction */}
                <div className="text-center">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-deepaqua mb-2 sm:mb-3">
                    {currentPhase === "inhale" && "Inhale"}
                    {currentPhase === "hold" && "Hold"}
                    {currentPhase === "exhale" && "Exhale"}
                    {currentPhase === "holdAfterExhale" && "Hold"}
                    {currentPhase === "ready" && "Ready"}
                    {currentPhase === "complete" && "Complete"}
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-seagreen">
                    {phaseInstructions[currentPhase]}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
                  {!isActive && currentPhase === "ready" && (
                    <Button
                      onClick={startSession}
                      size="lg"
                      className="w-full sm:w-auto bg-tealgreen hover:bg-seagreen text-white border-tealgreen/30 backdrop-blur-sm px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                      Start Session
                    </Button>
                  )}

                  {isActive && (
                    <Button
                      onClick={pauseSession}
                      size="lg"
                      className="w-full sm:w-auto bg-tealgreen hover:bg-seagreen text-white border-tealgreen/30 backdrop-blur-sm px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Pause className="mr-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                      Pause
                    </Button>
                  )}

                  {!isActive && currentPhase !== "ready" && (
                    <Button
                      onClick={startSession}
                      size="lg"
                      className="w-full sm:w-auto bg-tealgreen hover:bg-seagreen text-white border-tealgreen/30 backdrop-blur-sm px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                      Resume
                    </Button>
                  )}

                  {currentPhase !== "ready" && (
                    <Button
                      onClick={resetSession}
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-slateteal border-tealgreen/30 backdrop-blur-sm px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <RotateCcw className="mr-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                      Reset
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Panel */}
        <div className="space-y-6 overflow-y-auto pr-2 max-h-[calc(100vh-8rem)] pb-6">
          {/* Breathing Pattern */}
          <Card className="bg-white/20 backdrop-blur-md border-tealgreen/30 shadow-xl">
            <CardHeader>
              <CardTitle className="text-slateteal flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-slateteal text-sm font-medium mb-2 block">
                  Breathing Pattern
                </label>
                <Select
                  value={currentPattern}
                  onValueChange={setCurrentPattern}
                  disabled={isActive}
                >
                  <SelectTrigger className="bg-mint border-tealgreen/30 text-slateteal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(breathingPatterns).map(([key, pattern]) => (
                      <SelectItem key={key} value={key}>
                        <div>
                          <div className="font-medium text-slateteal">
                            {pattern.name}
                          </div>
                          <div className="text-xs text-deepaqua">
                            {pattern.description}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-slateteal text-sm font-medium mb-2 block">
                  Background Theme & Sound
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(backgroundThemes).map(([key, theme]) => (
                    <Button
                      key={key}
                      onClick={() => setBackgroundTheme(key)}
                      variant={backgroundTheme === key ? "default" : "outline"}
                      size="sm"
                      className={`capitalize ${
                        backgroundTheme === key
                          ? "bg-tealgreen hover:bg-seagreen text-white"
                          : "bg-mint text-slateteal border-tealgreen/30 hover:bg-softgreen/30"
                      }`}
                    >
                      {key === "sunset" && <Sun className="h-4 w-4 mr-1" />}
                      {key === "night" && <Moon className="h-4 w-4 mr-1" />}
                      {key === "ocean" && <Wind className="h-4 w-4 mr-1" />}
                      {key === "forest" && <Heart className="h-4 w-4 mr-1" />}
                      {key}
                    </Button>
                  ))}
                </div>
                <p className="text-seagreen text-xs mt-1">
                  Each theme has unique ambient sounds
                </p>
              </div>

              {!isMuted && (
                <div>
                  <label className="text-slateteal text-sm font-medium mb-2 block">
                    Volume: {Math.round(volume[0] * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume[0]}
                    onChange={(e) => setVolume([parseFloat(e.target.value)])}
                    className="w-full h-2 bg-tealgreen/50 rounded-lg appearance-none cursor-pointer slider [&::-webkit-slider-thumb]:bg-deepaqua [&::-moz-range-thumb]:bg-deepaqua"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Pattern Info */}
          <Card className="bg-white/20 backdrop-blur-md border-tealgreen/30 shadow-xl">
            <CardHeader>
              <CardTitle className="text-slateteal text-lg">
                {pattern.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-tealgreen text-sm mb-4">
                {pattern.description}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slateteal">
                  <span>Inhale:</span>
                  <span>{pattern.inhale}s</span>
                </div>
                {pattern.hold > 0 && (
                  <div className="flex justify-between text-slateteal">
                    <span>Hold:</span>
                    <span>{pattern.hold}s</span>
                  </div>
                )}
                <div className="flex justify-between text-slateteal">
                  <span>Exhale:</span>
                  <span>{pattern.exhale}s</span>
                </div>
                {pattern.holdAfterExhale > 0 && (
                  <div className="flex justify-between text-slateteal">
                    <span>Hold (Empty):</span>
                    <span>{pattern.holdAfterExhale}s</span>
                  </div>
                )}
                <div className="flex justify-between text-slateteal pt-2 border-t border-tealgreen/20">
                  <span>Total Cycles:</span>
                  <span>{pattern.cycles}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sound Info */}
          <Card className="bg-white/20 backdrop-blur-md border-tealgreen/30 shadow-xl">
            <CardHeader>
              <CardTitle className="text-slateteal text-lg flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Background Sounds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-softgreen">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-tealgreen" />
                  <div>
                    <div className="font-medium text-slateteal">Sunset</div>
                    <div className="text-xs text-tealgreen">
                      Gentle wind sounds
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-tealgreen" />
                  <div>
                    <div className="font-medium text-slateteal">Ocean</div>
                    <div className="text-xs text-tealgreen">
                      Calming wave sounds
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-tealgreen" />
                  <div>
                    <div className="font-medium text-slateteal">Forest</div>
                    <div className="text-xs text-tealgreen">
                      Nature and bird sounds
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-tealgreen" />
                  <div>
                    <div className="font-medium text-slateteal">Night</div>
                    <div className="text-xs text-tealgreen">
                      Peaceful ambient tones
                    </div>
                  </div>
                </div>
              </div>
              {isMuted && (
                <div className="mt-4 p-3 bg-mint/10 rounded-lg">
                  <p className="text-seagreen text-xs">
                    Sounds are currently muted. Click the volume icon to enable
                    ambient audio.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

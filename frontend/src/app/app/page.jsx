"use client";
import { useState, useEffect } from "react";
import axios from "axios";

// Updated import for the API services
import { fetchTeams as fetchTeamsApi, generateFormation as generateFormationApi } from '@/services/api';

export default function Home() {
  const [team, setTeam] = useState("");
  const [opponent, setOpponent] = useState("");
  const [tactics, setTactics] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [savedFormations, setSavedFormations] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("create"); // 'create', 'community', 'matches', 'profile'
  const [communityFormations, setCommunityFormations] = useState([]);
  const [draggedPlayer, setDraggedPlayer] = useState(null);
  const [customPositions, setCustomPositions] = useState({});
  const [showSimulation, setShowSimulation] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [teamsList, setTeamsList] = useState([]); // New state for storing teams from API

  // Initialize dark mode from system preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      
      // Load saved formations
      const saved = localStorage.getItem('savedFormations');
      if (saved) {
        setSavedFormations(JSON.parse(saved));
      }
      
      // Load match history
      const matchHistory = localStorage.getItem('matchHistory');
      if (matchHistory) {
        setHistory(JSON.parse(matchHistory));
      }
      
      // Mock community data - in a real app, this would come from an API
      generateMockCommunityData();
      generateMockLeaderboardData();
      
      // Fetch teams from the API
      fetchTeams();
    }
  }, []);
  
  // Fetch teams from the API
  const fetchTeams = async () => {
    try {
      const teams = await fetchTeamsApi();
      setTeamsList(teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };
  
  // Generate mock community data for demonstration
  const generateMockCommunityData = () => {
    const mockFormations = [
      {
        id: 1,
        creator: "TacticalGenius",
        team: "Liverpool",
        formation: "4-3-3",
        title: "High Pressing Counter Attack",
        likes: 342,
        views: 1205,
        date: "2 days ago"
      },
      {
        id: 2,
        creator: "FootballMind",
        team: "Bayern Munich",
        formation: "4-2-3-1",
        title: "Possession Based Dominance",
        likes: 287,
        views: 932,
        date: "4 days ago"
      },
      {
        id: 3,
        creator: "SoccerStrategist",
        team: "Manchester City",
        formation: "3-5-2",
        title: "Fluid Positional Play",
        likes: 254,
        views: 876,
        date: "1 week ago"
      },
      {
        id: 4,
        creator: "TikiTaka",
        team: "Barcelona",
        formation: "4-3-3",
        title: "Modern Tiki-Taka",
        likes: 198,
        views: 752,
        date: "2 weeks ago"
      }
    ];
    
    setCommunityFormations(mockFormations);
  };
  
  // Generate mock leaderboard data
  const generateMockLeaderboardData = () => {
    const mockLeaderboard = [
      { rank: 1, user: "TacticalMaster", points: 2450, wins: 48, draws: 15, losses: 7 },
      { rank: 2, user: "FootballGenius", points: 2340, wins: 45, draws: 12, losses: 13 },
      { rank: 3, user: "StrategyKing", points: 2290, wins: 42, draws: 18, losses: 10 },
      { rank: 4, user: "FormationGuru", points: 2180, wins: 40, draws: 13, losses: 17 },
      { rank: 5, user: "TacticsPro", points: 2120, wins: 38, draws: 16, losses: 16 },
      { rank: 6, user: "SoccerScientist", points: 2050, wins: 36, draws: 14, losses: 20 },
      { rank: 7, user: "CoachElite", points: 1980, wins: 35, draws: 10, losses: 25 },
      { rank: 8, user: "FootballDr", points: 1920, wins: 33, draws: 12, losses: 25 },
      { rank: 9, user: "FormationWizard", points: 1870, wins: 31, draws: 16, losses: 23 },
      { rank: 10, user: "TacticalInnovator", points: 1820, wins: 30, draws: 15, losses: 25 }
    ];
    
    setLeaderboardData(mockLeaderboard);
  };

  const fetchTactics = async () => {
    setLoading(true);
    setTactics("");
    setCustomPositions({});
    
    // Simulate progress
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);
    
    try {
      // Call the actual API instead of using mock data
      const result = await generateFormationApi(team, opponent);
      
      // Check if the API returned a result, otherwise use mock data as fallback
      const finalResult = result || generateMockTacticalAnalysis(team, opponent);
      
      setTimeout(() => {
        setTactics(finalResult);
        
        // Add to history
        const historyItem = { 
          id: Date.now(), 
          team, 
          opponent, 
          result: finalResult, 
          date: new Date().toLocaleString(),
          formation: extractFormation(finalResult)
        };
        
        setHistory(prev => {
          const newHistory = [historyItem, ...prev.slice(0, 4)];
          localStorage.setItem('matchHistory', JSON.stringify(newHistory));
          return newHistory;
        });
        
        setLoadingProgress(100);
        
        setTimeout(() => {
          setLoading(false);
          setLoadingProgress(0);
        }, 500);
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setTactics("⚠️ Error generating tactics. Please try again.");
      setLoadingProgress(100);
      
      setTimeout(() => {
        setLoading(false);
        setLoadingProgress(0);
      }, 500);
    }
    
    clearInterval(interval);
  };
  
  // Generate mock tactical analysis
  const generateMockTacticalAnalysis = (team, opponent) => {
    const formations = ["4-3-3", "4-2-3-1", "3-4-3", "3-5-2", "4-4-2", "5-3-2"];
    const formation = formations[Math.floor(Math.random() * formations.length)];
    
    return `**Tactical Analysis: ${team} vs ${opponent}**

**1. Formation Recommendation:**
Based on ${team}'s recent performances and ${opponent}'s tactical approach, the recommended formation is: ${formation}

**2. Strategic Approach:**
- Maintain a compact defensive shape when out of possession
- Utilize quick transitions to exploit space behind ${opponent}'s defensive line
- Focus on controlling the central areas of the pitch to dictate play
- Deploy high pressing in opponent's half when appropriate

**3. Key Tactical Considerations:**
- ${opponent} tends to build attacks through the central channels
- Their fullbacks push high, leaving space to exploit on counter-attacks
- Their center-backs are vulnerable to pace and direct running
- They typically employ a high defensive line which can be exploited

**4. Player Roles and Responsibilities:**
- CBs: Maintain a compact defensive line, step out to intercept when necessary
- FBs/WBs: Provide width in attack, cover defensive zones when out of possession
- CMs: Control tempo, screen defense, and link play between defense and attack
- Wingers: Stay wide in attack, tuck in to create overloads when defending
- Striker: Lead the press, make diagonal runs to create space for midfield runners

**5. Set-Piece Strategy:**
- Defensive: Zonal marking with 2 players on the posts
- Offensive: Target the far post with inswinging deliveries
- Consider short corner routines to exploit ${opponent}'s man-marking system

**6. In-Game Adaptability:**
- If leading: Consider transitioning to a more defensive 5-4-1 formation
- If trailing: Shift to a more attacking 4-2-4 approach with overlapping fullbacks
- Adjust pressing intensity based on match situation and player fatigue

This tactical approach leverages ${team}'s strengths while targeting ${opponent}'s weaknesses, providing a balanced framework for both defensive stability and attacking threat.`;
  };
  
  // Extract formation from tactical analysis
  const extractFormation = (text) => {
    const formationMatch = text.match(/formation is: (\d-\d-\d-\d|\d-\d-\d|\d-\d)/i);
    if (formationMatch) return formationMatch[1];
    
    const basicMatch = text.match(/(\d-\d-\d-\d|\d-\d-\d|\d-\d)/i);
    if (basicMatch) return basicMatch[1];
    
    return "4-3-3"; // Default formation
  };

  const formatTacticalAnalysis = (text) => {
    if (!text || text.includes("Error")) return text;
    
    // Format headers and sections with improved formatting
    const formattedText = text
      // Add proper heading styles with spacing and font weight
      .replace(/\*\*([^*]+)\*\*/g, '<h3 class="text-lg font-bold mt-4 mb-2 text-blue-600 dark:text-blue-500">$1</h3>')
      // Format players and positions with highlight
      .replace(/([A-Z][a-z]+\s+[A-Z][a-z]+)(?=[\s,.])/g, '<span class="font-semibold text-indigo-600 dark:text-indigo-400">$1</span>')
      // Format position references
      .replace(/\b(CF|ST|LW|RW|CAM|CM|CDM|LM|RM|LB|RB|CB|GK|FBs|WBs|CBs)\b/g, '<span class="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">$1</span>')
      // Format formation references
      .replace(/\b(\d-\d-\d|\d-\d-\d-\d|\d-\d|\d-\d-\d)\b/g, '<span class="font-bold text-green-600 dark:text-green-500">$1</span>')
      // Format list items
      .replace(/- ([^\n]+)/g, '<li class="ml-6 mb-2 list-disc text-gray-800 dark:text-gray-200">$1</li>')
      // Format paragraphs
      .replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 dark:text-gray-300">')
      // Format statistics
      .replace(/(\d+)%/g, '<span class="font-semibold text-purple-600 dark:text-purple-400">$1%</span>');
  
    // Wrap in a paragraph tag to ensure proper formatting
    return `<p class="mb-4 text-gray-700 dark:text-gray-300">${formattedText}</p>`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tactics);
    alert("Tactics copied to clipboard!");
  };

  const loadHistoryItem = (item) => {
    setTeam(item.team);
    setOpponent(item.opponent);
    setTactics(item.result);
    setShowHistory(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const shareAnalysis = () => {
    const shareText = `StatTact AI - Tactical Analysis\n\nTeam: ${team}\nOpponent: ${opponent}\n\n${tactics.slice(0, 100)}...`;
    
    if (navigator.share) {
      navigator.share({
        title: 'StatTact AI Analysis',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Share link copied to clipboard!");
    }
  };
  
  // Share to social media
  const shareToSocial = (platform) => {
    const formationDetails = `${team} vs ${opponent}: ${getFormationType()} Formation Analysis`;
    const shareUrl = window.location.href;
    
    let shareWindow;
    
    switch(platform) {
      case 'twitter':
        shareWindow = window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(formationDetails)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'facebook':
        shareWindow = window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(formationDetails)}`, '_blank');
        break;
      case 'linkedin':
        shareWindow = window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(`${formationDetails}\n\n${shareUrl}`);
        alert("Link copied to clipboard!");
        break;
    }
    
    if (shareWindow) shareWindow.focus();
  };
  
  // Save formation functionality
  const saveCurrentFormation = () => {
    if (!team || !tactics) return;
    
    const newSavedFormation = {
      id: Date.now(),
      team,
      opponent,
      formation: getFormationType(),
      tactics,
      date: new Date().toLocaleString(),
      customPositions: {...customPositions}
    };
    
    setSavedFormations(prev => {
      const newSaved = [newSavedFormation, ...prev];
      localStorage.setItem('savedFormations', JSON.stringify(newSaved));
      return newSaved;
    });
    
    alert("Formation saved successfully!");
  };
  
  // Load saved formation
  const loadSavedFormation = (formation) => {
    setTeam(formation.team);
    setOpponent(formation.opponent);
    setTactics(formation.tactics);
    setCustomPositions(formation.customPositions || {});
    setShowSaved(false);
    setActiveTab('create');
  };
  
  // Simulate match
  const simulateMatch = () => {
    if (!team || !opponent) return;
    
    setShowSimulation(true);
    setLoading(true);
    
    // Simulate progress
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);
    
    // Mock match simulation
    setTimeout(() => {
      const teamScore = Math.floor(Math.random() * 5);
      const opponentScore = Math.floor(Math.random() * 4);
      
      const possessionTeam = 45 + Math.floor(Math.random() * 30);
      const possessionOpponent = 100 - possessionTeam;
      
      const shotsTeam = 8 + Math.floor(Math.random() * 12);
      const shotsOpponent = 5 + Math.floor(Math.random() * 10);
      
      const shotsOnTargetTeam = Math.floor(shotsTeam * (0.4 + Math.random() * 0.3));
      const shotsOnTargetOpponent = Math.floor(shotsOpponent * (0.3 + Math.random() * 0.4));
      
      const result = {
        score: {
          team: teamScore,
          opponent: opponentScore
        },
        stats: {
          possession: {
            team: possessionTeam,
            opponent: possessionOpponent
          },
          shots: {
            team: shotsTeam,
            opponent: shotsOpponent
          },
          shotsOnTarget: {
            team: shotsOnTargetTeam,
            opponent: shotsOnTargetOpponent
          },
          corners: {
            team: Math.floor(Math.random() * 10),
            opponent: Math.floor(Math.random() * 8)
          },
          fouls: {
            team: Math.floor(Math.random() * 12) + 5,
            opponent: Math.floor(Math.random() * 12) + 5
          },
          yellowCards: {
            team: Math.floor(Math.random() * 3),
            opponent: Math.floor(Math.random() * 4)
          },
          redCards: {
            team: Math.floor(Math.random() * 2),
            opponent: Math.floor(Math.random() * 2)
          }
        },
        events: generateMatchEvents(team, opponent, teamScore, opponentScore)
      };
      
      setSimulationResult(result);
      setLoadingProgress(100);
      
      setTimeout(() => {
        setLoading(false);
        setLoadingProgress(0);
      }, 500);
    }, 3000);
    
    clearInterval(interval);
  };
  
  // Generate match events
  const generateMatchEvents = (team, opponent, teamScore, opponentScore) => {
    const events = [];
    const totalGoals = teamScore + opponentScore;
    const playerNames = {
      team: ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez"],
      opponent: ["Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Moore", "Young", "Allen"]
    };
    
    // Generate goal events
    const goalMinutes = [];
    for (let i = 0; i < totalGoals; i++) {
      let minute;
      do {
        minute = Math.floor(Math.random() * 90) + 1;
      } while (goalMinutes.includes(minute));
      
      goalMinutes.push(minute);
    }
    
    goalMinutes.sort((a, b) => a - b);
    
    let teamGoals = 0;
    let opponentGoals = 0;
    
    goalMinutes.forEach(minute => {
      const isTeamGoal = (teamGoals < teamScore) && 
        (opponentGoals >= opponentScore || Math.random() > 0.5);
      
      if (isTeamGoal && teamGoals < teamScore) {
        const scorer = playerNames.team[Math.floor(Math.random() * playerNames.team.length)];
        const assister = playerNames.team[Math.floor(Math.random() * playerNames.team.length)];
        
        events.push({
          minute,
          team: 'team',
          type: 'goal',
          player: scorer,
          assist: Math.random() > 0.3 ? assister : null,
          description: `${scorer} scores for ${team}${Math.random() > 0.3 ? ` (assist: ${assister})` : ''}!`
        });
        
        teamGoals++;
      } else if (opponentGoals < opponentScore) {
        const scorer = playerNames.opponent[Math.floor(Math.random() * playerNames.opponent.length)];
        const assister = playerNames.opponent[Math.floor(Math.random() * playerNames.opponent.length)];
        
        events.push({
          minute,
          team: 'opponent',
          type: 'goal',
          player: scorer,
          assist: Math.random() > 0.3 ? assister : null,
          description: `${scorer} scores for ${opponent}${Math.random() > 0.3 ? ` (assist: ${assister})` : ''}!`
        });
        
        opponentGoals++;
      }
    });
    
    // Add card events
    const yellowCardCount = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < yellowCardCount; i++) {
      const isTeam = Math.random() > 0.5;
      const minute = Math.floor(Math.random() * 90) + 1;
      const player = playerNames[isTeam ? 'team' : 'opponent'][Math.floor(Math.random() * playerNames[isTeam ? 'team' : 'opponent'].length)];
      
      events.push({
        minute,
        team: isTeam ? 'team' : 'opponent',
        type: 'yellowCard',
        player,
        description: `Yellow card for ${player} (${isTeam ? team : opponent})`
      });
    }
    
    // Sort events by minute
    return events.sort((a, b) => a.minute - b.minute);
  };
  
  // Handle drag start for player position customization
  const handleDragStart = (e, player) => {
    setDraggedPlayer(player);
  };
  
  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  // Handle drop to customize player position
  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedPlayer) return;
    
    // Get position relative to the pitch
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Update custom positions
    setCustomPositions(prev => ({
      ...prev,
      [draggedPlayer]: { x, y }
    }));
    
    setDraggedPlayer(null);
  };

  // Determine formation type from tactics
  const getFormationType = () => {
    if (!tactics) return "4-3-3"; // Default formation
    
    const formationMatch = tactics.match(/formation is: (\d-\d-\d-\d|\d-\d-\d|\d-\d)/i);
    if (formationMatch) {
      return formationMatch[1];
    }
    
    // Alternative format: "Recommended Formation: 4-2-3-1"
    const altMatch = tactics.match(/recommended formation:?\s*(\d-\d-\d-\d|\d-\d-\d|\d-\d)/i);
    if (altMatch) {
      return altMatch[1];
    }
    
    // Look for any formation pattern
    const basicMatch = tactics.match(/(\d-\d-\d-\d|\d-\d-\d|\d-\d)/i);
    if (basicMatch) {
      return basicMatch[1];
    }
    
    return "4-3-3"; // Default fallback
  };
  
  // Get player positions based on formation
  const getPlayerPositions = () => {
    const formation = getFormationType();
    let positions = [];
    
    // Format: array of [label, defaultX, defaultY, color]
    switch (formation) {
      case "4-2-3-1":
        positions = [
          ["ST", 50, 15, "#FCD34D"],
          ["LW", 25, 30, "#FCD34D"],
          ["CAM", 50, 30, "#FCD34D"],
          ["RW", 75, 30, "#FCD34D"],
          ["CDM", 40, 45, "#60A5FA"],
          ["CDM", 60, 45, "#60A5FA"],
          ["LB", 20, 70, "#F87171"],
          ["CB", 40, 70, "#F87171"],
          ["CB", 60, 70, "#F87171"],
          ["RB", 80, 70, "#F87171"],
          ["GK", 50, 88, "#A78BFA"]
        ];
        break;
      case "4-3-3":
        positions = [
          ["LW", 25, 15, "#FCD34D"],
          ["ST", 50, 15, "#FCD34D"],
          ["RW", 75, 15, "#FCD34D"],
          ["CM", 30, 45, "#60A5FA"],
          ["CM", 50, 45, "#60A5FA"],
          ["CM", 70, 45, "#60A5FA"],
          ["LB", 20, 70, "#F87171"],
          ["CB", 40, 70, "#F87171"],
          ["CB", 60, 70, "#F87171"],
          ["RB", 80, 70, "#F87171"],
          ["GK", 50, 88, "#A78BFA"]
        ];
        break;
      case "3-4-3":
        positions = [
          ["LW", 25, 15, "#FCD34D"],
          ["ST", 50, 15, "#FCD34D"],
          ["RW", 75, 15, "#FCD34D"],
          ["LM", 15, 45, "#60A5FA"],
          ["CM", 38, 45, "#60A5FA"],
          ["CM", 62, 45, "#60A5FA"],
          ["RM", 85, 45, "#60A5FA"],
          ["CB", 30, 70, "#F87171"],
          ["CB", 50, 70, "#F87171"],
          ["CB", 70, 70, "#F87171"],
          ["GK", 50, 88, "#A78BFA"]
        ];
        break;
      case "3-5-2":
        positions = [
          ["ST", 40, 15, "#FCD34D"],
          ["ST", 60, 15, "#FCD34D"],
          ["LM", 15, 40, "#60A5FA"],
          ["CM", 35, 45, "#60A5FA"],
          ["CDM", 50, 55, "#60A5FA"],
          ["CM", 65, 45, "#60A5FA"],
          ["RM", 85, 40, "#60A5FA"],
          ["CB", 30, 70, "#F87171"],
          ["CB", 50, 70, "#F87171"],
          ["CB", 70, 70, "#F87171"],
          ["GK", 50, 88, "#A78BFA"]
        ];
        break;
      case "4-4-2":
        positions = [
          ["ST", 40, 15, "#FCD34D"],
          ["ST", 60, 15, "#FCD34D"],
          ["LM", 15, 45, "#60A5FA"],
          ["CM", 35, 45, "#60A5FA"],
          ["CM", 65, 45, "#60A5FA"],
          ["RM", 85, 45, "#60A5FA"],
          ["LB", 20, 70, "#F87171"],
          ["CB", 40, 70, "#F87171"],
          ["CB", 60, 70, "#F87171"],
          ["RB", 80, 70, "#F87171"],
          ["GK", 50, 88, "#A78BFA"]
        ];
        break;
      case "5-3-2":
        positions = [
          ["ST", 40, 15, "#FCD34D"],
          ["ST", 60, 15, "#FCD34D"],
          ["CM", 30, 45, "#60A5FA"],
          ["CM", 50, 45, "#60A5FA"],
          ["CM", 70, 45, "#60A5FA"],
          ["LWB", 10, 60, "#F87171"],
          ["CB", 30, 70, "#F87171"],
          ["CB", 50, 70, "#F87171"],
          ["CB", 70, 70, "#F87171"],
          ["RWB", 90, 60, "#F87171"],
          ["GK", 50, 88, "#A78BFA"]
        ];
        break;
      default:
        positions = [
          ["LW", 25, 15, "#FCD34D"],
          ["ST", 50, 15, "#FCD34D"],
          ["RW", 75, 15, "#FCD34D"],
          ["CM", 30, 45, "#60A5FA"],
          ["CM", 50, 45, "#60A5FA"],
          ["CM", 70, 45, "#60A5FA"],
          ["LB", 20, 70, "#F87171"],
          ["CB", 40, 70, "#F87171"],
          ["CB", 60, 70, "#F87171"],
          ["RB", 80, 70, "#F87171"],
          ["GK", 50, 88, "#A78BFA"]
        ];
    }
    
    return positions;
  };

  // Render the appropriate formation visualization with draggable players
  const renderFormationVisualization = () => {
    const positions = getPlayerPositions();
    
    return (
      <div 
        style={{ position: "relative", width: "100%", height: "100%" }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {positions.map((player, index) => {
          const [label, defaultX, defaultY, color] = player;
          
          // Use custom position if available, otherwise use default
          const x = customPositions[label] ? customPositions[label].x : defaultX;
          const y = customPositions[label] ? customPositions[label].y : defaultY;
          
          return (
            <div 
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, label)}
              style={{
                position: "absolute",
                top: `${y}%`,
                left: `${x}%`,
                transform: "translate(-50%, -50%)",
                cursor: "move",
              }}
            >
              <div style={{
                width: "28px",
                height: "28px",
                backgroundColor: color,
                color: color === "#FCD34D" ? "#7C2D12" : 
                      color === "#60A5FA" ? "#1E3A8A" : 
                      color === "#F87171" ? "#7F1D1D" : "#4C1D95",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.7rem",
                fontWeight: "bold",
                boxShadow: "0 0 0 2px white, 0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "all 0.15s ease-in-out"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.15)";
                e.currentTarget.style.boxShadow = "0 0 0 2px white, 0 8px 16px rgba(0, 0, 0, 0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 0 0 2px white, 0 4px 6px rgba(0, 0, 0, 0.1)";
              }}
            >
              {label}
            </div>
          </div>
          );
        })}
      </div>
    );
  };
  
  // Render match simulation results
  const renderSimulationResults = () => {
    if (!simulationResult) return null;
    
    const { score, stats, events } = simulationResult;
    
    return (
      <div style={{
        padding: "1.5rem",
        backgroundColor: isDarkMode ? "#1F2937" : "white",
        borderRadius: "0.5rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        marginTop: "1.5rem"
      }}>
        <h3 style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "1rem",
          color: isDarkMode ? "#F3F4F6" : "#111827"
        }}>
          Match Result
        </h3>
        
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "1.5rem"
        }}>
          <div style={{
            flex: "1",
            textAlign: "center",
            padding: "0.5rem"
          }}>
            <div style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: isDarkMode ? "#F3F4F6" : "#111827"
            }}>
              {team}
            </div>
          </div>
          
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "0.5rem 2rem",
            backgroundColor: isDarkMode ? "#374151" : "#F3F4F6",
            borderRadius: "0.5rem"
          }}>
            <span style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: score.team > score.opponent ? "#10B981" : 
                    score.team === score.opponent ? "#6B7280" : "#EF4444"
            }}>
              {score.team}
            </span>
            <span style={{
              margin: "0 0.5rem",
              fontSize: "1.5rem",
              color: isDarkMode ? "#9CA3AF" : "#6B7280"
            }}>
              -
            </span>
            <span style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: score.opponent > score.team ? "#10B981" : 
                    score.opponent === score.team ? "#6B7280" : "#EF4444"
            }}>
              {score.opponent}
            </span>
          </div>
          
          <div style={{
            flex: "1",
            textAlign: "center",
            padding: "0.5rem"
          }}>
            <div style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: isDarkMode ? "#F3F4F6" : "#111827"
            }}>
              {opponent}
            </div>
          </div>
        </div>
        
        {/* Match Stats */}
        <div style={{
          marginBottom: "1.5rem",
          borderTop: isDarkMode ? "1px solid #374151" : "1px solid #E5E7EB",
          borderBottom: isDarkMode ? "1px solid #374151" : "1px solid #E5E7EB",
          padding: "1rem 0"
        }}>
          <h4 style={{
            fontSize: "1rem",
            fontWeight: "600",
            marginBottom: "1rem",
            color: isDarkMode ? "#F3F4F6" : "#111827",
            textAlign: "center"
          }}>
            Match Statistics
          </h4>
          
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem"
          }}>
            {/* Possession */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div style={{
                width: "15%",
                textAlign: "center",
                fontWeight: "600",
                fontSize: "0.875rem",
                color: isDarkMode ? "#F3F4F6" : "#111827"
              }}>
                {stats.possession.team}%
              </div>
              
              <div style={{
                width: "70%"
              }}>
                <div style={{
                  position: "relative",
                  height: "0.5rem",
                  backgroundColor: isDarkMode ? "#4B5563" : "#E5E7EB",
                  borderRadius: "9999px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    position: "absolute",
                    left: "0",
                    top: "0",
                    height: "100%",
                    width: `${stats.possession.team}%`,
                    backgroundColor: "#3B82F6",
                    borderRadius: "9999px 0 0 9999px"
                  }}></div>
                </div>
                <div style={{
                  textAlign: "center",
                  fontSize: "0.75rem",
                  marginTop: "0.25rem",
                  color: isDarkMode ? "#9CA3AF" : "#6B7280"
                }}>
                  Possession
                </div>
              </div>
              
              <div style={{
                width: "15%",
                textAlign: "center",
                fontWeight: "600",
                fontSize: "0.875rem",
                color: isDarkMode ? "#F3F4F6" : "#111827"
              }}>
                {stats.possession.opponent}%
              </div>
            </div>
            
            {/* Shots */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div style={{
                width: "15%",
                textAlign: "center",
                fontWeight: "600",
                fontSize: "0.875rem",
                color: isDarkMode ? "#F3F4F6" : "#111827"
              }}>
                {stats.shots.team}
              </div>
              
              <div style={{
                width: "70%"
              }}>
                <div style={{
                  position: "relative",
                  height: "0.5rem",
                  backgroundColor: isDarkMode ? "#4B5563" : "#E5E7EB",
                  borderRadius: "9999px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    position: "absolute",
                    left: "0",
                    top: "0",
                    height: "100%",
                    width: `${(stats.shots.team / (stats.shots.team + stats.shots.opponent)) * 100}%`,
                    backgroundColor: "#3B82F6",
                    borderRadius: "9999px 0 0 9999px"
                  }}></div>
                </div>
                <div style={{
                  textAlign: "center",
                  fontSize: "0.75rem",
                  marginTop: "0.25rem",
                  color: isDarkMode ? "#9CA3AF" : "#6B7280"
                }}>
                  Shots
                </div>
              </div>
              
              <div style={{
                width: "15%",
                textAlign: "center",
                fontWeight: "600",
                fontSize: "0.875rem",
                color: isDarkMode ? "#F3F4F6" : "#111827"
              }}>
                {stats.shots.opponent}
              </div>
            </div>
            
            {/* Shots on Target */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div style={{
                width: "15%",
                textAlign: "center",
                fontWeight: "600",
                fontSize: "0.875rem",
                color: isDarkMode ? "#F3F4F6" : "#111827"
              }}>
                {stats.shotsOnTarget.team}
              </div>
              
              <div style={{
                width: "70%"
              }}>
                <div style={{
                  position: "relative",
                  height: "0.5rem",
                  backgroundColor: isDarkMode ? "#4B5563" : "#E5E7EB",
                  borderRadius: "9999px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    position: "absolute",
                    left: "0",
                    top: "0",
                    height: "100%",
                    width: `${(stats.shotsOnTarget.team / (stats.shotsOnTarget.team + stats.shotsOnTarget.opponent)) * 100}%`,
                    backgroundColor: "#3B82F6",
                    borderRadius: "9999px 0 0 9999px"
                  }}></div>
                </div>
                <div style={{
                  textAlign: "center",
                  fontSize: "0.75rem",
                  marginTop: "0.25rem",
                  color: isDarkMode ? "#9CA3AF" : "#6B7280"
                }}>
                  Shots on Target
                </div>
              </div>
              
              <div style={{
                width: "15%",
                textAlign: "center",
                fontWeight: "600",
                fontSize: "0.875rem",
                color: isDarkMode ? "#F3F4F6" : "#111827"
              }}>
                {stats.shotsOnTarget.opponent}
              </div>
            </div>
            
            {/* Corners */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div style={{
                width: "15%",
                textAlign: "center",
                fontWeight: "600",
                fontSize: "0.875rem",
                color: isDarkMode ? "#F3F4F6" : "#111827"
              }}>
                {stats.corners.team}
              </div>
              
              <div style={{
                width: "70%"
              }}>
                <div style={{
                  position: "relative",
                  height: "0.5rem",
                  backgroundColor: isDarkMode ? "#4B5563" : "#E5E7EB",
                  borderRadius: "9999px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    position: "absolute",
                    left: "0",
                    top: "0",
                    height: "100%",
                    width: `${(stats.corners.team / (stats.corners.team + stats.corners.opponent)) * 100}%`,
                    backgroundColor: "#3B82F6",
                    borderRadius: "9999px 0 0 9999px"
                  }}></div>
                </div>
                <div style={{
                  textAlign: "center",
                  fontSize: "0.75rem",
                  marginTop: "0.25rem",
                  color: isDarkMode ? "#9CA3AF" : "#6B7280"
                }}>
                  Corners
                </div>
              </div>
              
              <div style={{
                width: "15%",
                textAlign: "center",
                fontWeight: "600",
                fontSize: "0.875rem",
                color: isDarkMode ? "#F3F4F6" : "#111827"
              }}>
                {stats.corners.opponent}
              </div>
            </div>
            
            {/* Fouls */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div style={{
                width: "15%",
                textAlign: "center",
                fontWeight: "600",
                fontSize: "0.875rem",
                color: isDarkMode ? "#F3F4F6" : "#111827"
              }}>
                {stats.fouls.team}
              </div>
              
              <div style={{
                width: "70%"
              }}>
                <div style={{
                  position: "relative",
                  height: "0.5rem",
                  backgroundColor: isDarkMode ? "#4B5563" : "#E5E7EB",
                  borderRadius: "9999px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    position: "absolute",
                    left: "0",
                    top: "0",
                    height: "100%",
                    width: `${(stats.fouls.team / (stats.fouls.team + stats.fouls.opponent)) * 100}%`,
                    backgroundColor: "#EF4444",
                    borderRadius: "9999px 0 0 9999px"
                  }}></div>
                </div>
                <div style={{
                  textAlign: "center",
                  fontSize: "0.75rem",
                  marginTop: "0.25rem",
                  color: isDarkMode ? "#9CA3AF" : "#6B7280"
                }}>
                  Fouls
                </div>
              </div>
              
              <div style={{
                width: "15%",
                textAlign: "center",
                fontWeight: "600",
                fontSize: "0.875rem",
                color: isDarkMode ? "#F3F4F6" : "#111827"
              }}>
                {stats.fouls.opponent}
              </div>
            </div>
            
            {/* Cards */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginTop: "0.5rem",
              justifyContent: "center"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <div style={{
                  width: "1rem",
                  height: "1.5rem",
                  backgroundColor: "#FBBF24",
                  borderRadius: "0.125rem"
                }}></div>
                <span style={{
                  fontSize: "0.875rem",
                  color: isDarkMode ? "#F3F4F6" : "#111827"
                }}>
                  {stats.yellowCards.team} - {stats.yellowCards.opponent}
                </span>
              </div>
              
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <div style={{
                  width: "1rem",
                  height: "1.5rem",
                  backgroundColor: "#EF4444",
                  borderRadius: "0.125rem"
                }}></div>
                <span style={{
                  fontSize: "0.875rem",
                  color: isDarkMode ? "#F3F4F6" : "#111827"
                }}>
                  {stats.redCards.team} - {stats.redCards.opponent}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Match Events */}
        <div>
          <h4 style={{
            fontSize: "1rem",
            fontWeight: "600",
            marginBottom: "1rem",
            color: isDarkMode ? "#F3F4F6" : "#111827",
            textAlign: "center"
          }}>
            Match Timeline
          </h4>
          
          <div style={{
            display: "flex",
            flexDirection: "column"
          }}>
            {events.map((event, index) => (
              <div key={index} style={{
                display: "flex",
                padding: "0.5rem 0",
                borderBottom: index < events.length - 1 ? (isDarkMode ? "1px solid #374151" : "1px solid #E5E7EB") : "none"
              }}>
                <div style={{
                  width: "3rem",
                  fontWeight: "bold",
                  color: isDarkMode ? "#9CA3AF" : "#6B7280",
                  textAlign: "center"
                }}>
                  {event.minute}'
                </div>
                
                <div style={{
                  flex: "1",
                  marginLeft: "0.5rem",
                  fontSize: "0.875rem",
                  color: isDarkMode ? "#F3F4F6" : "#111827",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  {event.type === 'goal' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="8" />
                    </svg>
                  )}
                  
                  {event.type === 'yellowCard' && (
                    <div style={{
                      width: "0.75rem",
                      height: "1rem",
                      backgroundColor: "#FBBF24",
                      borderRadius: "0.125rem"
                    }}></div>
                  )}
                  
                  {event.type === 'redCard' && (
                    <div style={{
                      width: "0.75rem",
                      height: "1rem",
                      backgroundColor: "#EF4444",
                      borderRadius: "0.125rem"
                    }}></div>
                  )}
                  
                  <span style={{
                    color: event.team === 'team' ? '#3B82F6' : '#EF4444'
                  }}>
                    {event.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "1.5rem"
        }}>
          <button
            onClick={() => setShowSimulation(false)}
            style={{
              padding: "0.625rem 1.25rem",
              borderRadius: "0.375rem",
              backgroundColor: isDarkMode ? "#374151" : "#F3F4F6",
              color: isDarkMode ? "#F3F4F6" : "#111827",
              border: "none",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.15s ease-in-out"
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  };
  
  // Render leaderboard tab
  const renderLeaderboardTab = () => {
    return (
      <div style={{
        padding: "1.5rem"
      }}>
        <h2 style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "1.5rem",
          color: isDarkMode ? "#F3F4F6" : "#111827",
          textAlign: "center"
        }}>
          Seasonal Leaderboard
        </h2>
        
        <div style={{
          backgroundColor: isDarkMode ? "#1F2937" : "white",
          borderRadius: "0.75rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          border: isDarkMode ? "1px solid #374151" : "1px solid #E5E7EB"
        }}>
          <div style={{
            padding: "1rem",
            display: "grid",
            gridTemplateColumns: "0.5fr 2fr 1fr 1fr 1fr 1fr",
            gap: "0.5rem",
            borderBottom: isDarkMode ? "1px solid #374151" : "1px solid #E5E7EB",
            backgroundColor: isDarkMode ? "#111827" : "#F9FAFB",
            fontWeight: "600",
            color: isDarkMode ? "#D1D5DB" : "#4B5563"
          }}>
            <div>Rank</div>
            <div>User</div>
            <div>Points</div>
            <div>W</div>
            <div>D</div>
            <div>L</div>
          </div>
          
          {leaderboardData.map((entry, index) => (
            <div 
              key={index}
              style={{
                padding: "1rem",
                display: "grid",
                gridTemplateColumns: "0.5fr 2fr 1fr 1fr 1fr 1fr",
                gap: "0.5rem",
                borderBottom: index < leaderboardData.length - 1 ? (isDarkMode ? "1px solid #374151" : "1px solid #E5E7EB") : "none",
                backgroundColor: entry.rank <= 3 ? (isDarkMode ? "#1E3A8A" : "#DBEAFE") : "transparent",
                color: isDarkMode ? "#F3F4F6" : "#111827"
              }}
            >
              <div style={{
                fontWeight: entry.rank <= 3 ? "bold" : "normal",
                color: entry.rank === 1 ? "#F59E0B" : 
                      entry.rank === 2 ? "#6B7280" : 
                      entry.rank === 3 ? "#B45309" : isDarkMode ? "#F3F4F6" : "#111827"
              }}>
                {entry.rank}
              </div>
              <div style={{
                fontWeight: entry.rank <= 3 ? "bold" : "normal"
              }}>
                {entry.user}
              </div>
              <div>{entry.points}</div>
              <div>{entry.wins}</div>
              <div>{entry.draws}</div>
              <div>{entry.losses}</div>
            </div>
          ))}
        </div>
        
        <div style={{
          marginTop: "1.5rem",
          display: "flex",
          justifyContent: "center",
          gap: "1rem"
        }}>
          <button
            style={{
              padding: "0.625rem 1.25rem",
              borderRadius: "0.375rem",
              backgroundColor: isDarkMode ? "#2563EB" : "#3B82F6",
              color: "white",
              border: "none",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "background-color 0.15s ease-in-out"
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            Join Season 1 Tournament
          </button>
          
          <button
            style={{
              padding: "0.625rem 1.25rem",
              borderRadius: "0.375rem",
              backgroundColor: isDarkMode ? "#374151" : "#F3F4F6",
              color: isDarkMode ? "#F3F4F6" : "#111827",
              border: "none",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "background-color 0.15s ease-in-out"
            }}
          >
            View Previous Season Results
          </button>
        </div>
      </div>
    );
  };
  
  // Render community tab
  const renderCommunityTab = () => {
    return (
      <div style={{
        padding: "1.5rem"
      }}>
        <h2 style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          color: isDarkMode ? "#F3F4F6" : "#111827",
          textAlign: "center"
        }}>
          Community Formations
        </h2>
        
        <div style={{
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "center"
        }}>
          <div style={{
            display: "flex",
            backgroundColor: isDarkMode ? "#111827" : "#F3F4F6",
            borderRadius: "9999px",
            padding: "0.25rem",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
          }}>
            <button
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "9999px",
                border: "none",
                fontWeight: "500",
                cursor: "pointer",
                backgroundColor: "trending" === "trending" ? (isDarkMode ? "#2563EB" : "#3B82F6") : "transparent",
                color: "trending" === "trending" ? "white" : (isDarkMode ? "#D1D5DB" : "#4B5563"),
                transition: "all 0.15s ease-in-out"
              }}
            >
              Trending
            </button>
            
            <button
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "9999px",
                border: "none",
                fontWeight: "500",
                cursor: "pointer",
                backgroundColor: "trending" === "popular" ? (isDarkMode ? "#2563EB" : "#3B82F6") : "transparent",
                color: "trending" === "popular" ? "white" : (isDarkMode ? "#D1D5DB" : "#4B5563"),
                transition: "all 0.15s ease-in-out"
              }}
            >
              Popular
            </button>
            
            <button
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "9999px",
                border: "none",
                fontWeight: "500",
                cursor: "pointer",
                backgroundColor: "trending" === "recent" ? (isDarkMode ? "#2563EB" : "#3B82F6") : "transparent",
                color: "trending" === "recent" ? "white" : (isDarkMode ? "#D1D5DB" : "#4B5563"),
                transition: "all 0.15s ease-in-out"
              }}
            >
              Recent
            </button>
          </div>
        </div>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem"
        }}>
          {communityFormations.map((formation, index) => (
            <div
              key={index}
              style={{
                backgroundColor: isDarkMode ? "#1F2937" : "white",
                borderRadius: "0.75rem",
                overflow: "hidden",
                border: isDarkMode ? "1px solid #374151" : "1px solid #E5E7EB",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
                cursor: "pointer"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 10px 15px rgba(0, 0, 0, 0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
              }}
            >
              <div style={{
                position: "relative",
                paddingBottom: "60%",
                backgroundColor: "#15803D"
              }}>
                {/* Formation visualization (simplified) */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.5rem"
                }}>
                  {formation.formation}
                </div>
                
                <div style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  backgroundColor: isDarkMode ? "rgba(17, 24, 39, 0.8)" : "rgba(249, 250, 251, 0.8)",
                  color: isDarkMode ? "#F3F4F6" : "#111827",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "9999px",
                  backdropFilter: "blur(4px)"
                }}>
                  {formation.team}
                </div>
              </div>
              
              <div style={{
                padding: "1rem"
              }}>
                <h3 style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                  color: isDarkMode ? "#F3F4F6" : "#111827"
                }}>
                  {formation.title}
                </h3>
                
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1rem"
                }}>
                  <div style={{
                    width: "1.5rem",
                    height: "1.5rem",
                    backgroundColor: isDarkMode ? "#374151" : "#F3F4F6",
                    borderRadius: "9999px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    color: isDarkMode ? "#D1D5DB" : "#6B7280"
                  }}>
                    {formation.creator.charAt(0).toUpperCase()}
                  </div>
                  
                  <span style={{
                    fontSize: "0.875rem",
                    color: isDarkMode ? "#D1D5DB" : "#6B7280"
                  }}>
                    {formation.creator}
                  </span>
                  
                  <span style={{
                    fontSize: "0.75rem",
                    color: isDarkMode ? "#9CA3AF" : "#9CA3AF",
                    marginLeft: "auto"
                  }}>
                    {formation.date}
                  </span>
                </div>
                
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "auto"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem"
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem"
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: isDarkMode ? "#D1D5DB" : "#6B7280" }}>
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                      </svg>
                      <span style={{
                        fontSize: "0.875rem",
                        color: isDarkMode ? "#D1D5DB" : "#6B7280"
                      }}>
                        {formation.likes}
                      </span>
                    </div>
                    
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem"
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: isDarkMode ? "#D1D5DB" : "#6B7280" }}>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      <span style={{
                        fontSize: "0.875rem",
                        color: isDarkMode ? "#D1D5DB" : "#6B7280"
                      }}>
                        {formation.views}
                      </span>
                    </div>
                  </div>
                  
                  <button style={{
                    backgroundColor: isDarkMode ? "#2563EB" : "#3B82F6",
                    color: "white",
                    border: "none",
                    borderRadius: "0.375rem",
                    padding: "0.375rem 0.75rem",
                    fontWeight: "500",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    transition: "background-color 0.15s ease-in-out"
                  }}>
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{
          marginTop: "2rem",
          display: "flex",
          justifyContent: "center"
        }}>
          <button style={{
            backgroundColor: isDarkMode ? "#2563EB" : "#3B82F6",
            color: "white",
            border: "none",
            borderRadius: "0.375rem",
            padding: "0.625rem 1.25rem",
            fontWeight: "500",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            transition: "background-color 0.15s ease-in-out"
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14"></path>
              <path d="M5 12h14"></path>
            </svg>
            Share Your Formation
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: isDarkMode 
        ? "linear-gradient(to bottom right, #111827, #1f2937)" 
        : "linear-gradient(to bottom right, #f9fafb, #f3f4f6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      transition: "background 0.3s ease"
    }}>
      {/* Home button - added as requested */}
      <div style={{
        position: "absolute",
        top: "1rem",
        left: "1rem",
        zIndex: "10"
      }}>
        <a 
          href="/"
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: isDarkMode ? "#374151" : "#E5E7EB",
            color: isDarkMode ? "#F9FAFB" : "#1F2937",
            border: "none",
            borderRadius: "0.375rem",
            fontWeight: "500",
            cursor: "pointer",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.875rem",
            transition: "background-color 0.3s ease"
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          Home
        </a>
      </div>

      {/* Dark mode toggle */}
      <div style={{
        position: "absolute",
        top: "1rem",
        right: "1rem",
        zIndex: "10"
      }}>
        <button
          onClick={toggleDarkMode}
          style={{
            backgroundColor: isDarkMode ? "#4B5563" : "#E5E7EB",
            color: isDarkMode ? "#F9FAFB" : "#1F2937",
            border: "none",
            borderRadius: "9999px",
            width: "2.5rem",
            height: "2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background-color 0.3s ease"
          }}
        >
          {isDarkMode ? (
            // Sun icon
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            // Moon icon
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>
      </div>

      <div style={{
        width: "100%",
        maxWidth: "64rem",
        backgroundColor: isDarkMode ? "#1F2937" : "white",
        borderRadius: "0.75rem",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        border: isDarkMode ? "1px solid #374151" : "1px solid #e5e7eb",
        overflow: "hidden",
        transition: "background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease"
      }}>
        {/* App Header */}
        <div style={{
          padding: "1.5rem",
          textAlign: "center",
          borderBottom: isDarkMode ? "1px solid #374151" : "1px solid #e5e7eb",
          position: "relative",
          transition: "border-color 0.3s ease"
        }}>
          <div style={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            cursor: "pointer"
          }}>
            <button
              onClick={() => setShowHistory(!showHistory)}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: isDarkMode ? "#9CA3AF" : "#6B7280",
                padding: "0.25rem",
                borderRadius: "0.375rem",
                display: "flex",
                alignItems: "center",
                transition: "color 0.3s ease"
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </button>
          </div>

          <h1 style={{
            fontSize: "2.25rem",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#3B82F6",
            transition: "color 0.3s ease"
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#3B82F6">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              <path d="M12 4c-2.67 0-5.05 1.21-6.63 3.12L12 12l6.63-4.88C16.05 5.21 13.67 4 12 4z"/>
              <path d="M7.88 7.88L5.12 5.12C3.16 7.08 2 9.71 2 12c0 2.29 0.76 4.4 2.04 6.12L7.88 16.12C6.68 15.03 6 13.57 6 12c0-1.57 0.68-3.03 1.88-4.12z"/>
              <path d="M16.12 7.88L18.88 5.12C20.84 7.08 22 9.71 22 12c0 2.29-0.76 4.4-2.04 6.12L16.12 16.12C17.32 15.03 18 13.57 18 12c0-1.57-0.68-3.03-1.88-4.12z"/>
              <path d="M12 20c2.67 0 5.05-1.21 6.63-3.12L12 12l-6.63 4.88C6.95 18.79 9.33 20 12 20z"/>
            </svg>
            <span style={{ marginLeft: "0.75rem" }}>StatTact AI</span>
          </h1>
          <p style={{
            fontSize: "0.875rem",
            color: isDarkMode ? "#9CA3AF" : "#6B7280",
            marginTop: "0.5rem",
            transition: "color 0.3s ease"
          }}>
            Professional soccer tactics & formation platform
          </p>
          
          {/* Navigation Tabs */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1.5rem",
            borderBottom: isDarkMode ? "1px solid #374151" : "1px solid #E5E7EB",
          }}>
            <button 
              onClick={() => setActiveTab('create')}
              style={{
                padding: "0.75rem 1.5rem",
                fontWeight: "500",
                color: activeTab === 'create' ? (isDarkMode ? "#60A5FA" : "#2563EB") : (isDarkMode ? "#9CA3AF" : "#6B7280"),
                borderBottom: activeTab === 'create' ? (isDarkMode ? "2px solid #60A5FA" : "2px solid #2563EB") : "2px solid transparent",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                transition: "all 0.15s ease-in-out"
              }}
            >
              Create
            </button>
            
            <button 
              onClick={() => setActiveTab('community')}
              style={{
                padding: "0.75rem 1.5rem",
                fontWeight: "500",
                color: activeTab === 'community' ? (isDarkMode ? "#60A5FA" : "#2563EB") : (isDarkMode ? "#9CA3AF" : "#6B7280"),
                borderBottom: activeTab === 'community' ? (isDarkMode ? "2px solid #60A5FA" : "2px solid #2563EB") : "2px solid transparent",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                transition: "all 0.15s ease-in-out"
              }}
            >
              Community
            </button>
            
            <button 
              onClick={() => setActiveTab('matches')}
              style={{
                padding: "0.75rem 1.5rem",
                fontWeight: "500",
                color: activeTab === 'matches' ? (isDarkMode ? "#60A5FA" : "#2563EB") : (isDarkMode ? "#9CA3AF" : "#6B7280"),
                borderBottom: activeTab === 'matches' ? (isDarkMode ? "2px solid #60A5FA" : "2px solid #2563EB") : "2px solid transparent",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                transition: "all 0.15s ease-in-out"
              }}
            >
              Matches
            </button>
            
            <button 
              onClick={() => setActiveTab('leaderboard')}
              style={{
                padding: "0.75rem 1.5rem",
                fontWeight: "500",
                color: activeTab === 'leaderboard' ? (isDarkMode ? "#60A5FA" : "#2563EB") : (isDarkMode ? "#9CA3AF" : "#6B7280"),
                borderBottom: activeTab === 'leaderboard' ? (isDarkMode ? "2px solid #60A5FA" : "2px solid #2563EB") : "2px solid transparent",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                transition: "all 0.15s ease-in-out"
              }}
            >
              Leaderboard
            </button>
            
            <button 
              onClick={() => setActiveTab('profile')}
              style={{
                padding: "0.75rem 1.5rem",
                fontWeight: "500",
                color: activeTab === 'profile' ? (isDarkMode ? "#60A5FA" : "#2563EB") : (isDarkMode ? "#9CA3AF" : "#6B7280"),
                borderBottom: activeTab === 'profile' ? (isDarkMode ? "2px solid #60A5FA" : "2px solid #2563EB") : "2px solid transparent",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                transition: "all 0.15s ease-in-out"
              }}
            >
              Profile
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        {activeTab === 'create' && (
          <div style={{
            padding: "1.5rem",
            transition: "padding 0.3s ease"
          }}>
            {/* Team Selection */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1.5rem"
            }}>
              <div>
                <label 
                  htmlFor="team-select"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: isDarkMode ? "#F3F4F6" : "#111827",
                    transition: "color 0.3s ease"
                  }}
                >
                  Your Team
                </label>
                <select
                  id="team-select"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.625rem 0.75rem",
                    backgroundColor: isDarkMode ? "#374151" : "white",
                    color: isDarkMode ? "#F3F4F6" : "#111827",
                    border: isDarkMode ? "1px solid #4B5563" : "1px solid #D1D5DB",
                    borderRadius: "0.375rem",
                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: "right 0.5rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    transition: "all 0.3s ease"
                  }}
                >
                  <option value="">Select your team</option>
                  {teamsList.length > 0 ? (
                    teamsList.map((team, index) => (
                      <option key={index} value={team.name}>{team.name}</option>
                    ))
                  ) : (
                    // Fallback options if API call fails
                    <>
                      <option value="Arsenal">Arsenal</option>
                      <option value="Chelsea">Chelsea</option>
                      <option value="Liverpool">Liverpool</option>
                      <option value="Manchester City">Manchester City</option>
                      <option value="Manchester United">Manchester United</option>
                      <option value="Tottenham">Tottenham</option>
                      <option value="Bayern Munich">Bayern Munich</option>
                      <option value="Borussia Dortmund">Borussia Dortmund</option>
                      <option value="Barcelona">Barcelona</option>
                      <option value="Real Madrid">Real Madrid</option>
                      <option value="PSG">PSG</option>
                      <option value="AC Milan">AC Milan</option>
                      <option value="Inter Milan">Inter Milan</option>
                      <option value="Juventus">Juventus</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label 
                  htmlFor="opponent-select"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: isDarkMode ? "#F3F4F6" : "#111827",
                    transition: "color 0.3s ease"
                  }}
                >
                  Opponent
                </label>
                <select
                  id="opponent-select"
                  value={opponent}
                  onChange={(e) => setOpponent(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.625rem 0.75rem",
                    backgroundColor: isDarkMode ? "#374151" : "white",
                    color: isDarkMode ? "#F3F4F6" : "#111827",
                    border: isDarkMode ? "1px solid #4B5563" : "1px solid #D1D5DB",
                    borderRadius: "0.375rem",
                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: "right 0.5rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    transition: "all 0.3s ease"
                  }}
                >
                  <option value="">Select opponent</option>
                  {teamsList.length > 0 ? (
                    teamsList.map((team, index) => (
                      <option key={index} value={team.name}>{team.name}</option>
                    ))
                  ) : (
                    // Fallback options if API call fails
                    <>
                      <option value="Arsenal">Arsenal</option>
                      <option value="Chelsea">Chelsea</option>
                      <option value="Liverpool">Liverpool</option>
                      <option value="Manchester City">Manchester City</option>
                      <option value="Manchester United">Manchester United</option>
                      <option value="Tottenham">Tottenham</option>
                      <option value="Bayern Munich">Bayern Munich</option>
                      <option value="Borussia Dortmund">Borussia Dortmund</option>
                      <option value="Barcelona">Barcelona</option>
                      <option value="Real Madrid">Real Madrid</option>
                      <option value="PSG">PSG</option>
                      <option value="AC Milan">AC Milan</option>
                      <option value="Inter Milan">Inter Milan</option>
                      <option value="Juventus">Juventus</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "0.75rem",
              marginBottom: "2rem"
            }}>
              <button
                onClick={fetchTactics}
                disabled={!team || !opponent || loading}
                style={{
                  padding: "0.75rem 2rem",
                  backgroundColor: !team || !opponent ? (isDarkMode ? "#6B7280" : "#E5E7EB") : (isDarkMode ? "#2563EB" : "#3B82F6"),
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontWeight: "600",
                  cursor: !team || !opponent || loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  opacity: loading ? "0.7" : "1",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" style={{
                      animation: "spin 1s linear infinite",
                      width: "1.25rem",
                      height: "1.25rem"
                    }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" style={{
                        opacity: "0.25"
                      }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" style={{
                        opacity: "0.75"
                      }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Tactics...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                    Generate Tactics
                  </>
                )}
              </button>
              
              <button
                onClick={simulateMatch}
                disabled={!team || !opponent || loading}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: !team || !opponent ? (isDarkMode ? "#6B7280" : "#E5E7EB") : (isDarkMode ? "#0D9488" : "#0D9488"),
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontWeight: "600",
                  cursor: !team || !opponent || loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  opacity: loading ? "0.7" : "1",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 3v18"/>
                  <rect x="5" y="6" width="14" height="14" rx="7"/>
                </svg>
                Simulate Match
              </button>
            </div>

            {/* Loading Progress */}
            {loading && (
              <div style={{
                marginBottom: "2rem"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem"
                }}>
                  <span style={{
                    fontSize: "0.875rem",
                    color: isDarkMode ? "#D1D5DB" : "#6B7280"
                  }}>
                    Analyzing tactical data...
                  </span>
                  <span style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: isDarkMode ? "#D1D5DB" : "#6B7280"
                  }}>
                    {loadingProgress}%
                  </span>
                </div>
                <div style={{
                  height: "0.5rem",
                  backgroundColor: isDarkMode ? "#4B5563" : "#E5E7EB",
                  borderRadius: "9999px",
                  overflow: "hidden"
                }}>
                  <div 
                    style={{
                      height: "100%",
                      backgroundColor: isDarkMode ? "#2563EB" : "#3B82F6",
                      borderRadius: "9999px",
                      width: `${loadingProgress}%`,
                      transition: "width 0.3s ease"
                    }}
                  />
                </div>
              </div>
            )}

            {/* Formation Visualization and Analysis */}
            {tactics && !showSimulation && (
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "2rem",
                marginBottom: "2rem"
              }}>
                {/* Formation Visualization */}
                <div style={{
                  backgroundColor: "#15803D",
                  borderRadius: "0.75rem",
                  overflow: "hidden",
                  aspectRatio: "4/3",
                  position: "relative",
                  border: isDarkMode ? "1px solid #374151" : "1px solid #E5E7EB",
                }}>
                  {/* Field markings */}
                  <div style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}>
                    {/* Center circle */}
                    <div style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "30%",
                      height: "20%",
                      borderRadius: "50%",
                      border: "2px solid rgba(255, 255, 255, 0.4)"
                    }} />
                    
                    {/* Center line */}
                    <div style={{
                      position: "absolute",
                      top: "50%",
                      left: "0",
                      width: "100%",
                      height: "2px",
                      backgroundColor: "rgba(255, 255, 255, 0.4)"
                    }} />
                    
                    {/* Penalty areas */}
                    <div style={{
                      position: "absolute",
                      top: "0",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "60%",
                      height: "20%",
                      border: "2px solid rgba(255, 255, 255, 0.4)",
                      borderTop: "none"
                    }} />
                    
                    <div style={{
                      position: "absolute",
                      bottom: "0",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "60%",
                      height: "20%",
                      border: "2px solid rgba(255, 255, 255, 0.4)",
                      borderBottom: "none"
                    }} />
                    
                    {/* Goal areas */}
                    <div style={{
                      position: "absolute",
                      top: "0",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "20%",
                      height: "8%",
                      border: "2px solid rgba(255, 255, 255, 0.4)",
                      borderTop: "none"
                    }} />
                    
                    <div style={{
                      position: "absolute",
                      bottom: "0",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "20%",
                      height: "8%",
                      border: "2px solid rgba(255, 255, 255, 0.4)",
                      borderBottom: "none"
                    }} />
                  </div>
                  
                  {/* Formation visualization */}
                  {renderFormationVisualization()}
                </div>
                
                {/* Tactical Analysis */}
                <div style={{
                  backgroundColor: isDarkMode ? "#1F2937" : "white",
                  padding: "1.5rem",
                  borderRadius: "0.75rem",
                  border: isDarkMode ? "1px solid #374151" : "1px solid #E5E7EB",
                  height: "100%", 
                  overflow: "auto"
                }}>
                  <div 
                    dangerouslySetInnerHTML={{ __html: formatTacticalAnalysis(tactics) }}
                    style={{
                      fontSize: "0.9375rem",
                      lineHeight: "1.5"
                    }}
                  />
                  
                  <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "0.75rem",
                    marginTop: "1.5rem"
                  }}>
                    <button
                      onClick={copyToClipboard}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: isDarkMode ? "#374151" : "#F3F4F6",
                        color: isDarkMode ? "#F3F4F6" : "#111827",
                        border: "none",
                        borderRadius: "0.375rem",
                        fontWeight: "500",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.875rem",
                        transition: "background-color 0.15s ease-in-out"
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      Copy
                    </button>
                    
                    <button
                      onClick={shareAnalysis}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: isDarkMode ? "#374151" : "#F3F4F6",
                        color: isDarkMode ? "#F3F4F6" : "#111827",
                        border: "none",
                        borderRadius: "0.375rem",
                        fontWeight: "500",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.875rem",
                        transition: "background-color 0.15s ease-in-out"
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                      </svg>
                      Share
                    </button>
                    
                    <button
                      onClick={saveCurrentFormation}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: isDarkMode ? "#1D4ED8" : "#2563EB",
                        color: "white",
                        border: "none",
                        borderRadius: "0.375rem",
                        fontWeight: "500",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.875rem",
                        transition: "background-color 0.15s ease-in-out"
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                        <polyline points="17 21 17 13 7 13 7 21"></polyline>
                        <polyline points="7 3 7 8 15 8"></polyline>
                      </svg>
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Match Simulation Results */}
            {showSimulation && renderSimulationResults()}
            
            {/* Recent Formations */}
            {history.length > 0 && !tactics && (
              <div style={{
                marginTop: "2rem"
              }}>
                <h2 style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                  color: isDarkMode ? "#F3F4F6" : "#111827"
                }}>
                  Recent Formations
                </h2>
                
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: "1rem"
                }}>
                  {history.map((item, index) => (
                    <div 
                      key={index}
                      onClick={() => loadHistoryItem(item)}
                      style={{
                        backgroundColor: isDarkMode ? "#1F2937" : "white",
                        padding: "1rem",
                        borderRadius: "0.5rem",
                        border: isDarkMode ? "1px solid #374151" : "1px solid #E5E7EB",
                        cursor: "pointer",
                        transition: "all 0.15s ease-in-out"
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        marginBottom: "0.5rem",
                        color: isDarkMode ? "#F3F4F6" : "#111827"
                      }}>
                        {item.team} vs {item.opponent}
                      </div>
                      
                      <div style={{
                        fontSize: "0.75rem",
                        color: isDarkMode ? "#9CA3AF" : "#6B7280",
                        marginBottom: "0.5rem"
                      }}>
                        {item.date}
                      </div>
                      
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                      }}>
                        <span style={{
                          padding: "0.25rem 0.5rem",
                          backgroundColor: isDarkMode ? "#374151" : "#F3F4F6",
                          color: isDarkMode ? "#F3F4F6" : "#111827",
                          borderRadius: "0.25rem",
                          fontSize: "0.75rem",
                          fontWeight: "500"
                        }}>
                          {item.formation}
                        </span>
                        
                        <span style={{
                          fontSize: "0.75rem",
                          color: isDarkMode ? "#9CA3AF" : "#6B7280"
                        }}>
                          Formation
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Community Tab Content */}
        {activeTab === 'community' && renderCommunityTab()}
        
        {/* Leaderboard Tab Content */}
        {activeTab === 'leaderboard' && renderLeaderboardTab()}
        
        {/* Match History Sidebar */}
        {showHistory && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 50
          }}>
            <div style={{
              backgroundColor: isDarkMode ? "#1F2937" : "white",
              borderRadius: "0.75rem",
              width: "90%",
              maxWidth: "32rem",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem 1.5rem",
                borderBottom: isDarkMode ? "1px solid #374151" : "1px solid #E5E7EB"
              }}>
                <h3 style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: isDarkMode ? "#F3F4F6" : "#111827"
                }}>
                  Recent Analyses
                </h3>
                
                <button
                  onClick={() => setShowHistory(false)}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isDarkMode ? "#9CA3AF" : "#6B7280"
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <div style={{
                padding: "1rem"
              }}>
                {history.length === 0 ? (
                  <div style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: isDarkMode ? "#9CA3AF" : "#6B7280"
                  }}>
                    No analysis history yet.
                  </div>
                ) : (
                  history.map((item, index) => (
                    <div 
                      key={index}
                      onClick={() => loadHistoryItem(item)}
                      style={{
                        padding: "1rem",
                        borderBottom: index < history.length - 1 ? (isDarkMode ? "1px solid #374151" : "1px solid #E5E7EB") : "none",
                        cursor: "pointer",
                        transition: "background-color 0.15s ease-in-out"
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = isDarkMode ? "#374151" : "#F9FAFB";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <div style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        marginBottom: "0.25rem",
                        color: isDarkMode ? "#F3F4F6" : "#111827"
                      }}>
                        {item.team} vs {item.opponent}
                      </div>
                      
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between"
                      }}>
                        <div style={{
                          backgroundColor: isDarkMode ? "#1E3A8A" : "#DBEAFE",
                          color: isDarkMode ? "#93C5FD" : "#1E40AF",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                          padding: "0.125rem 0.5rem",
                          borderRadius: "9999px"
                        }}>
                          {item.formation}
                        </div>
                        
                        <div style={{
                          fontSize: "0.75rem",
                          color: isDarkMode ? "#9CA3AF" : "#6B7280"
                        }}>
                          {item.date}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Saved Formations Sidebar */}
        {showSaved && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 50
          }}>
            <div style={{
              backgroundColor: isDarkMode ? "#1F2937" : "white",
              borderRadius: "0.75rem",
              width: "90%",
              maxWidth: "32rem",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem 1.5rem",
                borderBottom: isDarkMode ? "1px solid #374151" : "1px solid #E5E7EB"
              }}>
                <h3 style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: isDarkMode ? "#F3F4F6" : "#111827"
                }}>
                  Saved Formations
                </h3>
                
                <button
                  onClick={() => setShowSaved(false)}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isDarkMode ? "#9CA3AF" : "#6B7280"
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <div style={{
                padding: "1rem"
              }}>
                {savedFormations.length === 0 ? (
                  <div style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: isDarkMode ? "#9CA3AF" : "#6B7280"
                  }}>
                    No saved formations yet.
                  </div>
                ) : (
                  savedFormations.map((item, index) => (
                    <div 
                      key={index}
                      onClick={() => loadSavedFormation(item)}
                      style={{
                        padding: "1rem",
                        borderBottom: index < savedFormations.length - 1 ? (isDarkMode ? "1px solid #374151" : "1px solid #E5E7EB") : "none",
                        cursor: "pointer",
                        transition: "background-color 0.15s ease-in-out"
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = isDarkMode ? "#374151" : "#F9FAFB";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <div style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        marginBottom: "0.25rem",
                        color: isDarkMode ? "#F3F4F6" : "#111827"
                      }}>
                        {item.team} vs {item.opponent}
                      </div>
                      
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between"
                      }}>
                        <div style={{
                          backgroundColor: isDarkMode ? "#065F46" : "#D1FAE5",
                          color: isDarkMode ? "#6EE7B7" : "#065F46",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                          padding: "0.125rem 0.5rem",
                          borderRadius: "9999px"
                        }}>
                          {item.formation}
                        </div>
                        
                        <div style={{
                          fontSize: "0.75rem",
                          color: isDarkMode ? "#9CA3AF" : "#6B7280"
                        }}>
                          {item.date}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

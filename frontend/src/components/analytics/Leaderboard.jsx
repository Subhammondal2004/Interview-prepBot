import { Trophy, Flame, HelpCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useEffect, useState } from "react";

const getRankStyle = (rank) => {
  switch (rank) {
    case 1:
      return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
    case 2:
      return "bg-gray-400/20 text-gray-500 border-gray-400/30";
    case 3:
      return "bg-orange-500/20 text-orange-600 border-orange-500/30";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const getRankIcon = (rank) => {
  if (rank <= 3) {
    return <Trophy className="h-4 w-4" />;
  }
  return <span className="text-sm font-bold">{rank}</span>;
};

export function Leaderboard() {
  const [leaderboard, setLeaderBoard] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [month, setMonth] = useState("");
  const now = new Date();
  const URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    async function fetch() {
      await axios
        .get(`${URL}/sessions/monthly-leaderboard`, {
          params: {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
          },
          withCredentials: true,
        })
        .then((res) => {
          setLeaderBoard(res.data.data.leaderboard);
          setCurrentUser(res.data.data.user);
          setMonth(res.data.data.month);
        });
    }
    fetch();
  }, []);
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  let mon = "";
  const getMonth = () => {
    switch (month.month) {
      case "01":
        mon = "January";
        break;
      case "02":
        mon = "February";
        break;
      case "03":
        mon = "March";
        break;
      case "04":
        mon = "April";
        break;
      case "05":
        mon = "May";
        break;
      case "06":
        mon = "June";
        break;
      case "07":
        mon = "July";
        break;
      case "08":
        mon = "August";
        break;
      case "09":
        mon = "September";
        break;
      case "10":
        mon = "October";
        break;
      case "11":
        mon = "November";
        break;
      case "12":
        mon = "December";
    }
  };
  getMonth();
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-soft animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Leaderboard</h3>
          <p className="text-sm text-muted-foreground">
            Top performers in <b>{mon}</b> month
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Flame className="h-4 w-4 text-orange-500" />
          <span>Streak bonus active</span>
        </div>
      </div>

      <div className="space-y-3">
        {leaderboard.map((user) => (
          <div
            key={user?.rank}
            className={cn(
              "flex items-center gap-4 p-3 rounded-lg transition-all",
              user?.userId === currentUser._id
                ? "bg-primary/10 border border-primary/20"
                : "hover:bg-muted/50"
            )}
          >
            {/* Rank */}
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border",
                getRankStyle(user?.rank)
              )}
            >
              {getRankIcon(user?.rank)}
            </div>

            {/* Avatar & Name */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(user.username)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p
                  className={cn(
                    "font-medium text-sm truncate",
                    user?.userId === currentUser._id
                      ? "text-primary"
                      : "text-foreground"
                  )}
                >
                  {user?.username}
                  {user?.userId === currentUser._id && (
                    <span className="text-xs ml-1">(You)</span>
                  )}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <HelpCircle className="h-3 w-3" />
                    {user?.totalQuestions}
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="h-3 w-3 text-orange-500" />
                    {user.streak} days
                  </span>
                </div>
              </div>
            </div>

            {/* Score */}
            <div className="text-right">
              <p className="font-bold text-foreground">
                {user?.totalScore.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">points</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

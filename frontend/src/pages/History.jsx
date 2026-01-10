import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { SessionCard } from "@/components/history/SessionCard";
import { categories } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Filter, Calendar, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SafeIcon } from '@/components/common/SafeIcon';
import axios from "axios";
import { Link } from "react-router-dom";

export default function History() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading ] = useState(false);

  const URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    async function fetchSessions() {
      setLoading(true);
      await axios
        .get(`${URL}/sessions/all-user-sessions`, {
          withCredentials: true,
        })
        .then((res) => {
          setSessions(res.data.data);
          setLoading(false);
        });
    }

    fetchSessions();
  }, []);

  const filteredSessions =
    selectedCategory === "all"
      ? sessions
      : sessions.filter((s) => s.domain === selectedCategory);

  const selectedCategoryData = categories.find(
    (c) => c.id === selectedCategory
  );

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Practice History
            </h1>
            <p className="text-muted-foreground mt-1">
              Review your past sessions and track improvement
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SafeIcon icon={Filter} iconClassName="h-4 w-4"/>
                {selectedCategoryData?.name || "All Categories"}
                <SafeIcon icon={ChevronDown} iconClassName="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setSelectedCategory("all")}>
                All Categories
              </DropdownMenuItem>
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="mr-2"><SafeIcon icon={category?.icon} iconClassName="h-4 w-4 text-primary"/></span>
                  {category.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Sessions List */}
        {sessions.length > 0 ? (
          <div className="space-y-4">
            {filteredSessions.length > 0 ? (
              <>
                {filteredSessions
                  .sort(
                    (a, b) =>
                      new Date(b.startTime).getTime() -
                      new Date(a.startTime).getTime()
                  )
                  .map((session, index) => (
                    <div
                      key={session._id}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <SessionCard session={session} />
                    </div>
                  ))}
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No sessions found
                </h3>
                <Link to="/practice">
                  <Button variant="outline">Start Practice</Button>
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <SafeIcon icon={Calendar} iconClassName="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No sessions found
            </h3>
            <p className="text-muted-foreground mb-6">
              {selectedCategory === "all"
                ? "Start practicing to build your history!"
                : "No sessions in this category yet."}
            </p>
            <Button
              variant="outline"
              onClick={(e) => setSelectedCategory(e.target.value)}
            >
              View All Sessions
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}

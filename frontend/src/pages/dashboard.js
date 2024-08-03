import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import CreateProjectModal from "../components/CreateProjectModal";
import AddBillingModal from "../components/AddBillingModal";
import NavItem from "../components/NavItem";
import HomeContent from "../components/HomeContent";
import BillingContent from "../components/BillingContent";
import ProjectContent from "../components/ProjectContent";
import { HomeIcon, CreditCardIcon } from '@heroicons/react/24/solid';
import { useUser } from "@/context/UserContext";

const inter = Inter({ subsets: ["latin"] });

export default function Dashboard() {
  const [newProjectName, setNewProjectName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [isAddingBilling, setIsAddingBilling] = useState(false);
  const [newBillingDetail, setNewBillingDetail] = useState({ number: "", cvv: "", expiry: "" });
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const { user, billingDetails, setProjects, projects, addCard, getProjectsByEmail } = useUser();

  useEffect(() => {
    const fetchProjects = async () => {
      if (user && user.email) {
        try {
          const userProjects = await getProjectsByEmail(user.email);
          setProjects(userProjects);
        } catch (error) {
          console.error("Failed to fetch projects:", error);
        }
      }
    };

    fetchProjects();
  }, [user, getProjectsByEmail]);

  const handleCreateProject = async () => {
    try {
      setIsCreating(false);
      if (user && user.email) {
        const userProjects = await getProjectsByEmail(user.email);
        setProjects(userProjects);
      }
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const handleAddBillingDetail = async () => {
    try {
      const newBilling = await addCard(newBillingDetail);
      setNewBillingDetail({ number: "", cvv: "", expiry: "" });
      setIsAddingBilling(false);
    } catch (error) {
      console.error("Failed to add billing detail:", error);
    }
  };

  const handleViewProject = (project) => {
    setSelectedProjectId(project.id);
    setCurrentView('project');
  };

  const defaultProject = user
    ? {
        id: 1,
        name: user.name,
        description: user.email,
      }
    : {
        id: 1,
        name: "Default Project",
        description: "No user logged in",
      };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white border-r border-gray-300 flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-700">AAK Cloud</h2>
        </div>
        <nav className="flex-1 p-6">
          <ul>
            <NavItem 
              icon={HomeIcon} 
              label="Home" 
              onClick={() => setCurrentView('home')} 
              isActive={currentView === 'home' || currentView === 'project'} 
            />
            <NavItem 
              icon={CreditCardIcon} 
              label="Billing" 
              onClick={() => setCurrentView('billing')} 
              isActive={currentView === 'billing'} 
            />
          </ul>
        </nav>
      </aside>
      <main className={`flex-1 flex flex-col p-8 bg-gray-100 ${inter.className}`}>
        <h1 className="text-md text-gray-700 font-bold mb-8">
          {user?.email} {'>'} {currentView.charAt(0).toUpperCase() + currentView.slice(1)}
        </h1>
        {currentView === 'home' && (
          <HomeContent
            defaultProject={defaultProject}
            projects={projects}
            onProjectClick={() => setIsCreating(true)}
            onViewProject={handleViewProject}
          />
        )}
        {currentView === 'billing' && (
          <BillingContent 
            billingDetails={billingDetails} 
            onAddBillingClick={() => setIsAddingBilling(true)} 
          />
        )}
        {currentView === 'project' && selectedProjectId && (
          <ProjectContent projectID={selectedProjectId} projects={projects} />
        )}
        <CreateProjectModal
          isOpen={isCreating}
          onClose={() => setIsCreating(false)}
          newProjectName={newProjectName}
          setNewProjectName={setNewProjectName}
          handleCreateProject={handleCreateProject}
        />
        <AddBillingModal
          isOpen={isAddingBilling}
          onClose={() => setIsAddingBilling(false)}
          newBillingDetail={newBillingDetail}
          setNewBillingDetail={setNewBillingDetail}
          handleAddBillingDetail={handleAddBillingDetail}
        />
      </main>
    </div>
  );
}

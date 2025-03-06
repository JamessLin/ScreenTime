import React from 'react';

interface AppUsage {
  name: string;
  usage: string;
}

const Dashboard: React.FC = () => {
  // Dummy data – replace with dynamic data from Tauri commands later
  const avgUsage = "2 hrs";
  const weeklyUsage: string[] = [
    "Mon: 1 hr", 
    "Tue: 2 hrs", 
    "Wed: 1.5 hrs", 
    "Thu: 2 hrs", 
    "Fri: 3 hrs", 
    "Sat: 4 hrs", 
    "Sun: 2.5 hrs"
  ];
  const mostUsedApps: AppUsage[] = [
    { name: 'Chrome', usage: '5 hrs' },
    { name: 'VSCode', usage: '3 hrs' },
    { name: 'Slack', usage: '2 hrs' },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Screentime Dashboard</h1>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Average Usage</h2>
        <p className="text-lg">{avgUsage}</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Weekly Usage</h2>
        <ul className="list-disc ml-6">
          {weeklyUsage.map((dayUsage, index) => (
            <li key={index} className="text-lg">{dayUsage}</li>
          ))}
        </ul>
      </section>
      
      <section>
        <h2 className="text-xl font-semibold">Most Used Apps</h2>
        <ul className="list-disc ml-6">
          {mostUsedApps.map((app, index) => (
            <li key={index} className="text-lg">
              {app.name} - {app.usage}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;

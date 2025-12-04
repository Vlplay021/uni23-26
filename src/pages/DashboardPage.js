import Dashboard from '../components/Dashboard';

function DashboardPage({ technologies }) {
  return (
    <div style={{ padding: '20px' }}>
      <Dashboard technologies={technologies} />
    </div>
  );
}

export default DashboardPage;
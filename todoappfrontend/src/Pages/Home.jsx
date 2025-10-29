import Navbar from '../Components/Navbar';

const Home = () => (
  <>
    <Navbar />
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 px-4">
      <h2 className="text-4xl font-bold text-green-800 mb-4">Welcome to MyApp</h2>
      <p className="text-lg text-gray-600 max-w-md text-center">
        /
      </p>
    </div>
  </>
);

export default Home;

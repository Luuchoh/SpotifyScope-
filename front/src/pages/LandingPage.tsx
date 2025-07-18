import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';
import { Music, BarChart3, Users, Zap, ArrowRight, Play, TrendingUp } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8 text-spotify-green" />,
      title: "Advanced Analytics",
      description: "Deep insights into your music taste with AI-powered analysis and predictive recommendations."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-spotify-green" />,
      title: "Trend Analysis",
      description: "Track your musical evolution over time with detailed listening pattern analysis."
    },
    {
      icon: <Users className="w-8 h-8 text-spotify-green" />,
      title: "Social Insights",
      description: "Compare your taste with global trends and discover new music through community data."
    },
    {
      icon: <Zap className="w-8 h-8 text-spotify-green" />,
      title: "Real-time Updates",
      description: "Live dashboard updates with WebSocket integration for instant music insights."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-spotify-black via-spotify-gray-900 to-spotify-gray-800">
      {/* Hero Section */}
      <section className=" bg-gradient-to-r from-spotify-green/10 to-transparent">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Music className="w-20 h-20 text-spotify-green animate-pulse-slow" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-spotify-green rounded-full animate-ping"></div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Unlock Your
              <span className="text-spotify-green block">Musical DNA</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-spotify-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              SpotifyScope provides advanced analytics and insights into your music listening habits, 
              going deeper than Spotify's native features with AI-powered analysis and predictive recommendations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="group bg-spotify-green text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-400 transition-all duration-300 shadow-2xl hover:shadow-spotify-green/25 flex items-center space-x-2"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="group bg-spotify-green text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-400 transition-all duration-300 shadow-2xl hover:shadow-spotify-green/25 flex items-center space-x-2"
                >
                  <span>Connect Spotify</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
              
              <Link
                to="/demo"
                className="group border-2 border-spotify-green text-spotify-green px-8 py-4 rounded-full text-lg font-semibold hover:bg-spotify-green hover:text-black transition-all duration-300 flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Try Demo</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-spotify-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose SpotifyScope?
            </h2>
            <p className="text-xl text-spotify-gray-300 max-w-3xl mx-auto">
              Experience music analytics like never before with our professional-grade insights and beautiful visualizations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-spotify-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-spotify-gray-700 hover:border-spotify-green/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-spotify-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Preview Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                See It In Action
              </h2>
              <p className="text-xl text-spotify-gray-300 max-w-3xl mx-auto">
                Explore our demo mode to experience the power of advanced music analytics without connecting your account.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-spotify-gray-800 to-spotify-gray-700 rounded-3xl p-8 md:p-12 border border-spotify-gray-600">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-6">
                    Demo Mode Features
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-center space-x-3 text-spotify-gray-300">
                      <div className="w-2 h-2 bg-spotify-green rounded-full"></div>
                      <span>Search and analyze any track or artist</span>
                    </li>
                    <li className="flex items-center space-x-3 text-spotify-gray-300">
                      <div className="w-2 h-2 bg-spotify-green rounded-full"></div>
                      <span>Audio feature analysis and visualization</span>
                    </li>
                    <li className="flex items-center space-x-3 text-spotify-gray-300">
                      <div className="w-2 h-2 bg-spotify-green rounded-full"></div>
                      <span>Artist insights and genre analysis</span>
                    </li>
                    <li className="flex items-center space-x-3 text-spotify-gray-300">
                      <div className="w-2 h-2 bg-spotify-green rounded-full"></div>
                      <span>Interactive charts and graphs</span>
                    </li>
                  </ul>
                  
                  <Link
                    to="/demo"
                    className="inline-flex items-center space-x-2 mt-8 bg-spotify-green text-black px-6 py-3 rounded-full font-semibold hover:bg-green-400 transition-colors"
                  >
                    <span>Try Demo Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                
                <div className="relative">
                  <div className="bg-spotify-black rounded-2xl p-6 border border-spotify-gray-600">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-spotify-gray-700 rounded animate-pulse"></div>
                      <div className="h-4 bg-spotify-gray-700 rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-spotify-green rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-spotify-green rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-spotify-green/10 to-transparent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Discover Your Musical Identity?
          </h2>
          <p className="text-xl text-spotify-gray-300 mb-12 max-w-2xl mx-auto">
            Join thousands of music lovers who have unlocked deeper insights into their listening habits.
          </p>
          
          {!isAuthenticated && (
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 bg-spotify-green text-black px-12 py-4 rounded-full text-xl font-semibold hover:bg-green-400 transition-all duration-300 shadow-2xl hover:shadow-spotify-green/25"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

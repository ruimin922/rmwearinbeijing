import { ArrowRight, Check, Home, User } from 'lucide-react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';

const colors = {
  primary: '#A8E6CF',
  secondary: '#FFD3B6',
  accent: '#A8C7E6',
  background: '#FDFFFC',
  text: '#3D3D3D',
};

const BarChart = () => (
  <div className="w-full h-96">
    <ResponsiveBar
      data={[
        { name: 'A', data: 100 },
        { name: 'B', data: 200 },
        { name: 'C', data: 150 },
      ]}
      keys={['data']}
      indexBy="name"
      margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={{ scheme: 'pastel1' }}
      borderWidth={1}
      borderColor={{
        from: 'color',
        modifiers: [['darker', 0.2]],
      }}
    />
  </div>
);

const LineChart = () => (
  <div className="w-full h-96">
    <ResponsiveLine
      data={[
        {
          id: 'A',
          data: [
            { x: 1, y: 10 },
            { x: 2, y: 20 },
          ],
        },
        {
          id: 'B',
          data: [
            { x: 1, y: 30 },
            { x: 2, y: 40 },
          ],
        },
      ]}
      enableCrosshair={false}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 0,
        max: 'auto',
      }}
      colors={[colors.primary, colors.secondary]}
    />
  </div>
);

const PieChart = () => (
  <div className="w-full h-96">
    <ResponsivePie
      data={[
        { id: 'A', value: 10 },
        { id: 'B', value: 20 },
        { id: 'C', value: 30 },
      ]}
      sortByValue
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      cornerRadius={0}
      activeOuterRadiusOffset={2}
      borderWidth={1}
      borderColor={{
        from: 'color',
        modifiers: [['darker', 0.2]],
      }}
      colors={[colors.primary, colors.secondary, colors.accent]}
    />
  </div>
);

const App = () => (
  <div className="bg-[#FDFFFC] min-h-screen flex flex-col">
    <header className={`bg-[${colors.primary}] text-[${colors.text}] py-6 px-10 flex justify-between items-center`}>
      <div className="flex items-center">
        <Home className="w-8 h-8 mr-2" />
        <h1 className="text-2xl font-bold">AI Product</h1>
      </div>
      <nav>
        <ul className="flex space-x-6">
          <li>
            <a href="#" className={`hover:text-[${colors.accent}]`}>
              Features
            </a>
          </li>
          <li>
            <a href="#" className={`hover:text-[${colors.accent}]`}>
              Pricing
            </a>
          </li>
          <li>
            <a href="#" className={`hover:text-[${colors.accent}]`}>
              About
            </a>
          </li>
        </ul>
      </nav>
      <div>
        <button
          className={`bg-[${colors.secondary}] text-[${colors.text}] px-4 py-2 rounded-md hover:bg-[${colors.accent}] transition-colors duration-300`}
        >
          Get Started
        </button>
      </div>
    </header>
    <main className="flex-1 px-10 py-20 overflow-y-auto">
      <section className="flex items-center justify-between mb-20">
        <div className="max-w-xl">
          <h2 className={`text-4xl font-bold mb-6 text-[${colors.text}]`}>
            Unleash the Power of AI
          </h2>
          <p className={`text-lg mb-8 text-[${colors.text}]`}>
            Our AI product is designed to revolutionize your business processes
            with cutting-edge technology and intelligent solutions.
          </p>
          <button
            className={`bg-[${colors.accent}] text-[${colors.text}] px-6 py-3 rounded-md flex items-center hover:bg-[${colors.secondary}] transition-colors duration-300`}
          >
            <span className="mr-2">Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div
          className={`w-96 h-96 bg-[${colors.secondary}] rounded-full flex items-center justify-center`}
        >
          <User className={`w-64 h-64 text-[${colors.text}]`} />
        </div>
      </section>
      <section className="mb-20">
        <h2 className={`text-3xl font-bold mb-8 text-[${colors.text}]`}>
          Features
        </h2>
        <div className="grid grid-cols-3 gap-8">
          <div className={`bg-[${colors.primary}] p-6 rounded-md`}>
            <Check className={`w-8 h-8 text-[${colors.text}] mb-4`} />
            <h3 className={`text-xl font-bold mb-2 text-[${colors.text}]`}>
              Machine Learning
            </h3>
            <p className={`text-[${colors.text}]`}>
              Our AI leverages advanced machine learning algorithms to provide
              intelligent solutions.
            </p>
          </div>
          <div className={`bg-[${colors.secondary}] p-6 rounded-md`}>
            <Check className={`w-8 h-8 text-[${colors.text}] mb-4`} />
            <h3 className={`text-xl font-bold mb-2 text-[${colors.text}]`}>
              Natural Language Processing
            </h3>
            <p className={`text-[${colors.text}]`}>
              Our AI can understand and process human language for seamless
              communication.
            </p>
          </div>
          <div className={`bg-[${colors.accent}] p-6 rounded-md`}>
            <Check className={`w-8 h-8 text-[${colors.text}] mb-4`} />
            <h3 className={`text-xl font-bold mb-2 text-[${colors.text}]`}>
              Computer Vision
            </h3>
            <p className={`text-[${colors.text}]`}>
              Our AI can analyze and interpret visual data for various
              applications.
            </p>
          </div>
        </div>
      </section>
      <section className="mb-20">
        <h2 className={`text-3xl font-bold mb-8 text-[${colors.text}]`}>
          Data Visualization
        </h2>
        <div className="grid grid-cols-3 gap-8">
          <div>
            <BarChart />
          </div>
          <div>
            <LineChart />
          </div>
          <div>
            <PieChart />
          </div>
        </div>
      </section>
      <section className="mb-20">
        <h2 className={`text-3xl font-bold mb-8 text-[${colors.text}]`}>
          Get Started Today
        </h2>
        <div
          className={`bg-[${colors.primary}] p-8 rounded-md flex items-center justify-between`}
        >
          <div>
            <h3 className={`text-2xl font-bold mb-4 text-[${colors.text}]`}>
              Ready to Explore AI?
            </h3>
            <p className={`text-[${colors.text}]`}>
              Sign up for our AI product and experience the future today.
            </p>
          </div>
          <button
            className={`bg-[${colors.secondary}] text-[${colors.text}] px-6 py-3 rounded-md hover:bg-[${colors.accent}] transition-colors duration-300`}
          >
            Sign Up
          </button>
        </div>
      </section>
    </main>
    <footer
      className={`bg-[${colors.primary}] text-[${colors.text}] py-6 px-10 flex justify-between items-center`}
    >
      <div>
        <p>&copy; 2024/9/5 18:01:30 AI Product. All rights reserved.</p>
      </div>
      <div>
        <ul className="flex space-x-6">
          <li>
            <a href="#" className={`hover:text-[${colors.accent}]`}>
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="#" className={`hover:text-[${colors.accent}]`}>
              Terms of Service
            </a>
          </li>
          <li>
            <a href="#" className={`hover:text-[${colors.accent}]`}>
              Contact
            </a>
          </li>
        </ul>
      </div>
    </footer>
  </div>
);

export default App;

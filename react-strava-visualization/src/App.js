import "./App.css";
import LineChart from "./Charts/LineChart";
import Histogram from "./Charts/Histogram";
import TimeSeries from "./Charts/TimeSeries";
import data from "./daniel-activities.csv";

function App() {
  return (
    <div className="row">
      <LineChart height={400} width={400} csv={data} />
      <TimeSeries height={400} width={400} csv={data} />
      <Histogram height={400} width={400} csv={data} />
    </div>
  );
}

export default App;
